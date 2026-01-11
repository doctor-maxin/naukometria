import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';

export class RincController {
  constructor(private readonly app: FastifyInstance) {}

  public async processZip(request: FastifyRequest, reply: FastifyReply) {
    const fields: Record<string, any> = {};
    let fileData: any = null;

    for await (const part of Object.values(request.body)) {
      if (part.type === 'file') {
        fileData = part;
      } else {
        fields[part.fieldname] = part.value;
      }
    }

    if (!fileData) {
      return reply.code(400).send({ error: 'No file uploaded' });
    }
    request.log.debug({ fields }, `Fields input: `);

    const result = await this.app.useCases.importRincZip.execute({
      file: {
        filename: fileData.filename,
        data: fileData.file,
      },
      fields,
    });

    return result;
  }
}
