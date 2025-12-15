export function queue(note) {
  const q = JSON.parse(localStorage.getItem("queue") || "[]");
  q.push(note);
  localStorage.setItem("queue", JSON.stringify(q));
}

export async function sync(send) {
  if (!navigator.onLine) return;
  const q = JSON.parse(localStorage.getItem("queue") || "[]");
  for (const n of q) await send(n);
  localStorage.removeItem("queue");
}
