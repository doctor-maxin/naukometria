export interface DomainEvent<T = unknown> {
  type: string;
  data: T;
  timestamp: Date;
}

export interface ImportProcessStartedEventData {
  importProcessId: string;
  filesPath: string;
  filename: string;
}

export class ImportProcessStartedEvent implements DomainEvent<ImportProcessStartedEventData> {
  readonly type = 'ImportProcessStarted';
  readonly timestamp: Date;

  constructor(readonly data: ImportProcessStartedEventData) {
    this.timestamp = new Date();
  }

  toJSON() {
    return {
      type: this.type,
      data: this.data,
      timestamp: this.timestamp,
    };
  }
}

export interface ImportProcessCompletedEventData {
  importProcessId: string;
  totalArticles: number;
  processedArticles: number;
  failedArticles: number;
}

export class ImportProcessCompletedEvent implements DomainEvent<ImportProcessCompletedEventData> {
  readonly type = 'ImportProcessCompleted';
  readonly timestamp: Date;

  constructor(readonly data: ImportProcessCompletedEventData) {
    this.timestamp = new Date();
  }

  toJSON() {
    return {
      type: this.type,
      data: this.data,
      timestamp: this.timestamp,
    };
  }
}

export interface ImportProcessFailedEventData {
  importProcessId: string;
  error: string;
}

export class ImportProcessFailedEvent implements DomainEvent<ImportProcessFailedEventData> {
  readonly type = 'ImportProcessFailed';
  readonly timestamp: Date;

  constructor(readonly data: ImportProcessFailedEventData) {
    this.timestamp = new Date();
  }

  toJSON() {
    return {
      type: this.type,
      data: this.data,
      timestamp: this.timestamp,
    };
  }
}

export interface EventBus {
  publish<T>(event: DomainEvent<T>): Promise<void>;
}
