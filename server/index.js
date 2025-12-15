import { ApolloServer } from "apollo-server";
import { typeDefs } from "./schema.js";
import { resolvers } from "./resolvers.js";

const server = new ApolloServer({
  typeDefs,
  resolvers,
  cors: {
    origin: "*"  // allow all origins for dev
  }
});

server.listen({ port: 4000 })
  .then(() => console.log("🚀 GraphQL http://localhost:4000"));
