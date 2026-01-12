export interface ImportProcessRepository {
  create(data: CreateImportProcessDTO): Promise<ImportProcess>;
  findById(id: number): Promise<ImportProcess | null>;
  update(id: number, data: UpdateImportProcessDTO): Promise<ImportProcess>;
}

export interface CreateImportProcessDTO {
  filename: string;
  status?: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  totalArticles?: number;
  processedArticles?: number;
  failedArticles?: number;
  errorMessage?: string | null;
  startedAt?: Date;
  completedAt?: Date | null;
}

export interface UpdateImportProcessDTO {
  status?: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  totalArticles?: number;
  processedArticles?: number;
  failedArticles?: number;
  errorMessage?: string | null;
  completedAt?: Date | null;
}

export interface ImportProcess {
  id: number;
  filename: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  totalArticles: number;
  processedArticles: number;
  failedArticles: number;
  errorMessage: string | null;
  startedAt: Date;
  completedAt: Date | null;
}
