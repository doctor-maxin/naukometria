import { FastifyBaseLogger } from 'fastify';
import { ValidationError } from '../errors';
import { FileValidator } from '@/infrastructure/plugins/validators/interfaces';
import { MultipartFile } from '@fastify/multipart';
import AdmZip from 'adm-zip';
import { createWriteStream, createReadStream } from 'fs';
import { join } from 'path';
import { pipeline } from 'stream/promises';
import { IImportProcessRepository } from '@/domain/repositories';
import { mkdir, unlink } from 'fs/promises';
import { EventBus, ImportProcessStartedEvent } from '../events';
import { ImportProcess } from '@/domain/domains';

export interface ImportRincZipInput {
  file: MultipartFile;
}

export interface ImportRincZipOutput {
  message: string;
  data: ImportProcess;
}

export class ImportRincZipUseCase {
  constructor(
    private readonly importProcessRepository: IImportProcessRepository,
    private readonly fileValidator: FileValidator,
    private readonly eventBus: EventBus,
  ) {}

  async ensureDirExists(basePath: string) {
    const tempDir = join(basePath, 'uploads', 'rinc', 'temp');
    await mkdir(tempDir, {
      recursive: true,
    });
    return tempDir;
  }

  async execute(input: ImportRincZipInput, log: FastifyBaseLogger): Promise<ImportRincZipOutput> {
    const basePath = process.cwd();
    log.info(`Processing RINC ZIP import: ${input.file.filename}`);

    // Validate file extension
    if (!this.fileValidator.validateFileExtension(input.file.filename, ['.zip'])) {
      throw new ValidationError('Only ZIP files are allowed');
    }

    // Save tmp zip file
    const tempDir = await this.ensureDirExists(basePath);

    const timestamp = Date.now().toString();
    const zipPath = join(tempDir, `${timestamp}.zip`);
    const fileStream = input.file.file;

    await pipeline(fileStream, createWriteStream(zipPath));

    // Validate real file type
    if (
      !(await this.fileValidator.validateFileType(createReadStream(zipPath), [
        'application/zip',
        'application/x-zip-compressed',
      ]))
    ) {
      await unlink(zipPath);
      throw new ValidationError('Invalid file type. Only ZIP files are allowed');
    }

    // Extract zip file and remove tmp file
    const extractDir = join(basePath, 'uploads', 'rinc', timestamp);

    const zip = new AdmZip(zipPath);
    zip.extractAllTo(extractDir, true);
    log.info(`RINC ZIP import extracted successfull`);

    await unlink(zipPath);

    // Create ImportProcess entity
    const importProcessRecord = await this.importProcessRepository.create({
      filename: input.file.filename,
      status: 'PENDING',
      filesPath: extractDir,
    });
    const importProcess = new ImportProcess(importProcessRecord);

    // Start the process
    importProcess.start();
    await this.importProcessRepository.save(importProcess.toPrisma());

    // Publish event
    try {
      await this.eventBus.publish(
        new ImportProcessStartedEvent({
          importProcessId: importProcess.id,
          filesPath: extractDir,
          filename: input.file.filename,
        }),
      );
    } catch (error) {
      await this.importProcessRepository.markAsFailed(importProcess.id, 'Event publish failed');
      throw error;
    }

    return {
      message: 'File extracted successfully',
      data: importProcess,
    };
  }
}
