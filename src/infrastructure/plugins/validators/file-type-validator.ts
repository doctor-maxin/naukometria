import { Readable } from 'stream';
import type { FileValidator } from '@/infrastructure/plugins/validators/interfaces';
import { fileTypeFromStream } from 'file-type';

export class FileTypeValidator implements FileValidator {
  async validateFileType(stream: Readable, allowedMimeTypes: string[]): Promise<boolean> {
    const fileType = await fileTypeFromStream(stream);
    if (!fileType) {
      return false;
    }

    return allowedMimeTypes.includes(fileType.mime);
  }

  validateFileExtension(filename: string, allowedExtensions: string[]): boolean {
    const extension = filename.split('.').pop()?.toLowerCase();

    if (!extension) {
      return false;
    }

    return allowedExtensions.includes(`.${extension}`);
  }
}
