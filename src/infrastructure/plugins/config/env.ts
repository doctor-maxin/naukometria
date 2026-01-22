import fastifyEnv, { type FastifyEnvOptions } from '@fastify/env';
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

export interface IAppConfig {
  PORT: number;
  NODE_ENV: string;
  DATABASE_URL: string;
  REDIS_HOST: string;
  REDIS_PORT: number;
  UPLOADS_DIR: string;
  EXTRACT_DIR: string;
}

declare module 'fastify' {
  interface FastifyInstance {
    config: IAppConfig;
  }
}

export default envPlugin;
