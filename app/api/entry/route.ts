import { NextRequest, NextResponse } from 'next/server'
import { getPrisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'

export const runtime = 'nodejs'

function pad2(n: number): string {
  return n.toString().padStart(2, '0')
}

function formatTime(date: Date): string {
  return `${pad2(date.getHours())}:${pad2(date.getMinutes())}`
}

function formatDate(date: Date): string {
  const y = date.getFullYear()
  const m = pad2(date.getMonth() + 1)
  const d = pad2(date.getDate())
  return `${y}-${m}-${d}`
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

  const text = typeof rawText === 'string' ? rawText.trim() : ''
  const tag = typeof rawTag === 'string' && rawTag.trim().length > 0 ? rawTag.trim() : null

  if (text.length === 0) {
    return NextResponse.json({ ok: false, error: 'Texte vide' }, { status: 400 })
  }

  const now = new Date()
  const date = formatDate(now)
  const time = formatTime(now)
  const slug = `${date}-${now.getTime()}`

  try {
    await getPrisma().entry.create({
      data: { slug, date, tag, time, content: text },
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erreur DB'
    return NextResponse.json({ ok: false, error: message }, { status: 500 })
  }

  revalidatePath('/', 'page')

  return NextResponse.json({ ok: true, slug })
}
