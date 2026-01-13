import { readFile } from 'fs/promises';
import { Article, Author, ArticleTitle, ArticleAbstract, ArticleKeyword } from '@/domain/article';

export class RincArticleParser {
  async parse(filePath: string): Promise<Article> {
    const content = await readFile(filePath, 'utf-8');
    const json = JSON.parse(content);

    if (!json.response) {
      throw new Error(`Invalid RINC JSON format in ${filePath}`);
    }

    const data = json.response;

    // Parse titles
    const titles: ArticleTitle[] = (data.titles || []).map((t: any) => ({
      lang: t.lang || '',
      value: t.value || '',
    }));

    // Parse authors
    const authors: Author[] = (data.authors || []).map((a: any) => ({
      id: a.authorId || 0,
      lastName: a.names?.[0]?.lastName || '',
      initials: a.names?.[0]?.initials || '',
      orgNames: (a.orgs || []).map((o: any) => o.names?.[0]?.orgName || ''),
    }));

    // Parse abstracts
    const abstracts: ArticleAbstract[] = (data.abstracts || []).map((a: any) => ({
      lang: a.lang || '',
      value: a.value || '',
    }));

    // Parse keywords
    const keywords: ArticleKeyword[] = (data.keywords || []).map((k: any) => ({
      lang: k.lang || '',
      value: k.value || '',
    }));

    // Extract DOI from codes
    const doi = data.codes?.find((c: any) => c.type === 'DOI')?.value;
    const udk = data.codes?.find((c: any) => c.type === 'УДК')?.value;

    return new Article(
      data.itemId || 0,
      titles,
      authors,
      data.year || new Date().getFullYear(),
      data.journal?.fullName || '',
      data.journal?.issn || '',
      data.volumeNumber || '',
      data.issueNumber || '',
      data.pages || '',
      abstracts,
      keywords,
      doi,
      udk,
      data.mainRubric?.name || '',
    );
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
