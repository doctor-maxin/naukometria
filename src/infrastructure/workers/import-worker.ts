import { Worker, Job } from 'bullmq';
import IORedis from 'ioredis';
import { readdir } from 'fs/promises';
import { join } from 'path';
import { IImportProcessRepository } from '@/domain/repositories';
import { EventBus, ImportProcessCompletedEvent, ImportProcessFailedEvent } from '@/application/events';

export class ImportWorker {
  private worker: Worker;

  constructor(
    private redisConnection: IORedis,
    private importProcessRepository: IImportProcessRepository,
    private eventBus: EventBus,
  ) {
    this.worker = new Worker(
      'import-queue',
      this.processJob.bind(this),
      { connection: this.redisConnection },
    );

    this.worker.on('completed', (job: Job) => {
      console.log(`Job ${job.id} completed`);
    });

    this.worker.on('failed', (job: Job | undefined, error: Error) => {
      console.error(`Job ${job?.id} failed:`, error);
    });
  }

  private async processJob(job: Job) {
    const data = job.data as ImportProcessStartedEventData;

    try {
      console.log(`Processing import: ${data.importProcessId}`);

      // Read files from directory
      const files = await this.readFiles(data.filesPath);

      // Update progress
      await this.importProcessRepository.updateProgress(data.importProcessId, {
        totalArticles: files.length,
      });

      // Process each file (placeholder logic)
      for (let i = 0; i < files.length; i++) {
        // TODO: Parse and import article
        console.log(`Processing file ${i + 1}/${files.length}: ${files[i]}`);

        await this.importProcessRepository.updateProgress(data.importProcessId, {
          processedArticles: i + 1,
        });
      }

      // Publish completed event
      await this.eventBus.publish(
        new ImportProcessCompletedEvent({
          importProcessId: data.importProcessId,
          totalArticles: files.length,
          processedArticles: files.length,
          failedArticles: 0,
        }),
      );

      await this.importProcessRepository.markAsCompleted(data.importProcessId);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';

      await this.eventBus.publish(
        new ImportProcessFailedEvent({
          importProcessId: data.importProcessId,
          error: errorMessage,
        }),
      );

      await this.importProcessRepository.markAsFailed(data.importProcessId, errorMessage);
      throw error;
    }
  }

  private async readFiles(dirPath: string): Promise<string[]> {
    const entries = await readdir(dirPath, { withFileTypes: true });
    const files = entries
      .filter((entry) => entry.isFile())
      .map((entry) => join(dirPath, entry.name));

    return files;
  }

  async close() {
    await this.worker.close();
  }
}

interface ImportProcessStartedEventData {
  importProcessId: string;
  filesPath: string;
  filename: string;
}
