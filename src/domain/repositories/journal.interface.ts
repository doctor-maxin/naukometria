import { Journal } from '@/generated/prisma/client';

export interface IJournalRepository {
  findByRincId(rincId: string): Promise<Journal | null>;

  findByIssn(issn: string): Promise<Journal | null>;
}
