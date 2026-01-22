import type { IOrganizationRepository } from '@/domain/repositories';
import { Organization, PrismaClient } from '@/generated/prisma/client';

export class OrganizationRepository implements IOrganizationRepository {
  constructor(private readonly prisma: PrismaClient) {}

  public async findByRincId(rincId: string): Promise<Organization | null> {
    return this.prisma.organization.findFirst({
      where: {
        rinc: rincId,
      },
    });
  }
}
