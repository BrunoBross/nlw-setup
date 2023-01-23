import Fastify from "fastify";
import cors from "@fastify/cors";
import { appRoutes } from "./routes";

const app = Fastify();

const PORT = process.env.PORT || 8080;

app.register(cors);

app.register(appRoutes);

app
  .listen({
    port: PORT,
    host: "0.0.0.0",
  })
  .then(() => {
    console.log("HTTP Server running!");
  });
