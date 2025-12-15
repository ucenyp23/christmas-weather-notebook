import { createSignal, onMount } from "solid-js";
import { gql } from "./api";
import { user, setUser, unit, setUnit } from "./store";
import { queue, sync } from "./offline";

export default function App() {
  const [feedback, setFeedback] = createSignal(null);
  const [mode, setMode] = createSignal("login");

  async function auth(username, password) {
    try {
      const query =
        mode() === "signup"
          ? `mutation($username:String!,$password:String!){
              signup(username:$username,password:$password){username points}
            }`
          : `mutation($username:String!,$password:String!){
              login(username:$username,password:$password){username points}
            }`;

      const variables = { username, password };
      const data = await gql(query, variables);
      setUser(data.signup ?? data.login);
    } catch (e) {
      alert(e.message);
    }
  }

  async function addNote(note) {
    try {
      const d = await gql(
        `mutation(
          $username:String!
          $title:String!
          $location:String!
          $datetime:String!
          $temp:Float!
          $unit:String!
        ) {
          addNote(
            username:$username
            title:$title
            location:$location
            datetime:$datetime
            temp:$temp
            unit:$unit
          ) {
            points advice reward
          }
        }`,
        note
      );
      setFeedback(d.addNote);
    } catch {
      queue(note);
      setFeedback({ points: 0, advice: "Saved offline", reward: null });
    }
  }

  onMount(() => sync(addNote));

  if (!user()) {
    return (
      <div>
        <h2>{mode() === "signup" ? "Create Account" : "Login"}</h2>

        <button onClick={() => setMode(mode() === "signup" ? "login" : "signup")}>
          Switch to {mode() === "signup" ? "Login" : "Signup"}
        </button>

        <button onClick={() => {
          const u = prompt("Username");
          const p = prompt("Password");
          auth(u, p);
        }}>
          Continue
        </button>
      </div>
    );
  }

  return (
    <>
      <h2>{user().username} – {user().points} pts</h2>

      <button onClick={() => setUnit(unit() === "C" ? "F" : "C")}>
        Unit: {unit()}
      </button>

      <button onClick={() =>
        addNote({
          username: user().username,
          title: "Weather Note",
          location: "Home",
          datetime: new Date().toISOString(),
          temp: 5,
          unit: unit()
        })
      }>
        Add Note
      </button>

      {feedback() && (
        <p>
          +{feedback().points} pts — {feedback().advice}<br/>
          {feedback().reward}
        </p>
      )}
    </>
  );
}
