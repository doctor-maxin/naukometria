import { ImportProcessRepository } from '@/infrastructure/repositories';
import { IImportProcessRepository } from '@/domain/repositories';
import fp from 'fastify-plugin';

const repositoriesPlugin = fp(async (app) => {
  const importProcessRepository = new ImportProcessRepository(app.prisma);

  app.decorate('repositories', {
    importProcess: importProcessRepository as IImportProcessRepository,
  });

  app.log.info('Repositories successfuly registered');
});

declare module 'fastify' {
  interface FastifyInstance {
    repositories: {
      importProcess: IImportProcessRepository;
    };
  }
}

export default repositoriesPlugin;
