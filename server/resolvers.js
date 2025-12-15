import { getUser, saveUser } from "./db.js";
import { toC, feelsLike } from "./weather.js";
import { todayReward } from "./rewards.js";
import { hashPassword, verifyPassword } from "./auth.js";

export const resolvers = {
  Query: {
    me: (_, { username }) => getUser(username)
  },

  Mutation: {
    signup: (_, { username, password }) => {
      if (getUser(username)) {
        throw new Error("User already exists");
      }

      const user = {
        username,
        passwordHash: hashPassword(password),
        points: 0,
        notes: [],
        lastNoteDay: null
      };

      saveUser(username, user);
      return user;
    },

    login: (_, { username, password }) => {
      const user = getUser(username);
      if (!user) throw new Error("User not found");

      // migrate old users (no password)
      if (!user.passwordHash) {
        user.passwordHash = hashPassword(password);
        saveUser(username, user);
        return user;
      }

      if (!verifyPassword(password, user.passwordHash)) {
        throw new Error("Invalid password");
      }

      return user;
    },

    addNote: (_, args) => {
      const user = getUser(args.username);
      if (!user) throw new Error("Not authenticated");

      const tempC = toC(args.temp, args.unit);
      const feels = feelsLike(tempC, args.wind, args.precip);

      const note = {
        id: Date.now().toString(),
        title: args.title,
        location: args.location,
        datetime: args.datetime,
        tempC,
        feelsLikeC: feels,
        wind: args.wind,
        precip: args.precip
      };

      let points = 10;
      const today = new Date().toDateString();
      if (user.lastNoteDay !== today) {
        points += 5;
        user.lastNoteDay = today;
      }

      user.points += points;
      user.notes.push(note);
      saveUser(user.username, user);

      return {
        points,
        advice:
          feels < 0
            ? "Heavy coat, hat, gloves. Short walks."
            : feels < 10
            ? "Layer up. 20–30 min walk."
            : "Light jacket. Long walks fine.",
        reward: todayReward()
      };
    }
  }
};
