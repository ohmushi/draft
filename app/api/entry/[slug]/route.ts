import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { deleteEntry } from '@/application/delete-entry'
import { PrismaEntryRepository } from '@/infrastructure/prisma/entry-repository'

export const runtime = 'nodejs'

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
): Promise<NextResponse> {
  const { slug } = await params

  try {
    const result = await deleteEntry(new PrismaEntryRepository(), slug)
    if (!result.ok) {
      return NextResponse.json({ ok: false, error: 'Entrée introuvable' }, { status: 404 })
    }
    revalidatePath('/', 'page')
    revalidatePath(`/entry/${slug}`, 'page')
    return NextResponse.json({ ok: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erreur interne'
    return NextResponse.json({ ok: false, error: message }, { status: 500 })
  }
}
