import { Readable } from 'stream';

export interface FileValidator {
  validateFileType(stream: Readable, allowedMimeTypes: string[]): Promise<boolean>;
  validateFileExtension(filename: string, allowedExtensions: string[]): boolean;
}

export interface FileMetadata {
  filename: string;
  mimeType: string;
  size: number;
}
