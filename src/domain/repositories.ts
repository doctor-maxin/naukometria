import { ImportProcess as PrismaImportProcess, ImportStatus } from '@/generated/prisma/client';

export interface IImportProcessRepository {
  create(data: {
    filename: string;
    status: ImportStatus;
    filesPath: string;
  }): Promise<PrismaImportProcess>;

  save(prismaModel: PrismaImportProcess): Promise<PrismaImportProcess>;

  updateProgress(uuid: string, data: {
    totalArticles?: number;
    processedArticles?: number;
    failedArticles?: number;
  }): Promise<void>;

  markAsCompleted(uuid: string): Promise<void>;

  markAsFailed(uuid: string, error: string): Promise<void>;
}

export interface IImportProcessJournalRepository {
  logEvent(data: {
    importProcessId: string;
    documentBody?: string;
    errorBody?: string;
  }): Promise<void>;

  getLogs(importProcessId: string): Promise<Array<{
    id: string;
    documentBody: string | null;
    errorBody: string | null;
    timestamp: Date;
  }>>;
}
