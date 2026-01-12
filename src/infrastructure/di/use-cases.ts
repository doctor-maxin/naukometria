import fp from 'fastify-plugin';
import { ImportRincZipUseCase } from '../../application/use-cases/import-rinc-zip';

const useCasesPlugin = fp(async (app) => {
  const importRincZip = new ImportRincZipUseCase(
    app.repositories.importProcess,
    app.fileValidator,
    app.eventBus,
  );

  app.decorate('useCases', {
    importRincZip,
  });
});

declare module 'fastify' {
  interface FastifyInstance {
    useCases: {
      importRincZip: ImportRincZipUseCase;
    };
  }
}

export default useCasesPlugin;
