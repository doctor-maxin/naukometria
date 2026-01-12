import { ImportProcessRepository } from '@/infrastructure/repositories';
import fp from 'fastify-plugin';

const repositoriesPlugin = fp(async (app) => {
  const importProcessRepository = new ImportProcessRepository(app.prisma);

  app.decorate('repositories', {
    importProcess: importProcessRepository,
  });

  app.log.info('Repositories successfuly registered');
});

declare module 'fastify' {
  interface FastifyInstance {
    repositories: {
      importProcess: ImportProcessRepository;
    };
  }
}

export default repositoriesPlugin;
