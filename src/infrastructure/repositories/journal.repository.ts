import { IJournalRepository } from '@/domain/repositories';
import { PrismaClient } from '@/generated/prisma/client';

export class JournalRepository implements IJournalRepository {
  constructor(private readonly prisma: PrismaClient) {}

  public async findByRincId(rincId: string): Promise<any | null> {
    return this.prisma.journal.findFirst({
      where: {
        rinc: rincId,
      },
    });
  }

  public async findByIssn(issn: string): Promise<any | null> {
    return this.prisma.journal.findFirst({
      where: {
        issn: issn,
      },
    });
  }
}
