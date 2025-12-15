export const rewards = {
  1: "🎄 Festive Hat",
  2: "🧦 Wool Socks",
  3: "☕ Hot Cocoa",
  4: "🧣 Cozy Scarf",
  5: "🕯️ Candle",
  6: "🎶 Winter Playlist",
  7: "❄️ Snowflake Badge",
  8: "🧤 Gloves",
  9: "📖 Reading Night",
  10: "🥾 Boots",
  11: "🎥 Movie Night",
  12: "🍪 Cookies",
  13: "🧥 Puffy Jacket",
  14: "🔥 Fireplace",
  15: "🛷 Sled",
  16: "🎨 Art Night",
  17: "🧩 Puzzle",
  18: "🍵 Tea Break",
  19: "📸 Winter Photo",
  20: "🕰️ Slow Day",
  21: "🌟 Star Badge",
  22: "🎁 Surprise",
  23: "🥧 Pie",
  24: "🎄 Grand Winter Trophy"
};

export function todayReward() {
  const d = new Date();
  if (d.getMonth() !== 11) return null;
  return rewards[d.getDate()] || null;
}
