import { ImportProcess as PrismaImportProcess } from '@/generated/prisma/client';
import { ImportStatus } from '@/generated/prisma/enums';

export interface IImportProcessRepository {
  create(data: {
    filename: string;
    status: ImportStatus;
    filesPath: string;
  }): Promise<PrismaImportProcess>;

  save(prismaModel: PrismaImportProcess): Promise<PrismaImportProcess>;

  updateProgress(
    uuid: string,
    data: {
      totalArticles?: number;
      processedArticles?: number;
      failedArticles?: number;
    },
  ): Promise<void>;

  markAsCompleted(uuid: string): Promise<void>;

  markAsFailed(uuid: string, error: string): Promise<void>;

  findById(uuid: string): Promise<PrismaImportProcess | null>;
}
