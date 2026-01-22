import { FastifyEnvOptions } from '@fastify/env';

export const envSchema = {
  type: 'object',
  required: ['PORT', 'DATABASE_URL', 'REDIS_HOST', 'REDIS_PORT'],
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
    REDIS_HOST: {
      type: 'string',
      default: 'localhost',
    },
    REDIS_PORT: {
      type: 'number',
      default: 6379,
    },
    UPLOADS_DIR: {
      type: 'string',
      default: 'uploads/rinc/temp',
    },
    EXTRACT_DIR: {
      type: 'string',
      default: 'uploads/rinc',
    },
  },
} satisfies FastifyEnvOptions['schema'];
