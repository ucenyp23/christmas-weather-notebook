import Fastify from "fastify";
import cookie from "@fastify/cookie";
import rateLimit from "@fastify/rate-limit";
import dotenv from "dotenv";
dotenv.config();
import schema from "./schema.js";
import { buildTypeDefsAndResolvers } from "./schema-adapter.js";
import { ApolloServer } from "@apollo/server";
import { fastifyPlugin } from "@as-integrations/fastify";

const PORT = process.env.PORT || 4000;
const app = Fastify({ logger: true });

await app.register(cookie);

await app.register(rateLimit, {
  max: Number(process.env.RATE_LIMIT_MAX) || 100,
  timeWindow: Number(process.env.RATE_LIMIT_TIME) || 15 * 60 * 1000
});

const { typeDefs, resolvers } = buildTypeDefsAndResolvers(schema);

const apollo = new ApolloServer({ typeDefs, resolvers });
await apollo.start();

await app.register(fastifyPlugin(apollo), {
  path: "/graphql",
  context: async (request) => {
    return { req: { cookies: request.cookies, req: request } };
  }
});

app.addHook("onRequest", async (req, reply) => {
  reply.header("Access-Control-Allow-Origin", "http://localhost:5173");
  reply.header("Access-Control-Allow-Credentials", "true");
  reply.header("Access-Control-Allow-Headers", "Content-Type");
});

app.listen({ port: Number(PORT), host: "0.0.0.0" }).then(() => {
  app.log.info(`Server running on ${PORT}`);
}).catch(err => {
  app.log.error(err);
  process.exit(1);
});
