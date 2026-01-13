export interface IJournalRepository {
  findByRincId(rincId: string): Promise<any | null>;

  findByIssn(issn: string): Promise<any | null>;
}
