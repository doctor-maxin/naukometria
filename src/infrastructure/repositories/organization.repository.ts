import { IOrganizationRepository } from '@/domain/repositories';
import { PrismaClient } from '@/generated/prisma/client';

export class OrganizationRepository implements IOrganizationRepository {
  constructor(private readonly prisma: PrismaClient) {}

  public async findByRincId(rincId: string): Promise<any | null> {
    return this.prisma.organization.findFirst({
      where: {
        rinc: rincId,
      },
    });
  }
}
