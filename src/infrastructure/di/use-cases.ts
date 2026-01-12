import fp from 'fastify-plugin';
import { ImportRincZipUseCase } from '../../application/import-rinc-zip';

const useCasesPlugin = fp(async (app) => {
  const importRincZip = new ImportRincZipUseCase(app.repositories.importProcess, app.fileValidator);

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
