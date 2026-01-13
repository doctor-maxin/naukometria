import fp from 'fastify-plugin';
import { ImportWorker } from './import-worker';

const workersPlugin = fp(async (app) => {
  const importWorker = new ImportWorker(app.queues.redisConnection, app.useCases);

  app.decorate('workers', {
    import: importWorker,
  });

  app.addHook('onClose', async () => {
    await importWorker.close();
  });
});

declare module 'fastify' {
  interface FastifyInstance {
    workers: {
      import: ImportWorker;
    };
  }
}

export default workersPlugin;
