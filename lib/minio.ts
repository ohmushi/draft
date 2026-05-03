import { Client } from 'minio'

const globalForMinio = globalThis as unknown as { minioClient?: Client }

export function getMinioClient(): Client {
  if (!globalForMinio.minioClient) {
    const endpoint = process.env.MINIO_ENDPOINT
    if (!endpoint) throw new Error('MINIO_ENDPOINT is not set')
    const accessKey = process.env.MINIO_ACCESS_KEY
    if (!accessKey) throw new Error('MINIO_ACCESS_KEY is not set')
    const secretKey = process.env.MINIO_SECRET_KEY
    if (!secretKey) throw new Error('MINIO_SECRET_KEY is not set')

    const url = new URL(endpoint)
    const useSSL = url.protocol === 'https:'
    const port = url.port ? parseInt(url.port, 10) : useSSL ? 443 : 9000

    globalForMinio.minioClient = new Client({
      endPoint: url.hostname,
      port,
      useSSL,
      accessKey,
      secretKey,
    })
  }
  return globalForMinio.minioClient
}
