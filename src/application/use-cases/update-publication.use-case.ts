import { Publication } from '@/domain/domains';
import { IPublicationRepository } from '@/domain/repositories';
import { IUpdatePublicationDto } from '@/interfaces/dto/update-publication.request';
import { FastifyBaseLogger } from 'fastify';
import { NotFoundError } from '../errors';

interface UpdatePublicationInput {
  id: string;
  data: IUpdatePublicationDto;
}

export class UpdatePublicationUseCase {
  constructor(private readonly publicationRepository: IPublicationRepository) {}

  async execute(input: UpdatePublicationInput, log: FastifyBaseLogger): Promise<Publication> {
    const publicationRecord = await this.publicationRepository.findById(input.id);

    if (!publicationRecord) {
      throw new NotFoundError('Publication not found');
    }
    const publication = new Publication(publicationRecord);
    publication.update(input.data);
    await this.publicationRepository.save(publication);
    log.info(`Publication ${publication.uuid} updated`);

    return publication;
  }
}
