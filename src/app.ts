import Fastify from "fastify";
import envPlugin from "./plugins/config/env";

export async function createApp() {
  const app = Fastify({
    logger: {
      transport: {
        target: "pino-pretty",
        options: {
          translateTime: "HH:MM:ss Z",
          ignore: "pid,hostname",
        },
      },
    },
  });

  await app.register(envPlugin);

  return app;
}
