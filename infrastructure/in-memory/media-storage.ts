import type { MediaStorage } from '@/domain/media'

type StoredMedia = {
  readonly filename: string
  readonly url: string
}

export class InMemoryMediaStorage implements MediaStorage {
  private readonly store: StoredMedia[] = []

  async upload(_file: File, filename: string): Promise<string> {
    const url = `https://mock-minio/${filename}`
    this.store.push({ filename, url })
    return url
  }

  getAll(): readonly StoredMedia[] {
    return [...this.store]
  }
}
