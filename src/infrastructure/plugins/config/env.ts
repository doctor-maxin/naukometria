import fastifyEnv, { FastifyEnvOptions } from '@fastify/env';
import fp from 'fastify-plugin';
import { envSchema } from './env.schema';

const options: FastifyEnvOptions = {
  schema: envSchema,
  dotenv: true,
  confKey: 'config',
};

const envPlugin = fp(async (app) => {
  await app.register(fastifyEnv, options);
});

declare module 'fastify' {
  interface FastifyInstance {
    config: {
      PORT: number;
      NODE_ENV: string;
      DATABASE_URL: string;
      REDIS_HOST: string;
      REDIS_PORT: number;
    };
  }
}

export default envPlugin;
