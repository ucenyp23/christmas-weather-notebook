import SimpleJsonDB from "simple-json-db";
import path from "path";
const DB_PATH = path.join(process.cwd(), "backend", "data.json");
const db = new SimpleJsonDB(DB_PATH, { syncOnWrite: true });

if (!db.has("users")) db.set("users", {});
if (!db.has("notes")) db.set("notes", {});
if (!db.has("points")) db.set("points", {});
if (!db.has("meta")) db.set("meta", {});

export default db;
