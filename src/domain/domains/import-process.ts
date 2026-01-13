import { ImportProcess as PrismaImportProcess, ImportStatus } from '@/generated/prisma/client';

export class ImportProcess {
  constructor(private prismaModel: PrismaImportProcess) {}

  get id() {
    return this.prismaModel.uuid;
  }

  get status() {
    return this.prismaModel.status;
  }

  get filename() {
    return this.prismaModel.filename;
  }

  get filesPath() {
    return this.prismaModel.filesPath;
  }

  start() {
    if (this.prismaModel.status !== 'PENDING') {
      throw new Error('Can only start pending import process');
    }
    this.prismaModel.status = 'PROCESSING';
  }

  updateProgress(stats: { total?: number; processed?: number; failed?: number }) {
    if (stats.total !== undefined) this.prismaModel.totalArticles = stats.total;
    if (stats.processed !== undefined) this.prismaModel.processedArticles = stats.processed;
    if (stats.failed !== undefined) this.prismaModel.failedArticles = stats.failed;
  }

  markAsCompleted() {
    if (this.prismaModel.status !== 'PROCESSING') {
      throw new Error('Can only complete processing import process');
    }
    this.prismaModel.status = 'COMPLETED';
    this.prismaModel.completedAt = new Date();
  }

  markAsFailed(error: string) {
    if (this.prismaModel.status === 'COMPLETED') {
      throw new Error('Cannot mark completed process as failed');
    }
    this.prismaModel.status = 'FAILED';
    this.prismaModel.errorMessage = error;
    this.prismaModel.completedAt = new Date();
  }

  toPrisma() {
    return this.prismaModel;
  }

  static fromPrisma(prismaModel: PrismaImportProcess) {
    return new ImportProcess(prismaModel);
  }
}
