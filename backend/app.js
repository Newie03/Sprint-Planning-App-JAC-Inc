"use strict";
import * as cfg from "./config.js";
import Fastify from "fastify";
import mercurius from "mercurius";
import cors from "@fastify/cors";
import { schema } from "./schema.js";
import { resolvers } from "./resolvers.js";
import path from "path";
import FastifyStatic from "@fastify/static";
import { fileURLToPath } from "url";
const app = Fastify();

app.register(cors, {});

app.register(mercurius, {
  schema,
  resolvers,
  graphiql: true, // web page for to test queries
});
app.listen({ port: cfg.port });

// additions for handling static file
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// app.register(FastifyStatic, {
//  root: path.join(__dirname, "public"),
//  prefix: "/",
// });
// app.get("/", (req, reply) => reply.sendFile("index.html"));
// // if user refreshes page
// app.setNotFoundHandler((req, res) => {
//  res.sendFile("index.html");
// });