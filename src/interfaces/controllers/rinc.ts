import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { ValidationError } from '../../application/errors';

export class RincController {
  constructor(private readonly app: FastifyInstance) {}

  public async processZip(
    request: FastifyRequest<{
      Body: Record<string, any>;
    }>,
    reply: FastifyReply,
  ) {
    let file = await request.file();

    if (!file) {
      return reply.code(400).send({ error: 'No file uploaded' });
    }

    try {
      const result = await this.app.useCases.importRincZip.execute(
        {
          file,
        },
        request.log,
      );

      return result;
    } catch (error) {
      if (error instanceof ValidationError) {
        return reply.code(400).send({ error: error.message });
      }
      throw error;
    }
  }

  public async retrieveProcessImport(
    request: FastifyRequest<{
      Params: {
        id: string;
      };
    }>,
    reply: FastifyReply,
  ) {
    try {
      const result = await this.app.useCases.retrieveProcessImport.execute(
        request.params.id,
        request.log,
      );

      return result;
    } catch (error) {
      if (error instanceof ValidationError) {
        return reply.code(400).send({ error: error.message });
      }
      throw error;
    }
  }
}
