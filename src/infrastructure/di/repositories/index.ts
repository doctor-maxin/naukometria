import fp from 'fastify-plugin';
import { PrismaImportProcessRepository } from '../../repositories/import-process.prisma-repository';

const repositoriesPlugin = fp(async (app) => {
  const importProcessRepository = new PrismaImportProcessRepository(app.prisma);

  app.decorate('repositories', {
    importProcess: importProcessRepository,
  });

  app.log.info('Repositories successfuly registered');
});

declare module 'fastify' {
  interface FastifyInstance {
    repositories: {
      importProcess: PrismaImportProcessRepository;
    };
  }
}

export default repositoriesPlugin;
