import { FastifyEnvOptions } from '@fastify/env';

export const envSchema = {
  type: 'object',
  required: ['PORT', 'DATABASE_URL'],
  properties: {
    PORT: {
      type: 'number',
      default: 3000,
    },
    NODE_ENV: {
      type: 'string',
      default: 'development',
    },
    DATABASE_URL: {
      type: 'string',
    },
  },
} satisfies FastifyEnvOptions['schema'];
