import { FastifyInstance } from 'fastify';

export interface ImportRincZipInput {
  file: {
    filename: string;
    data: AsyncIterable<Buffer>;
  };
  fields?: Record<string, any>;
}

export interface ImportRincZipOutput {
  message: string;
  filename: string;
  status: string;
}

export class ImportRincZipUseCase {
  constructor(private readonly app: FastifyInstance) {}

  async execute(input: ImportRincZipInput): Promise<ImportRincZipOutput> {
    this.app.log.info(`Processing RINC ZIP import: ${input.file.filename}`);

    // TODO: Unzip and process articles from RINC

    return {
      message: 'File received for processing',
      filename: input.file.filename,
      status: 'pending',
    };
  }
}
