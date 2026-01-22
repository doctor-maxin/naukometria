import { RincArticleParser } from '@/application/parsers/rinc-article-parser';
import { ImportRincZipUseCase } from '@/application/use-cases/import-rinc-zip.use-case';
import { ListPublicationsUseCase } from '@/application/use-cases/list-publication.use-case';
import { ProcessImportFilesUseCase } from '@/application/use-cases/process-import-files.use-case';
import { RetrieveProcessImportUseCase } from '@/application/use-cases/retrieve-process-import.use-case';
import { RetrievePublicationUseCase } from '@/application/use-cases/retrieve-publication.use-case';
import { UpdatePublicationUseCase } from '@/application/use-cases/update-publication.use-case';
import fp from 'fastify-plugin';

const useCasesPlugin = fp(async (app) => {
  const importRincZip = new ImportRincZipUseCase(
    app.repositories.importProcess,
    app.fileValidator,
    app.eventBus,
    app.config,
  );

  const processImportFiles = new ProcessImportFilesUseCase(
    app.repositories.importProcess,
    app.repositories.importProcessJournal,
    app.eventBus,
    new RincArticleParser(),
    app.repositories.publication,
    app.repositories.author,
    app.repositories.organization,
    app.repositories.journal,
    app.log,
  );

  const retrieveProcessImport = new RetrieveProcessImportUseCase(app.repositories.importProcess);
  const updatePublication = new UpdatePublicationUseCase(app.repositories.publication);
  const listPublications = new ListPublicationsUseCase(app.repositories.publication);
  const retrievePublication = new RetrievePublicationUseCase(app.repositories.publication);

  app.decorate('useCases', {
    importRincZip,
    processImportFiles,
    retrieveProcessImport,
    updatePublication,
    listPublications,
    retrievePublication,
  });
});

declare module 'fastify' {
  interface FastifyInstance {
    useCases: {
      importRincZip: ImportRincZipUseCase;
      processImportFiles: ProcessImportFilesUseCase;
      retrieveProcessImport: RetrieveProcessImportUseCase;
      updatePublication: UpdatePublicationUseCase;
      listPublications: ListPublicationsUseCase;
      retrievePublication: RetrievePublicationUseCase;
    };
  }
}

export default useCasesPlugin;
