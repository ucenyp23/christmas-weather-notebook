import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "./db.js";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "changeme";
const COOKIE_NAME = process.env.COOKIE_NAME || "wj_token";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

export async function register({ username, password }) {
  const users = db.get("users");
  if (users[username]) throw new Error("User exists");
  const hash = await bcrypt.hash(password, 10);
  users[username] = { id: uuidv4(), username, passwordHash: hash, createdAt: new Date().toISOString() };
  db.set("users", users);
  db.set(`points.${username}`, { total: 0, history: {} });
  return { username };
}

export async function login({ username, password }) {
  const users = db.get("users");
  const u = users[username];
  if (!u) throw new Error("Invalid credentials");
  const ok = await bcrypt.compare(password, u.passwordHash);
  if (!ok) throw new Error("Invalid credentials");
  const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  return { token, username };
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (e) {
    return null;
  }
}

export const cookieOpts = {
  httpOnly: true,
  sameSite: "lax",
  path: "/",
  secure: false
};
export const COOKIE_NAME_CONST = COOKIE_NAME;
