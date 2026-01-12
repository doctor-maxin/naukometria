import { PrismaClient } from '@/generated/prisma/client';
import type {
  ImportProcess,
  ImportProcessRepository,
  CreateImportProcessDTO,
  UpdateImportProcessDTO,
} from '@/application/repositories/import-process.repository';

export class PrismaImportProcessRepository implements ImportProcessRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(data: CreateImportProcessDTO): Promise<ImportProcess> {
    const process = await this.prisma.importProcess.create({
      data: {
        filename: data.filename,
        status: data.status || 'PROCESSING',
        totalArticles: data.totalArticles || 0,
        processedArticles: data.processedArticles || 0,
        failedArticles: data.failedArticles || 0,
        errorMessage: data.errorMessage,
        startedAt: data.startedAt || new Date(),
        completedAt: data.completedAt,
      },
    });

    return this.toDomain(process);
  }

  async findById(id: number): Promise<ImportProcess | null> {
    const process = await this.prisma.importProcess.findUnique({
      where: { id },
    });

    return process ? this.toDomain(process) : null;
  }

  async update(id: number, data: UpdateImportProcessDTO): Promise<ImportProcess> {
    const process = await this.prisma.importProcess.update({
      where: { id },
      data: {
        status: data.status,
        totalArticles: data.totalArticles,
        processedArticles: data.processedArticles,
        failedArticles: data.failedArticles,
        errorMessage: data.errorMessage,
        completedAt: data.completedAt,
      },
    });

    return this.toDomain(process);
  }

  private toDomain(prismaProcess: any): ImportProcess {
    return {
      id: prismaProcess.id,
      filename: prismaProcess.filename,
      status: prismaProcess.status as 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED',
      totalArticles: prismaProcess.totalArticles,
      processedArticles: prismaProcess.processedArticles,
      failedArticles: prismaProcess.failedArticles,
      errorMessage: prismaProcess.errorMessage,
      startedAt: prismaProcess.startedAt,
      completedAt: prismaProcess.completedAt,
    };
  }
}
