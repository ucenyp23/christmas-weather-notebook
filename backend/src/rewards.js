import dayjs from "dayjs";
import db from "./db.js";

export function specialRewardForDate(dateISO) {
  const d = dayjs(dateISO);
  if (d.month() === 11 && d.date() >= 1 && d.date() <= 24) {
    const day = d.date();
    return { points: day * 10, message: `Special Day ${day} reward: ${day * 10} pts` };
  }
  return null;
}

export function computePoints(username, noteDateISO) {
  const base = 10;
  const dbPoints = db.get("points") || {};
  const userPoints = dbPoints[username] || { total: 0, history: {} };
  const day = dayjs(noteDateISO).format("YYYY-MM-DD");
  const alreadyToday = userPoints.history[day] && userPoints.history[day].notesCount > 0;
  const dailyBonus = alreadyToday ? 0 : 5;
  const special = specialRewardForDate(noteDateISO);
  const specialPts = special ? special.points : 0;
  const earned = base + dailyBonus + specialPts;
  // update
  userPoints.total = (userPoints.total || 0) + earned;
  userPoints.history = userPoints.history || {};
  userPoints.history[day] = userPoints.history[day] || { notesCount: 0, earned: 0 };
  userPoints.history[day].notesCount += 1;
  userPoints.history[day].earned += earned;
  dbPoints[username] = userPoints;
  db.set("points", dbPoints);
  return { earned, base, dailyBonus, special, total: userPoints.total };
}
