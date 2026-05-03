export interface MediaStorage {
  upload(file: File, filename: string): Promise<string>
}
