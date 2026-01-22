import { PublicationType } from '@/generated/prisma/enums';
import type { Publication as PrismaPublication } from '@/generated/prisma/client';
import { Article } from '@/domain/domains/article';
import type { IUpdatePublicationDto } from '@/interfaces/dto/update-publication.request';

interface DeterminePublicationTypeInput {
  typeCode?: string | null;
  genre?: string | null;
  title?: string | null;
  isManuallySet?: boolean;
  currentType?: PublicationType;
}

export class Publication {
  constructor(private prismaModel: PrismaPublication) {}

  get uuid(): string {
    return this.prismaModel.uuid;
  }
  get authors(): string[] {
    return this.prismaModel.authors;
  }
  get rincId(): string | null {
    return this.prismaModel.rincId;
  }
  get doi(): string | null {
    return this.prismaModel.doi;
  }
  get edn(): string | null {
    return this.prismaModel.edn;
  }
  get type(): PublicationType {
    return this.prismaModel.type;
  }
  get isManuallySet(): boolean {
    return this.prismaModel.isManuallySet;
  }
  get isNew(): boolean {
    return this.prismaModel.isNew ?? false;
  }
  get isFullText(): boolean {
    return this.prismaModel.isFullText ?? false;
  }
  get isActive(): boolean {
    return this.prismaModel.isActive;
  }
  get title(): string {
    return this.prismaModel.title;
  }
  get organizations(): string[] {
    return this.prismaModel.organizations;
  }
  get rubrics(): string[] {
    return this.prismaModel.rubrics;
  }
  get totalCitations(): number | null {
    return this.prismaModel.totalCitations;
  }
  get attachmentUuid(): string | null {
    return this.prismaModel.attachmentUuid;
  }
  get textLink(): string | null {
    return this.prismaModel.textLink;
  }
  get sourceLink(): string | null {
    return this.prismaModel.sourceLink;
  }
  get pages(): string | null {
    return this.prismaModel.pages;
  }
  get publishingHouse(): string | null {
    return this.prismaModel.publishingHouse;
  }
  get journalIssue(): string | null {
    return this.prismaModel.journalIssue;
  }
  get citations(): string | null {
    return this.prismaModel.citations;
  }
  get publicationYear(): Date | null {
    return this.prismaModel.publicationYear;
  }
  get language(): string | null {
    return this.prismaModel.language;
  }
  get keywords(): string | null {
    return this.prismaModel.keywords;
  }
  get description(): string | null {
    return this.prismaModel.description;
  }
  get bibliography(): string[] {
    return this.prismaModel.bibliography;
  }
  get fundingSource(): string | null {
    return this.prismaModel.fundingSource;
  }

  addAuthor(value: string) {
    if (this.prismaModel.authors) {
      this.prismaModel.authors.push(value);
    } else {
      this.prismaModel.authors = [value];
    }
  }

  addOrganization(value: string) {
    if (this.prismaModel.organizations) {
      this.prismaModel.organizations.push(value);
    } else {
      this.prismaModel.organizations = [value];
    }
  }

  addJournal(value: string) {
    this.prismaModel.journalIssue = value;
  }

  static determinePublicationType({
    typeCode,
    genre,
    title,
    isManuallySet,
    currentType,
  }: DeterminePublicationTypeInput): PublicationType {
    // Правило 8: Приоритет ручного выбора
    if (isManuallySet && currentType) {
      return currentType;
    }

    // Правило 2: Проверка наличия typeCode
    if (!typeCode || typeCode.trim() === '') {
      return PublicationType.REQUIRES_MANUAL_CLASSIFICATION;
    }

    const typeCodeLower = typeCode.toLowerCase().trim();

    // Правило 3: Нестатейные материалы
    if (typeCodeLower === 'editorial') return PublicationType.EDITORIAL_MATERIAL;
    if (typeCodeLower === 'retraction') return PublicationType.RETRACTION_NOTICE;
    if (typeCodeLower === 'note') return PublicationType.NOTE;
    if (typeCodeLower === 'notice') return PublicationType.NOTICE;

    // Правило 4: Статьи (typeCode = article)
    if (typeCodeLower === 'article' && genre) {
      const genreLower = genre.toLowerCase().trim();

      if (genreLower === 'research') return PublicationType.SCIENTIFIC_ARTICLE;
      if (genreLower === 'review') return PublicationType.LITERATURE_REVIEW;
      if (genreLower === 'book_review') return PublicationType.BOOK_REVIEW;
      if (genreLower === 'biography') return PublicationType.BIOGRAPHICAL_MATERIAL;
      if (genreLower === 'translation') return PublicationType.TRANSLATION;
      if (genreLower === 'editorial') return PublicationType.EDITORIAL_MATERIAL;
    }

    // Правило 5: Лингвистический анализ заголовка
    if (typeCodeLower === 'article' && title) {
      const titleLower = title.toLowerCase().trim();

      if (titleLower.includes('рецензия') || titleLower.includes('отзыв')) {
        return PublicationType.BOOK_REVIEW;
      }
      if (titleLower.includes('обзор') || titleLower.includes('литературный обзор')) {
        return PublicationType.LITERATURE_REVIEW;
      }
      if (titleLower.includes('некролог') || titleLower.includes('памяти')) {
        return PublicationType.BIOGRAPHICAL_MATERIAL;
      }
      if (titleLower.includes('перевод') || titleLower.includes('translated')) {
        return PublicationType.TRANSLATION;
      }
      if (titleLower.includes('от редакции') || titleLower.includes('editorial')) {
        return PublicationType.EDITORIAL_MATERIAL;
      }

      return PublicationType.SCIENTIFIC_ARTICLE;
    }

    // Правило 7: По умолчанию
    if (typeCodeLower === 'article') {
      return PublicationType.SCIENTIFIC_ARTICLE;
    }

    return PublicationType.REQUIRES_MANUAL_CLASSIFICATION;
  }

