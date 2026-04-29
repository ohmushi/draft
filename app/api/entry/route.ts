import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { createEntry } from '@/application/create-entry'
import { PrismaEntryRepository } from '@/infrastructure/prisma/entry-repository'
import { isEntryTag } from '@/domain/entry'

export const runtime = 'nodejs'

export async function POST(request: NextRequest): Promise<NextResponse> {
  let formData: FormData
  try {
    formData = await request.formData()
  } catch {
    return NextResponse.json({ ok: false, error: 'FormData invalide' }, { status: 400 })
  }

  const rawText = formData.get('text')
  const rawTag = formData.get('tag')

  const text = typeof rawText === 'string' ? rawText.trim() : ''
  const rawTagStr = typeof rawTag === 'string' ? rawTag.trim() : ''
  const tag = rawTagStr && isEntryTag(rawTagStr) ? rawTagStr : null

  if (text.length === 0) {
    return NextResponse.json({ ok: false, error: 'Texte vide' }, { status: 400 })
  }

  try {
    const repository = new PrismaEntryRepository()
    const entry = await createEntry(repository, { text, tag })
    revalidatePath('/', 'page')
    return NextResponse.json({ ok: true, slug: entry.slug })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erreur interne'
    return NextResponse.json({ ok: false, error: message }, { status: 500 })
  }
}
