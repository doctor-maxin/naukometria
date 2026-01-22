import {
  type ImportProcess as PrismaImportProcess,
  PrismaClient,
  ImportStatus,
} from '@/generated/prisma/client';
import type { IImportProcessRepository } from '@/domain/repositories';

export class ImportProcessRepository implements IImportProcessRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(data: {
    filename: string;
    status: ImportStatus;
    filesPath: string;
  }): Promise<PrismaImportProcess> {
    const process = await this.prisma.importProcess.create({
      data: {
        filename: data.filename,
        filesPath: data.filesPath,
        status: data.status,
        totalArticles: 0,
        processedArticles: 0,
        failedArticles: 0,
      },
    });

    return process;
  }

  async save(prismaModel: PrismaImportProcess): Promise<PrismaImportProcess> {
    return await this.prisma.importProcess.update({
      where: { uuid: prismaModel.uuid },
      data: {
        status: prismaModel.status,
        totalArticles: prismaModel.totalArticles,
        processedArticles: prismaModel.processedArticles,
        failedArticles: prismaModel.failedArticles,
        errorMessage: prismaModel.errorMessage,
        completedAt: prismaModel.completedAt,
      },
    });
  }

  async updateProgress(
    uuid: string,
    data: {
      totalArticles?: number;
      processedArticles?: number;
      failedArticles?: number;
    },
  ): Promise<void> {
    await this.prisma.importProcess.update({
      where: { uuid },
      data: {
        ...(data.totalArticles !== undefined && { totalArticles: data.totalArticles }),
        ...(data.processedArticles !== undefined && { processedArticles: data.processedArticles }),
        ...(data.failedArticles !== undefined && { failedArticles: data.failedArticles }),
      },
    });
  }

  async markAsCompleted(uuid: string): Promise<void> {
    await this.prisma.importProcess.update({
      where: { uuid },
      data: {
        status: ImportStatus.COMPLETED,
        completedAt: new Date(),
      },
    });
  }

  async markAsFailed(uuid: string, error: string): Promise<void> {
    await this.prisma.importProcess.update({
      where: { uuid },
      data: {
        status: ImportStatus.FAILED,
        errorMessage: error,
        completedAt: new Date(),
      },
    });
  }

  async findById(uuid: string): Promise<PrismaImportProcess | null> {
    return await this.prisma.importProcess.findUnique({
      where: { uuid },
    });
  }
}
