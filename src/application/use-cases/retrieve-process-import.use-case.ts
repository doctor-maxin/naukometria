import { ImportProcess } from '@/domain/domains';
import { IImportProcessRepository } from '@/domain/repositories';
import { FastifyBaseLogger } from 'fastify';
import { NotFoundError } from '../errors';

export class RetrieveProcessImportUseCase {
  constructor(private readonly importProcessRepository: IImportProcessRepository) {}

  public async execute(id: string, _log: FastifyBaseLogger): Promise<ImportProcess> {
    const process = await this.importProcessRepository.findById(id);
    if (!process) throw new NotFoundError('Process not found');
    const importProcess = new ImportProcess(process);

    return importProcess;
  }
}
