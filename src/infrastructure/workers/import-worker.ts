import { Worker, Job } from 'bullmq';
import IORedis from 'ioredis';
import { ProcessImportFilesUseCase } from '@/application/use-cases/process-import-files.use-case';
import { FastifyBaseLogger } from 'fastify';

export class ImportWorker {
  private worker: Worker;

  constructor(
    private redisConnection: IORedis,
    private useCases: {
      processImportFiles: ProcessImportFilesUseCase;
    },
    private logger: FastifyBaseLogger,
  ) {
    this.worker = new Worker('import-queue', this.processJob.bind(this), {
      connection: this.redisConnection,
    });

    this.worker.on('completed', (job: Job) => {
      this.logger.info(`Job ${job.id} completed`);
    });

    this.worker.on('failed', (job: Job | undefined, error: Error) => {
      this.logger.error(error, `Job ${job?.id} failed:`);
    });
  }

  private async processJob(job: Job) {
    const eventType = job.data.type;

    this.logger.info(`Received event: ${eventType}`);

    switch (eventType) {
      case 'ImportProcessStarted':
        await this.useCases.processImportFiles.execute(job.data.data);
        break;

      default:
        this.logger.warn(`Unknown event type: ${eventType}`);
    }
  }

  async close() {
    await this.worker.close();
  }
}