  static createFromArticle(article: Article): Publication {
    const type = Publication.determinePublicationType({
      typeCode: article.typeCode || null,
      genre: article.genre || null,
      title: article.getTitleRu() || null,
      isManuallySet: false,
    });

    return new Publication({
      //@ts-ignore
      uuid: undefined,
      rincId: article.id.toString(),
      type,
      isManuallySet: false,
      title: article.getTitleRu(),
      authors: [],
      organizations: [],
      publishingHouse: article.data.publisher,
      journalIssue: null,
      pages: article.data.pages ?? null, // pages
      publicationYear: article.publicationYear, // publicationYear
      citations: null, // citations
      language: article.data.lang, // language
      doi: article.doi ?? null, // doi
      edn: article.edn ?? null, // edn
      keywords: article.keywords,
    });
  }

  update(data: IUpdatePublicationDto) {
    if (data.type && !this.prismaModel.isManuallySet) {
      this.prismaModel.type = data.type as PublicationType;
      if (this.prismaModel.type !== data.type) this.prismaModel.isManuallySet = true;
    }
    if (data.title) {
      this.prismaModel.title = data.title;
    }
    if (data.authors) {
      this.prismaModel.authors = data.authors;
    }
    if (data.organizations) {
      this.prismaModel.organizations = data.organizations;
    }
    if (data.publishingHouse) {
      this.prismaModel.publishingHouse = data.publishingHouse;
    }
    if (data.journalIssue) {
      this.prismaModel.journalIssue = data.journalIssue;
    }
    if (data.pages) {
      this.prismaModel.pages = data.pages;
    }
    if (data.publicationYear) {
      this.prismaModel.publicationYear = data.publicationYear;
    }
    if (data.citations) {
      this.prismaModel.citations = data.citations;
    }
    if (data.language) {
      this.prismaModel.language = data.language;
    }
    if (data.keywords) {
      this.prismaModel.keywords = data.keywords;
    }
    if (data.description) {
      this.prismaModel.description = data.description;
    }
    if (data.bibliography) {
      this.prismaModel.bibliography = data.bibliography;
    }
    if (data.fundingSource) {
      this.prismaModel.fundingSource = data.fundingSource;
    }
    if (data.sourceLink !== undefined) {
      this.prismaModel.sourceLink = data.sourceLink;
    }
    if (data.textLink) {
      this.prismaModel.textLink = data.textLink;
    }
    if (data.attachmentUuid) {
      this.prismaModel.attachmentUuid = data.attachmentUuid;
    }
    if (data.totalCitations !== undefined) {
      this.prismaModel.totalCitations = data.totalCitations;
    }
    if (data.rubrics !== undefined) {
      this.prismaModel.rubrics = data.rubrics;
    }
    if (data.isFullText !== undefined) {
      this.prismaModel.isFullText = data.isFullText;
    }
    if (data.isNew !== undefined) {
      this.prismaModel.isNew = data.isNew;
    }
    if (data.isActive !== undefined) {
      this.prismaModel.isActive = data.isActive;
    }
  }

  static fromPrisma(prismaModel: PrismaPublication) {
    return new Publication(prismaModel);
  }

  toObject() {
    return this.prismaModel;
  }
}
