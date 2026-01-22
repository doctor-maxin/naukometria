import type { IAuthorRepository } from '@/domain/repositories';
import { PrismaClient, Author } from '@/generated/prisma/client';

export class AuthorRepository implements IAuthorRepository {
  constructor(private readonly prisma: PrismaClient) {}

  public async findByRincId(rincId: string): Promise<Author | null> {
    return this.prisma.author.findFirst({
      where: {
        rinc: rincId,
      },
    });
  }
}
