import { Publication } from '@/domain/domains';
import { IPublicationRepository } from '@/domain/repositories';
import {
  PrismaClient,
  Publication as PrismaPublication,
  PublicationType,
  RincArticle,
} from '@/generated/prisma/client';

export class PublicationRepository implements IPublicationRepository {
  constructor(private readonly prisma: PrismaClient) {}

  public findByRincId(rincId: string): Promise<PrismaPublication | null> {
    return this.prisma.publication.findFirst({
      where: {
        rincId,
      },
    });
  }

  public findByDoi(doi: string): Promise<PrismaPublication | null> {
    return this.prisma.publication.findFirst({
      where: {
        doi,
      },
    });
  }

  public findByEdn(edn: string): Promise<PrismaPublication | null> {
    return this.prisma.publication.findFirst({
      where: {
        edn,
      },
    });
  }

  public findByAny(
    rincId?: string | null,
    doi?: string | null,
    edn?: string | null,
  ): Promise<PrismaPublication | null> {
    return this.prisma.publication.findFirst({
      where: {
        OR: [{ rincId }, { doi }, { edn }],
      },
    });
  }

  public async findById(uuid: string): Promise<PrismaPublication | null> {
    return this.prisma.publication.findUnique({
      where: {
        uuid,
      },
    });
  }

  public async upsertPublication(publication: Publication): Promise<PrismaPublication> {
    const existing = await this.findByAny(publication.rincId, publication.doi, publication.edn);

    const publicationData = {
      rincId: publication.rincId,
      doi: publication.doi,
      edn: publication.edn,
      type: publication.type,
      isManuallySet: publication.isManuallySet,
      title: publication.title,
      authors: publication.authors,
      organizations: publication.organizations,
      publishingHouse: publication.publishingHouse,
      journalIssue: publication.journalIssue,
      pages: publication.pages,
      publicationYear: publication.publicationYear,
      citations: publication.citations,
      language: publication.language,
      keywords: publication.keywords,
      description: publication.description,
      bibliography: publication.bibliography,
      fundingSource: publication.fundingSource,
      sourceLink: publication.sourceLink,
      textLink: publication.textLink,
      attachmentUuid: publication.attachmentUuid,
      totalCitations: publication.totalCitations,
      rubrics: publication.rubrics,
      isFullText: publication.isFullText,
      isNew: existing ? false : publication.isNew, // Только для новых
      isActive: publication.isActive,
      updatedAt: new Date(),
    };

    if (existing) {
      return this.prisma.publication.update({
        where: { uuid: existing.uuid },
        data: publicationData,
      });
    } else {
      return this.prisma.publication.create({
        data: {
          ...publicationData,
          createdAt: new Date(),
        },
      });
    }
  }

  public async save(publication: Publication): Promise<PrismaPublication> {
    return this.prisma.publication.update({
      where: { uuid: publication.uuid },
      data: {
        rincId: publication.rincId,
        doi: publication.doi,
        edn: publication.edn,
        type: publication.type,
        isManuallySet: publication.isManuallySet,
        title: publication.title,
        authors: publication.authors,
        organizations: publication.organizations,
        publishingHouse: publication.publishingHouse,
        journalIssue: publication.journalIssue,
        pages: publication.pages,
        publicationYear: publication.publicationYear,
        citations: publication.citations,
        language: publication.language,
        keywords: publication.keywords,
        description: publication.description,
        bibliography: publication.bibliography,
        fundingSource: publication.fundingSource,
        sourceLink: publication.sourceLink,
        textLink: publication.textLink,
        attachmentUuid: publication.attachmentUuid,
        totalCitations: publication.totalCitations,
        rubrics: publication.rubrics,
        isFullText: publication.isFullText,
        isNew: publication.isNew,
        isActive: publication.isActive,
        updatedAt: new Date(),
      },
    });
  }

  public createRincArticle(
    publicationUuid: string,
    processImportUuid: string,
    rawData: any,
  ): Promise<RincArticle> {
    return this.prisma.rincArticle.create({
      data: {
        publication: {
          connect: { uuid: publicationUuid },
        },
        processImportUuid,
        rawData,
      },
    });
  }

  public async list(
    page: number,
    limit: number,
    importProcessUuid?: string,
  ): Promise<PrismaPublication[]> {
    if (importProcessUuid) {
      const records = await this.prisma.rincArticle.findMany({
        skip: (page - 1) * limit,
        take: limit,
        where: {
          processImportUuid: importProcessUuid,
        },
        include: {
          publication: true,
        },
      });

      return records.map((article) => article.publication);
    }
    return this.prisma.publication.findMany({
      skip: (page - 1) * limit,
      take: limit,
    });
  }
}
