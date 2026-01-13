export interface IImportProcessJournalRepository {
  logEvent(data: {
    importProcessId: string;
    documentBody?: string;
    errorBody?: string;
  }): Promise<void>;
}
