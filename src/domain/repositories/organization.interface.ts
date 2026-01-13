export interface IOrganizationRepository {
  findByRincId(rincId: string): Promise<any | null>;
}
