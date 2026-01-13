import { IImportProcessJournalRepository } from '@/domain/repositories';
import { PrismaClient } from '@/generated/prisma/client';

export class ImportProcessJournalRepository implements IImportProcessJournalRepository {
  constructor(private readonly prisma: PrismaClient) {}

  public async logEvent(data: {
    importProcessId: string;
    documentBody?: string;
    errorBody?: string;
  }): Promise<void> {
    await this.prisma.importProcessJournal.create({
      data: {
        importProcessId: data.importProcessId,
        documentBody: data.documentBody,
        errorBody: data.errorBody,
        timestamp: new Date(),
      },
    });
  }
}
