import { Publication } from '@/domain/domains';
import { IPublicationRepository } from '@/domain/repositories';
import { FastifyBaseLogger } from 'fastify';
import { NotFoundError } from '../errors';

export class RetrievePublicationUseCase {
  constructor(private readonly publicationRepository: IPublicationRepository) {}

  public async execute(id: string, _log: FastifyBaseLogger): Promise<Publication> {
    const publication = await this.publicationRepository.findById(id);
    if (!publication) throw new NotFoundError('Publication not found');

    return Publication.fromPrisma(publication);
  }
}
