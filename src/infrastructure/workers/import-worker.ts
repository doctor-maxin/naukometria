import { Worker, Job } from 'bullmq';
import IORedis from 'ioredis';
import { ProcessImportFilesUseCase } from '@/application/use-cases/process-import-files.use-case';

export class ImportWorker {
  private worker: Worker;

  constructor(
    private redisConnection: IORedis,
    private useCases: {
      processImportFiles: ProcessImportFilesUseCase;
    },
  ) {
    this.worker = new Worker('import-queue', this.processJob.bind(this), {
      connection: this.redisConnection,
    });

    this.worker.on('completed', (job: Job) => {
      console.log(`Job ${job.id} completed`);
    });

    this.worker.on('failed', (job: Job | undefined, error: Error) => {
      console.error(`Job ${job?.id} failed:`, error);
    });
  }

  private async processJob(job: Job) {
    const eventType = job.data.type;

    console.log(`Received event: ${eventType}`);

    switch (eventType) {
      case 'ImportProcessStarted':
        await this.useCases.processImportFiles.execute(job.data.data);
        break;

      default:
        console.warn(`Unknown event type: ${eventType}`);
    }
  }

  async close() {
    await this.worker.close();
  }
}
