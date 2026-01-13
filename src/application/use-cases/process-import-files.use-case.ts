import { Publication } from '@/domain/domains/publication';
import {
  IAuthorRepository,
  IImportProcessJournalRepository,
  IImportProcessRepository,
  IJournalRepository,
  IOrganizationRepository,
  IPublicationRepository,
} from '@/domain/repositories';
import { readdir, unlink } from 'fs/promises';
import { join } from 'path';
import { EventBus, ImportProcessCompletedEvent, ImportProcessFailedEvent } from '../events';
import { RincArticleParser } from '../parsers/rinc-article-parser';

export interface ProcessImportFilesInput {
  importProcessId: string;
  filesPath: string;
}

export interface ProcessImportFilesOutput {
  totalArticles: number;
  processedArticles: number;
  failedArticles: number;
}

export class ProcessImportFilesUseCase {
  constructor(
    private readonly importProcessRepository: IImportProcessRepository,
    private readonly importProcessJournalRepository: IImportProcessJournalRepository,
    private readonly eventBus: EventBus,
    private readonly articleParser: RincArticleParser,
    private readonly publicationRepository: IPublicationRepository,
    private readonly authorRepository: IAuthorRepository,
    private readonly organizationRepository: IOrganizationRepository,
    private readonly journalRepository: IJournalRepository,
  ) {}

  async execute(input: ProcessImportFilesInput): Promise<ProcessImportFilesOutput> {
    try {
      // Read files from directory
      const files = await this.readFiles(input.filesPath);
      console.log(input, files);
      // Update total articles
      await this.importProcessRepository.updateProgress(input.importProcessId, {
        totalArticles: files.length,
      });

      // Process each file
      let processedCount = 0;
      let failedCount = 0;

      for (const filePath of files) {
        try {
          // TODO: Parse and import article
          await this.processFile(filePath, input.importProcessId);

          processedCount++;

          await this.importProcessRepository.updateProgress(input.importProcessId, {
            processedArticles: processedCount,
            failedArticles: failedCount,
          });
        } catch (error) {
          console.error(`Failed to process file ${filePath}:`, error);
          failedCount++;

          await this.importProcessJournalRepository.logEvent({
            importProcessId: input.importProcessId,
            errorBody: error instanceof Error ? error.message : String(error),
          });

          await this.importProcessRepository.updateProgress(input.importProcessId, {
            failedArticles: failedCount,
          });
        }
      }

      // Publish completed event
      await this.eventBus.publish(
        new ImportProcessCompletedEvent({
          importProcessId: input.importProcessId,
          totalArticles: files.length,
          processedArticles: processedCount,
          failedArticles: failedCount,
        }),
      );

      await this.importProcessRepository.markAsCompleted(input.importProcessId);
      
      return {
        totalArticles: files.length,
        processedArticles: processedCount,
        failedArticles: failedCount,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';

      await this.eventBus.publish(
        new ImportProcessFailedEvent({
          importProcessId: input.importProcessId,
          error: errorMessage,
        }),
      );

      await this.importProcessRepository.markAsFailed(input.importProcessId, errorMessage);
      throw error;
    }
  }

  private async readFiles(dirPath: string): Promise<string[]> {
    const itemsPath = join(dirPath, 'Items');

    try {
      const entries = await readdir(itemsPath, { withFileTypes: true });
      const files: string[] = [];

      for (const yearEntry of entries) {
        if (yearEntry.isDirectory()) {
          const yearPath = join(itemsPath, yearEntry.name);
          const pubEntries = await readdir(yearPath, { withFileTypes: true });

          for (const pubEntry of pubEntries) {
            if (pubEntry.isDirectory()) {
              const pubPath = join(yearPath, pubEntry.name);
              const fileEntries = await readdir(pubPath, { withFileTypes: true });

              for (const fileEntry of fileEntries) {
                if (fileEntry.isFile() && fileEntry.name.endsWith('.json')) {
                  files.push(join(pubPath, fileEntry.name));
                }
              }
            }
          }
        }
      }

      return files;
    } catch (error) {
      console.error('Error reading Items directory:', error);
      return [];
    }
  }

  private async processFile(filePath: string, processImportUuid: string): Promise<void> {
    try {
      // Parse article from JSON
      const article = await this.articleParser.parse(filePath);

      // Create publication from article (type is automatically determined)
      const publication = Publication.createFromArticle(article);

      // Step 1: Process authors
      for (const author of article.authors) {
        if (!author.id) continue;

        const existingAuthor = await this.authorRepository.findByRincId(author.id.toString());

        if (!existingAuthor) continue;

        publication.addAuthor(existingAuthor.uuid);

        for (const orgId of author.orgIds ?? []) {
          const existingOrg = await this.organizationRepository.findByRincId(orgId.toString());

          if (!existingOrg) continue;

          publication.addOrganization(existingOrg.uuid);
        }
      }

      if (article.data.journal) {
        let existingJournal = await this.journalRepository.findByRincId(
          article.data.journal.titleId.toString(),
        );

        if (!existingJournal) {
          existingJournal = await this.journalRepository.findByIssn(article.data.journal.issn);
        }

        if (existingJournal) publication.addJournal(existingJournal.uuid);
      }

      const publicationRecord = await this.publicationRepository.upsertPublication(publication);
      await this.publicationRepository.createRincArticle(
        publicationRecord.uuid,
        processImportUuid,
        article.data,
      );

      console.log(`Processed article: ${article.getTitleRu()}`);
    } catch (error) {
      // Log error to import process journal
      await this.importProcessJournalRepository.logEvent({
        importProcessId: processImportUuid,
        errorBody: error instanceof Error ? error.message : String(error),
      });

      throw error;
    }
  }
}
