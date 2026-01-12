import { FastifyInstance } from 'fastify';
import { ValidationError } from './errors';
import { FileValidator } from '@/infrastructure/plugins/validators/interfaces';
import { MultipartFile } from '@fastify/multipart';

export interface ImportRincZipInput {
  file: MultipartFile;
  fields?: Record<string, any>;
}

export interface ImportRincZipOutput {
  message: string;
  filename: string;
  status: string;
}

export class ImportRincZipUseCase {
  constructor(
    private readonly app: FastifyInstance,
    private readonly fileValidator: FileValidator,
  ) {}

  async execute(input: ImportRincZipInput): Promise<ImportRincZipOutput> {
    this.app.log.info(`Processing RINC ZIP import: ${input.file.filename}`);

    // Validate file extension
    if (!this.fileValidator.validateFileExtension(input.file.filename, ['.zip'])) {
      throw new ValidationError('Only ZIP files are allowed');
    }

    if (
      !(await this.fileValidator.validateFileType(input.file.file, [
        'application/zip',
        'application/x-zip-compressed',
      ]))
    ) {
      throw new ValidationError('Invalid file type. Only ZIP files are allowed');
    }

    // TODO: Unzip and process articles from RINC

    return {
      message: 'File received for processing',
      filename: input.file.filename,
      status: 'pending',
    };
  }
}
