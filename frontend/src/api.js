import { GraphQLClient, gql } from "graphql-request";
const endpoint = "http://localhost:4000/graphql";
const client = new GraphQLClient(endpoint, { credentials: "include" });

export async function gqlRequest(query, variables) {
  return client.request(query, variables);
}
