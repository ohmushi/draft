import type { Client } from 'minio'
import type { MediaStorage } from '@/domain/media'

export class MinioMediaStorage implements MediaStorage {
  private readonly client: Client
  private readonly bucket: string
  private readonly publicUrl: string

  constructor(client: Client, bucket: string, publicUrl: string) {
    this.client = client
    this.bucket = bucket
    this.publicUrl = publicUrl
  }

  async upload(file: File, filename: string): Promise<string> {
    await this.ensureBucketExists()
    const buffer = Buffer.from(await file.arrayBuffer())
    await this.client.putObject(this.bucket, filename, buffer, buffer.length, {
      'Content-Type': file.type,
    })
    return `${this.publicUrl}/${this.bucket}/${filename}`
  }

  private async ensureBucketExists(): Promise<void> {
    const exists = await this.client.bucketExists(this.bucket)
    if (!exists) {
      await this.client.makeBucket(this.bucket)
    }
  }
}
