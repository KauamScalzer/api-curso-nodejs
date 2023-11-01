export interface LogErrorRepository {
  log (data: string): Promise<void>
}
