import { readdir } from 'fs/promises';
import { join } from 'path';
import { IImportProcessRepository } from '@/domain/repositories';
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
    private readonly eventBus: EventBus,
    private readonly articleParser: RincArticleParser,
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
          await this.processFile(filePath);

          processedCount++;

          await this.importProcessRepository.updateProgress(input.importProcessId, {
            processedArticles: processedCount,
            failedArticles: failedCount,
          });
        } catch (error) {
          console.error(`Failed to process file ${filePath}:`, error);
          failedCount++;

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

  private async processFile(filePath: string): Promise<void> {
    // Parse article from JSON
    const article = await this.articleParser.parse(filePath);

    // TODO: Import article to database
    console.log(`Parsed article: ${article.getTitleRu()}, authors: ${article.getAuthorsList()}`);
    console.log(`DOI: ${article.doi}, UDK: ${article.udk}`);
  }
}
