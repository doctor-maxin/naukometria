import 'dotenv/config';
import IORedis from 'ioredis';
import { ImportProcessRepository } from '@/infrastructure/repositories';
import { BullMqEventBus } from '@/infrastructure/event-bus/bullmq-event-bus';
import { ImportWorker } from '@/infrastructure/workers/import-worker';
import { PrismaClient } from '@/generated/prisma';

async function startWorker() {
  const prisma = new PrismaClient();
  const importProcessRepository = new ImportProcessRepository(prisma);

  const connection = new IORedis({
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
  });

  const queue = (global as any).importQueue || {
    add: async () => {},
  };

  const eventBus = new BullMqEventBus(queue);

  const worker = new ImportWorker(
    connection,
    importProcessRepository,
    eventBus,
  );

  console.log('Import worker started');

  const shutdown = async () => {
    console.log('Shutting down worker...');
    await worker.close();
    await connection.quit();
    await prisma.$disconnect();
    process.exit(0);
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}

startWorker().catch(console.error);
