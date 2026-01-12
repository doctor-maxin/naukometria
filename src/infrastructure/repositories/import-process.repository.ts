import { ImportProcess, PrismaClient } from '@/generated/prisma/client';
import { ImportProcessCreateInput } from '@/generated/prisma/models';

export class ImportProcessRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(data: ImportProcessCreateInput): Promise<ImportProcess> {
    const process = await this.prisma.importProcess.create({
      data: {
        filename: data.filename,
        filesPath: data.filesPath,
        status: data.status || 'PROCESSING',
        totalArticles: data.totalArticles || 0,
        processedArticles: data.processedArticles || 0,
        failedArticles: data.failedArticles || 0,
        errorMessage: data.errorMessage,
        startedAt: data.startedAt || new Date(),
        completedAt: data.completedAt,
      },
    });

    return process;
  }
}
