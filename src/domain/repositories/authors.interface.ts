import { Author } from '@/generated/prisma/client';

export interface IAuthorRepository {
  findByRincId(rincId: string): Promise<Author | null>;
}
