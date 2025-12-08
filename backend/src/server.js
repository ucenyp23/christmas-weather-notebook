import Fastify from "fastify";
import cookie from "fastify-cookie";
import rateLimit from "fastify-rate-limit";
import schema from "./schema.js";
import db from "./db.js";
import dotenv from "dotenv";
dotenv.config();
const PORT = process.env.PORT || 4000;

const app = Fastify({ logger: true });

app.register(cookie);

app.register(rateLimit, {
  max: Number(process.env.RATE_LIMIT_MAX) || 100,
  timeWindow: Number(process.env.RATE_LIMIT_TIME) || 15 * 60 * 1000
});

import { graphqlHandler } from "graphene-api"; // adjust import if needed
app.register(graphqlHandler, {
  path: "/graphql",
  schema,
  context: (req) => ({ cookies: req.cookies, req })
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
