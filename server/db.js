import JSONdb from "simple-json-db";

export const db = new JSONdb("./data.json");

export function getUser(username) {
  return db.get(username);
}

export function saveUser(username, data) {
  db.set(username, data);
}
