import { FastifyEnvOptions } from "@fastify/env";

export const envSchema = {
  type: "object",
  required: ["PORT"],
  properties: {
    PORT: {
      type: "number",
      default: 3000,
    },
    NODE_ENV: {
      type: "string",
      default: "development",
    },
  },
} satisfies FastifyEnvOptions["schema"];
