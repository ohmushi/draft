import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { createEntry } from '@/application/create-entry'
import { PrismaEntryRepository } from '@/infrastructure/prisma/entry-repository'
import { MinioMediaStorage } from '@/infrastructure/minio/media-storage'
import { getMinioClient } from '@/lib/minio'
import { isEntryTag } from '@/domain/entry'

export const runtime = 'nodejs'

function generateMediaFilename(file: File): string {
  const ext = file.name.includes('.') ? file.name.slice(file.name.lastIndexOf('.')) : ''
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  let formData: FormData
  try {
    formData = await request.formData()
  } catch {
    return NextResponse.json({ ok: false, error: 'FormData invalide' }, { status: 400 })
  }

  const rawText = formData.get('text')
  const rawTag = formData.get('tag')
  const photoEntries = formData.getAll('photos')
  const rawAudio = formData.get('audio')

  const text = typeof rawText === 'string' ? rawText.trim() : ''
  const rawTagStr = typeof rawTag === 'string' ? rawTag.trim() : ''
  const tag = rawTagStr && isEntryTag(rawTagStr) ? rawTagStr : null
  const photos = photoEntries.filter((entry): entry is File => entry instanceof File)
  const audioFile = rawAudio instanceof File ? rawAudio : null

  if (text.length === 0 && photos.length === 0 && audioFile === null) {
    return NextResponse.json({ ok: false, error: 'Texte et médias vides' }, { status: 400 })
  }

  try {
    let mediaUrls: readonly string[] = []
    let audioUrl: string | null = null

    if (photos.length > 0 || audioFile !== null) {
      const bucket = process.env.MINIO_BUCKET ?? 'draft-media'
      const storage = new MinioMediaStorage(getMinioClient(), bucket)

      if (photos.length > 0) {
        mediaUrls = await Promise.all(
          photos.map(photo => storage.upload(photo, generateMediaFilename(photo)))
        )
      }

      if (audioFile !== null) {
        audioUrl = await storage.upload(audioFile, generateMediaFilename(audioFile))
      }
    }

    const repository = new PrismaEntryRepository()
    const entry = await createEntry(repository, { text, tag, mediaUrls, audioUrl })
    revalidatePath('/', 'page')
    return NextResponse.json({ ok: true, slug: entry.slug })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erreur interne'
    return NextResponse.json({ ok: false, error: message }, { status: 500 })
  }
}
