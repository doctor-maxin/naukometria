import Fastify from 'fastify';
import multipart from '@fastify/multipart';
import envPlugin from './infrastructure/plugins/config/env';
import prismaPlugin from './infrastructure/database/prisma';
import useCasesPlugin from './infrastructure/di/use-cases';
import v1Routes from './interfaces/routes/v1';

export async function createApp() {
  const app = Fastify({
    logger: {
      level: process.env.NODE_ENV !== 'production' ? 'debug' : 'info',
      transport: {
        target: 'pino-pretty',
        options: {
          translateTime: 'HH:MM:ss Z',
          ignore: 'pid,hostname',
        },
      },
    },
  });

  await app.register(envPlugin);
  await app.register(prismaPlugin);
  await app.register(useCasesPlugin);
  await app.register(multipart, {
    attachFieldsToBody: true,
    limits: {
      fsileSize: 8 * 1024 * 1024 * 50,
    },
  });
  await app.register(v1Routes, { prefix: '/api/v1' });

  return app;
}
