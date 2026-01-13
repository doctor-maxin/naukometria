import { ImportProcess as PrismaImportProcess, ImportStatus } from '@/generated/prisma/client';

export interface IImportProcessRepository {
  create(data: {
    filename: string;
    status: ImportStatus;
    filesPath: string;
  }): Promise<PrismaImportProcess>;

  save(prismaModel: PrismaImportProcess): Promise<PrismaImportProcess>;

  updateProgress(
    uuid: string,
    data: {
      totalArticles?: number;
      processedArticles?: number;
      failedArticles?: number;
    },
  ): Promise<void>;

  markAsCompleted(uuid: string): Promise<void>;

  markAsFailed(uuid: string, error: string): Promise<void>;

  findById(uuid: string): Promise<PrismaImportProcess | null>;
}

export interface IImportProcessJournalRepository {
  logEvent(data: {
    importProcessId: string;
    documentBody?: string;
    errorBody?: string;
  }): Promise<void>;

  getLogs(importProcessId: string): Promise<
    Array<{
      id: string;
      documentBody: string | null;
      errorBody: string | null;
      timestamp: Date;
    }>
  >;
}

import { Publication, RincArticle } from '@/generated/prisma/client';

export interface IPublicationRepository {
  findByRincId(rincId: number): Promise<Publication | null>;

  findByDoi(doi: string): Promise<Publication | null>;

  findByEdn(edn: string): Promise<Publication | null>;

  findByAny(rincId?: number, doi?: string, edn?: string): Promise<Publication | null>;

  create(data: {
    rincId?: number;
    doi?: string;
    edn?: string;
    titles: any;
    authors: any;
    year: number;
    journalTitle: string;
    issn?: string;
    volume?: string;
    issue?: string;
    pages?: string;
    abstracts?: any;
    keywords?: any;
    rubric?: string;
    udk?: string;
    cited?: number;
    coreCited?: number;
    risc?: number;
    coreRISC?: number;
    vak?: boolean;
    vakCategory?: number;
    whiteList?: boolean;
    whiteListLevel?: number;
    jcrQuartile?: number;
    sjrQuartile?: number;
    scopus?: boolean;
    wos?: boolean;
    rsci?: boolean;
  }): Promise<Publication>;

  update(
    uuid: string,
    data: {
      titles?: any;
      authors?: any;
      year?: number;
      journalTitle?: string;
      issn?: string;
      volume?: string;
      issue?: string;
      pages?: string;
      abstracts?: any;
      keywords?: any;
      rubric?: string;
      udk?: string;
      cited?: number;
      coreCited?: number;
      risc?: number;
      coreRISC?: number;
      vak?: boolean;
      vakCategory?: number;
      whiteList?: boolean;
      whiteListLevel?: number;
      jcrQuartile?: number;
      sjrQuartile?: number;
      scopus?: boolean;
      wos?: boolean;
      rsci?: boolean;
    },
  ): Promise<Publication>;

  createRincArticle(publicationUuid: string, rawData: any): Promise<RincArticle>;
}
