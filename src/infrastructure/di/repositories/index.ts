import {
  AuthorRepository,
  ImportProcessRepository,
  JournalRepository,
  OrganizationRepository,
  PublicationRepository,
} from '@/infrastructure/repositories';
import {
  IAuthorRepository,
  IImportProcessRepository,
  IJournalRepository,
  IOrganizationRepository,
  IPublicationRepository,
} from '@/domain/repositories';
import fp from 'fastify-plugin';

const repositoriesPlugin = fp(async (app) => {
  const importProcessRepository = new ImportProcessRepository(app.prisma);
  const publicationRepository = new PublicationRepository(app.prisma);
  const authorRepository = new AuthorRepository(app.prisma);
  const organizationRepository = new OrganizationRepository(app.prisma);
  const journalRepository = new JournalRepository(app.prisma);

  app.decorate('repositories', {
    importProcess: importProcessRepository as IImportProcessRepository,
    publication: publicationRepository,
    author: authorRepository,
    organization: organizationRepository,
    journal: journalRepository,
  });

  app.log.info('Repositories successfuly registered');
});

declare module 'fastify' {
  interface FastifyInstance {
    repositories: {
      importProcess: IImportProcessRepository;
      publication: IPublicationRepository;
      author: IAuthorRepository;
      organization: IOrganizationRepository;
      journal: IJournalRepository;
    };
  }
}

export default repositoriesPlugin;
