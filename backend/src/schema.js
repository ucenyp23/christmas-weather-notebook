import { buildSchema } from "graphene-api";
import db from "./db.js";
import { toCelsius, isoNow } from "./utils.js";
import { noteSchema, registerSchema, loginSchema } from "./validators.js";
import { register, login, verifyToken, COOKIE_NAME_CONST, cookieOpts } from "./auth.js";
import { computeFeelsLike, clothingAdvice, walkDurationAdvice } from "./rates.js";
import { computePoints, specialRewardForDate } from "./rewards.js";
import { v4 as uuidv4 } from "uuid";
import dayjs from "dayjs";

const schema = buildSchema({
  register: {
    type: "JSON",
    args: { username: "String!", password: "String!" },
    resolve: async ({ username, password }) => {
      await registerSchema.validateAsync({ username, password });
      const r = await register({ username, password });
      return { success: true, user: r };
    }
  },
  login: {
    type: "JSON",
    args: { username: "String!", password: "String!" },
    resolve: async ({ username, password }) => {
      await loginSchema.validateAsync({ username, password });
      const res = await login({ username, password });
      return { token: res.token, username: res.username };
    }
  },
  me: {
    type: "JSON",
    resolve: async ({ ctx }) => {
      const token = ctx.cookies[COOKIE_NAME_CONST];
      if (!token) return null;
      const payload = verifyToken(token);
      if (!payload) return null;
      const users = db.get("users");
      return users[payload.username] ? { username: payload.username } : null;
    }
  },

  createNote: {
    type: "JSON",
    args: {
      title: "String!",
      location: "String!",
      datetime: "String!",
      temp: "Float!",
      unit: "String!",
      wind_kph: "Float",
      precip_mm: "Float"
    },
    resolve: async ({ title, location, datetime, temp, unit, wind_kph = 0, precip_mm = 0, ctx }) => {
      // auth
      const token = ctx.cookies[COOKIE_NAME_CONST];
      const payload = verifyToken(token);
      if (!payload) throw new Error("Unauthorized");

      // validate
      await noteSchema.validateAsync({ title, location, datetime, temp, unit, wind_kph, precip_mm });

      // normalize temp to C
      const tempC = toCelsius(temp, unit);

      // compute feels-like and advice
      const feels = computeFeelsLike(tempC, wind_kph || 0, precip_mm || 0);
      const clothing = clothingAdvice(feels);
      const walk = walkDurationAdvice(tempC, feels);

      // persist note
      const notes = db.get("notes") || {};
      const id = uuidv4();
      const note = {
        id,
        title,
        location,
        datetime,
        temp_c: Number(tempC.toFixed(1)),
        wind_kph: wind_kph || 0,
        precip_mm: precip_mm || 0,
        createdAt: isoNow(),
        owner: payload.username
      };
      notes[id] = note;
      db.set("notes", notes);

      const pointsRes = computePoints(payload.username, datetime);

      const special = specialRewardForDate(datetime);
      return {
        note,
        computed: { feels_c: feels, clothing, walk },
        points: pointsRes,
        special
      };
    }
  },

  listNotes: {
    type: "JSON",
    args: {},
    resolve: async ({ ctx }) => {
      const token = ctx.cookies[COOKIE_NAME_CONST];
      const payload = verifyToken(token);
      if (!payload) throw new Error("Unauthorized");
      const notes = Object.values(db.get("notes") || {}).filter(n => n.owner === payload.username)
        .sort((a,b)=> new Date(b.datetime) - new Date(a.datetime));
      return notes;
    }
  },

  updateNote: {
    type: "JSON",
    args: { id: "String!", title: "String", location: "String", datetime: "String", temp: "Float", unit: "String", wind_kph: "Float", precip_mm: "Float" },
    resolve: async ({ id, title, location, datetime, temp, unit, wind_kph, precip_mm, ctx }) => {
      const token = ctx.cookies[COOKIE_NAME_CONST];
      const payload = verifyToken(token);
      if (!payload) throw new Error("Unauthorized");
      const notes = db.get("notes") || {};
      const existing = notes[id];
      if (!existing || existing.owner !== payload.username) throw new Error("Not found");
      const merged = { ...existing };
      if (title) merged.title = title;
      if (location) merged.location = location;
      if (datetime) merged.datetime = datetime;
      if (temp !== undefined) {
        if (!unit) throw new Error("Unit required when updating temperature");
        merged.temp_c = Number(toCelsius(temp, unit).toFixed(1));
      }
      if (wind_kph !== undefined) merged.wind_kph = wind_kph;
      if (precip_mm !== undefined) merged.precip_mm = precip_mm;
      await noteSchema.validateAsync({
        title: merged.title,
        location: merged.location,
        datetime: merged.datetime,
        temp: merged.temp_c,
        unit: "C",
        wind_kph: merged.wind_kph,
        precip_mm: merged.precip_mm
      });
      notes[id] = merged;
      db.set("notes", notes);
      const feels = computeFeelsLike(merged.temp_c, merged.wind_kph, merged.precip_mm);
      return { note: merged, computed: { feels_c: feels, clothing: clothingAdvice(feels), walk: walkDurationAdvice(merged.temp_c, feels) } };
    }
  },

  deleteNote: {
    type: "JSON",
    args: { id: "String!" },
    resolve: async ({ id, ctx }) => {
      const token = ctx.cookies[COOKIE_NAME_CONST];
      const payload = verifyToken(token);
      if (!payload) throw new Error("Unauthorized");
      const notes = db.get("notes") || {};
      const existing = notes[id];
      if (!existing || existing.owner !== payload.username) throw new Error("Not found");
      delete notes[id];
      db.set("notes", notes);
      return { success: true };
    }
  },

  points: {
    type: "JSON",
    resolve: async ({ ctx }) => {
      const token = ctx.cookies[COOKIE_NAME_CONST];
      const payload = verifyToken(token);
      if (!payload) throw new Error("Unauthorized");
      const pts = db.get("points") || {};
      return pts[payload.username] || { total: 0, history: {} };
    }
  },

  dailySpecials: {
    type: "JSON",
    resolve: async () => {
      const items = [];
      for (let d=1; d<=24; d++) {
        items.push({day: d, points: d * 10, message: `Day ${d} special: ${d * 10} pts` });
      }
      return items;
    }
  }
});

export default schema;