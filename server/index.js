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

// after creating `server` (ApolloServer instance)
server.listen({ port: 4000, host: "0.0.0.0" }).then(({ url }) => {
  console.log(`🚀 GraphQL ${url}`);
});
