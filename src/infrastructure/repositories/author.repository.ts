import { IAuthorRepository } from '@/domain/repositories';
import { PrismaClient } from '@/generated/prisma/client';

export class AuthorRepository implements IAuthorRepository {
  constructor(private readonly prisma: PrismaClient) {}

  public async findByRincId(rincId: string): Promise<any | null> {
    return this.prisma.author.findFirst({
      where: {
        rinc: rincId,
      },
    });
  }
}
