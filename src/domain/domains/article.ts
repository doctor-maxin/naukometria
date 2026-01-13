import { IItemContent } from '@/application/parsers/rinc-article-parser';

export class Article {
  constructor(
    public readonly id: number,
    public readonly data: IItemContent,
    public readonly doi?: string,
    public readonly udk?: string,
    public readonly edn?: string,
  ) {}

  get authors() {
    return this.data.authors.map((a) => ({
      ...a,
      id: a.authorId,
      orgIds: a.orgs.map((o) => o.orgId),
    }));
  }
  get typeCode() {
    return this.data.typeCode;
  }
  get genre() {
    return this.data.genreId.toString();
  }
  get publicationYear() {
    return this.data.year ? new Date(this.data.year, 0, 1) : null;
  }

  get keywords() {
    return this.data.keywords.map((k) => k.value).join(', ');
  }

  getTitle(lang: string): string | undefined {
    return this.data.titles.find((t) => t.lang === lang)?.value;
  }

  getTitleRu(): string {
    return this.getTitle('') || this.getTitle('RU') || this.data.titles[0]?.value || '';
  }
}
