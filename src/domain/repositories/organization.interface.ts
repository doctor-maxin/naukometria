import { Organization } from '@/generated/prisma/client';

export interface IOrganizationRepository {
  findByRincId(rincId: string): Promise<Organization | null>;
}
