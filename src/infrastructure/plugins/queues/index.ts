import fp from 'fastify-plugin';
import { Queue } from 'bullmq';
import IORedis from 'ioredis';

const queuesPlugin = fp(async (app) => {
  const connection = new IORedis({
    host: app.config.REDIS_HOST,
    port: app.config.REDIS_PORT,
    maxRetriesPerRequest: null,
  });

  app.decorate('queues', {
    importQueue: new Queue('import-queue', { connection }),
    redisConnection: connection,
  });

  app.addHook('onClose', async () => {
    await connection.quit();
  });
});

declare module 'fastify' {
  interface FastifyInstance {
    queues: {
      importQueue: Queue;
      redisConnection: IORedis;
    };
  }
}

export default queuesPlugin;
