import { Publication as PrismaPublication, RincArticle } from '@/generated/prisma/client';
import { Publication } from '../domains';

export interface IPublicationRepository {
  findByRincId(rincId: string): Promise<PrismaPublication | null>;

  findByDoi(doi: string): Promise<PrismaPublication | null>;

  findByEdn(edn: string): Promise<PrismaPublication | null>;

  findByAny(rincId?: string, doi?: string, edn?: string): Promise<PrismaPublication | null>;

  upsertPublication(data: Publication): Promise<PrismaPublication>;

  createRincArticle(
    publicationUuid: string,
    createRincArticle: string,
    rawData: any,
  ): Promise<RincArticle>;

  findById(id: string): Promise<PrismaPublication | null>;

  save(publication: Publication): Promise<PrismaPublication>;

  list(page: number, limit: number, importProcessUuid?: string): Promise<PrismaPublication[]>;
}
