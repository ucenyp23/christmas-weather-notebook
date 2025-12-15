const URL = "http://localhost:4000";

export async function gql(query, variables) {
  const res = await fetch("http://localhost:4000", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables })
  });

  const json = await res.json();
  console.log(json);  // <-- log response

  if (json.errors) {
    throw new Error(json.errors[0].message);
  }

  return json.data;
}
