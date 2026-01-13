import fp from 'fastify-plugin';
import { ImportRincZipUseCase } from '../../application/use-cases/import-rinc-zip';
import { ProcessImportFilesUseCase } from '../../application/use-cases/process-import-files';
import { RincArticleParser } from '../../application/parsers/rinc-article-parser';
import { RetrieveProcessImportUseCase } from '@/application/use-cases/retrieve-porcess-import';

const useCasesPlugin = fp(async (app) => {
  const importRincZip = new ImportRincZipUseCase(
    app.repositories.importProcess,
    app.fileValidator,
    app.eventBus,
  );

  const processImportFiles = new ProcessImportFilesUseCase(
    app.repositories.importProcess,
    app.eventBus,
    new RincArticleParser(),
  );

  const retrieveProcessImport = new RetrieveProcessImportUseCase(app.repositories.importProcess);

  app.decorate('useCases', {
    importRincZip,
    processImportFiles,
    retrieveProcessImport,
  });
});

declare module 'fastify' {
  interface FastifyInstance {
    useCases: {
      importRincZip: ImportRincZipUseCase;
      processImportFiles: ProcessImportFilesUseCase;
      retrieveProcessImport: RetrieveProcessImportUseCase;
    };
  }
}

export default useCasesPlugin;
