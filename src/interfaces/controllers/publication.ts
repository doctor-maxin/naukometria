import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import type { IUpdatePublicationDto } from '../dto/update-publication.request';

export class PublicationController {
  constructor(private readonly app: FastifyInstance) {}

  async listPublications(
    request: FastifyRequest<{
      Querystring: {
        page?: string;
        limit?: string;
        importProcessUuid?: string;
      };
    }>,
    reply: FastifyReply,
  ) {
    const result = await this.app.useCases.listPublications.execute(
      {
        page: request.query.page ? parseInt(request.query.page) : 1,
        limit: request.query.limit ? parseInt(request.query.limit) : 20,
        importProcessUuid: request.query.importProcessUuid,
      },
      request.log,
    );

    return result;
  }

  async retrievePublication(
    request: FastifyRequest<{
      Params: {
        id: string;
      };
    }>,
    reply: FastifyReply,
  ) {
    const result = await this.app.useCases.retrievePublication.execute(
      request.params.id,
      request.log,
    );

    return result;
  }

  async updatePublication(
    request: FastifyRequest<{
      Params: {
        id: string;
      };
      Body: IUpdatePublicationDto;
    }>,
    reply: FastifyReply,
  ) {
    const { id } = request.params;
    const data = request.body;

    const result = await this.app.useCases.updatePublication.execute({ id, data }, request.log);

    return result;
  }
}
