import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { ValidationError } from '../../application/errors';
import { MultipartFields, MultipartFile } from '@fastify/multipart';

export class RincController {
  constructor(private readonly app: FastifyInstance) {}

  public async processZip(
    request: FastifyRequest<{
      Body: Record<string, any>;
    }>,
    reply: FastifyReply,
  ) {
    const fields: Record<string, any> = {};
    let file: MultipartFile | null = null;

    for await (const part of Object.values(request.body)) {
      if (part.type === 'file') {
        file = part;
      } else {
        fields[part.fieldname] = part.value;
      }
    }

    if (!file) {
      return reply.code(400).send({ error: 'No file uploaded' });
    }
    request.log.debug({ fields }, `Fields input: `);

    try {
      const result = await this.app.useCases.importRincZip.execute({
        file,
        fields,
      });

      return result;
    } catch (error) {
      if (error instanceof ValidationError) {
        return reply.code(400).send({ error: error.message });
      }
      throw error;
    }
  }
}
