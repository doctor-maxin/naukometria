import { readFile } from 'fs/promises';
import { Article } from '@/domain/domains/article';

export class RincArticleParser {
  async parse(filePath: string): Promise<Article> {
    const content = await readFile(filePath, 'utf-8');
    const json = JSON.parse(content);

    if (!json.response) {
      throw new Error(`Invalid RINC JSON format in ${filePath}`);
    }

    const data = json.response as IItemContent;

    // Extract DOI from codes
    const doi = data.codes?.find((c) => c.type === 'DOI')?.value;
    const udk = data.codes?.find((c) => c.type === 'УДК')?.value;
    const edn = data.codes?.find((c) => c.type === 'EDN')?.value;

    return new Article(data.itemId, data, doi, udk, edn);
  }

  isValidJson(content: string): boolean {
    try {
      const json = JSON.parse(content);
      return !!json.response;
    } catch {
      return false;
    }
  }
}

export interface IItemContent extends Record<string, unknown> {
  itemId: number;
  code: string;
  genreId: number;
  typeCode: string;
  lang: string;
  parentId: number;
  mainRubric: {
    rubricCode: number;
    name: string;
  };
  oecdCode: number;
  cited: number;
  coreCited: number;
  risc: number;
  coreRISC: number;
  isNew: number;
  isFT: number;
  authors: {
    number: number;
    status: string;
    authorId: number;
    names: {
      lang: string;
      lastName: string;
      initials: string;
    }[];
    orgs: {
      number: number;
      orgId: number;
      names: {
        lang: string;
        orgName: string;
      }[];
    }[];
  }[];
  titles: {
    lang: string;
    value: string;
  }[];
  year: number;
  volumeNumber: string;
  issueNumber: string;
  issueContNumber: string;
  seriesNumber: string;
  seriesName: string;
  reEdition: string;
  pages: string;
  pagesNumber: number;
  journal: {
    titleId: number;
    fullName: string;
    countryId: string;
    town: string;
    issn: string;
    eissn: string;
    activeFromYear: number | null;
    activeToYear: number | null;
    homeUrl: string | null;
    publisher: {
      orgId: number;
      names: {
        lang: string;
        orgName: string;
      }[];
    };
    rubrics: string[];
    vak: number;
    vakCateg: number;
    whiteList: number;
    whiteListLevel: number;
    jcrQuartile: number;
    sjrQuartile: number;
    scopus: number;
    wos: number;
    risc: number;
    rsci: number;
    numofItems: number;
  };
  publisher: null;
  support: {}[];
  abstracts: {
    lang: string;
    value: string;
  }[];
  keywords: {
    lang: string;
    value: string;
  }[];
  codes: {
    type: string;
    value: string;
  }[];
  url: string;
  dateInstall: string;
  dateReceived: string;
  retracted: number;
  forСitation: string;
}
