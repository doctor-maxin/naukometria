import type { IJournalRepository } from '@/domain/repositories';
import { PrismaClient, Journal } from '@/generated/prisma/client';

export class JournalRepository implements IJournalRepository {
  constructor(private readonly prisma: PrismaClient) {}

  public async findByRincId(rincId: string): Promise<Journal | null> {
    return this.prisma.journal.findFirst({
      where: {
        rinc: rincId,
      },
    });
  }

  public async findByIssn(issn: string): Promise<Journal | null> {
    return this.prisma.journal.findFirst({
      where: {
        issn: issn,
      },
    });
  }
}
