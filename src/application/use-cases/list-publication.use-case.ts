import { Publication } from '@/domain/domains';
import type { IPublicationRepository } from '@/domain/repositories';
import type { FastifyBaseLogger } from 'fastify';

interface IListInput {
  page: number;
  limit: number;
  importProcessUuid?: string;
}
export class ListPublicationsUseCase {
  constructor(private readonly publicationRepository: IPublicationRepository) {}

  public async execute(input: IListInput, _log: FastifyBaseLogger): Promise<Publication[]> {
    const publications = await this.publicationRepository.list(
      input.page,
      input.limit,
      input.importProcessUuid,
    );

    return publications.map((publication) => Publication.fromPrisma(publication));
  }
}
