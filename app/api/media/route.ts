import { NextRequest, NextResponse } from 'next/server'
import { getMinioClient } from '@/lib/minio'

export const runtime = 'nodejs'

function getSignedUrlTtlSeconds(): number {
  const raw = process.env.MINIO_SIGNED_URL_TTL_SECONDS
  if (!raw) return 300
  const parsed = Number.parseInt(raw, 10)
  if (Number.isNaN(parsed) || parsed <= 0) return 300
  return parsed
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const objectName = request.nextUrl.searchParams.get('object')
  if (!objectName) {
    return NextResponse.json({ ok: false, error: 'Missing object query param' }, { status: 400 })
  }

  try {
    const bucket = process.env.MINIO_BUCKET ?? 'draft-media'
    const signedUrl = await getMinioClient().presignedGetObject(
      bucket,
      objectName,
      getSignedUrlTtlSeconds(),
    )

    // Proxy the signed URL through this route so the browser never needs direct MinIO access.
    const upstream = await fetch(signedUrl, { cache: 'no-store' })
    if (!upstream.ok || !upstream.body) {
      return NextResponse.json({ ok: false, error: 'Media not found' }, { status: 404 })
    }

    const contentType = upstream.headers.get('content-type') ?? 'application/octet-stream'
    const contentLength = upstream.headers.get('content-length')
    const etag = upstream.headers.get('etag')

    const headers = new Headers({
      'Content-Type': contentType,
      'Cache-Control': 'private, max-age=60',
    })

    if (contentLength) headers.set('Content-Length', contentLength)
    if (etag) headers.set('ETag', etag)

    return new NextResponse(upstream.body, { status: 200, headers })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erreur interne'
    return NextResponse.json({ ok: false, error: message }, { status: 500 })
  }
}
