import { FastifyBaseLogger } from 'fastify';
import { ValidationError } from './errors';
import { FileValidator } from '@/infrastructure/plugins/validators/interfaces';
import { ImportProcessRepository } from './repositories/import-process.repository';
import { MultipartFile } from '@fastify/multipart';
import AdmZip from 'adm-zip';
import { mkdirSync, unlinkSync, createWriteStream, createReadStream } from 'fs';
import { join } from 'path';
import { pipeline } from 'stream/promises';

export interface ImportRincZipInput {
  file: MultipartFile;
}

export interface ImportRincZipOutput {
  message: string;
  filename: string;
  status: string;
}

export class ImportRincZipUseCase {
  constructor(
    private readonly importProcessRepository: ImportProcessRepository,
    private readonly fileValidator: FileValidator,
  ) {}

  async execute(input: ImportRincZipInput, log: FastifyBaseLogger): Promise<ImportRincZipOutput> {
    const basePath = process.cwd();
    log.info(`Processing RINC ZIP import: ${input.file.filename}`);

    // Validate file extension
    if (!this.fileValidator.validateFileExtension(input.file.filename, ['.zip'])) {
      throw new ValidationError('Only ZIP files are allowed');
    }

    const tempDir = join(basePath, 'uploads', 'rinc', 'temp');
    mkdirSync(tempDir, { recursive: true });

    const timestamp = Date.now().toString();
    const zipPath = join(tempDir, `${timestamp}.zip`);
    const fileStream = input.file.file;

    await pipeline(fileStream, createWriteStream(zipPath));

    if (
      !(await this.fileValidator.validateFileType(createReadStream(zipPath), [
        'application/zip',
        'application/x-zip-compressed',
      ]))
    ) {
      unlinkSync(zipPath);
      throw new ValidationError('Invalid file type. Only ZIP files are allowed');
    }

    const uploadDir = join(basePath, 'uploads', 'rinc', timestamp);
    log.info(`Processing RINC ZIP import upload successfull`);

    const zip = new AdmZip(zipPath);
    zip.extractAllTo(uploadDir, true);
    log.info(`Processing RINC ZIP import successfull`);

    unlinkSync(zipPath);

    const importProcess = await this.importProcessRepository.create({
      filename: input.file.filename,
      status: 'PROCESSING',
    });

    return {
      message: 'File extracted successfully',
      data: importProcess,
    };
  }
}
