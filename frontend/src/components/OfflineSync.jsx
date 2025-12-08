import { createSignal, onMount } from "solid-js";
export default function OfflineSync({ api }) {
  const [status, setStatus] = createSignal("idle");
  const sendQueue = async () => {
    const out = JSON.parse(localStorage.getItem("outbox") || "[]");
    if (!out.length) return setStatus("empty");
    setStatus("syncing");
    for (const item of out) {
      try {
        await api.createNote(item);
        out.shift();
        localStorage.setItem("outbox", JSON.stringify(out));
      } catch (e) {
        setStatus("error");
        return;
      }
    }
    setStatus("synced");
  };
  onMount(() => {
    window.addEventListener("online", sendQueue);
  });
  return (<div>Sync: {status()}</div>);
}
