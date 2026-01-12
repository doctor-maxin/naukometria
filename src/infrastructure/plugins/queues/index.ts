import fp from 'fastify-plugin';
import { Queue, Worker } from 'bullmq';
import IORedis from 'ioredis';

const queuesPlugin = fp(async (app) => {
  const connection = new IORedis({
    host: app.config.REDIS_HOST || 'localhost',
    port: parseInt(app.config.REDIS_PORT || '6379'),
  });

  app.decorate('queues', {
    importQueue: new Queue('import-queue', { connection }),
  });

  app.addHook('onClose', async () => {
    await connection.quit();
  });
});

declare module 'fastify' {
  interface FastifyInstance {
    queues: {
      importQueue: Queue;
    };
  }
}

export default queuesPlugin;
