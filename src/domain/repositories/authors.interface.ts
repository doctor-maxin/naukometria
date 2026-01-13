export interface IAuthorRepository {
  findByRincId(rincId: string): Promise<any | null>;
}
