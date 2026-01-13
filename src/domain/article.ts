export interface Author {
  id: number;
  lastName: string;
  initials: string;
  orgNames?: string[];
}

export interface ArticleTitle {
  lang: string;
  value: string;
}

export interface ArticleAbstract {
  lang: string;
  value: string;
}

export interface ArticleKeyword {
  lang: string;
  value: string;
}

export class Article {
  constructor(
    public readonly id: number,
    public readonly titles: ArticleTitle[],
    public readonly authors: Author[],
    public readonly year: number,
    public readonly journalTitle: string,
    public readonly issn?: string,
    public readonly volume?: string,
    public readonly issue?: string,
    public readonly pages?: string,
    public readonly abstracts: ArticleAbstract[],
    public readonly keywords: ArticleKeyword[],
    public readonly doi?: string,
    public readonly udk?: string,
    public readonly rubric?: string,
  ) {}

  getTitle(lang: string): string | undefined {
    return this.titles.find((t) => t.lang === lang)?.value;
  }

  getTitleRu(): string {
    return this.getTitle('') || this.getTitle('RU') || this.titles[0]?.value || '';
  }

  getAuthorsList(): string {
    return this.authors
      .map((a) => `${a.lastName} ${a.initials}`)
      .join(', ');
  }

  getAbstract(lang: string): string | undefined {
    return this.abstracts.find((a) => a.lang === lang)?.value;
  }
}
