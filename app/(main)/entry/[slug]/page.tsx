import { getEntry } from '@/application/get-entry'
import { PrismaEntryRepository } from '@/infrastructure/prisma/entry-repository'
import { compileMDX } from 'next-mdx-remote/rsc'
import Sticky from '@/components/Sticky'
import Annotation from '@/components/Annotation'
import CodeBlock from '@/components/CodeBlock'
import PhotoGrid from '@/components/PhotoGrid'
import AudioPlayer from '@/components/AudioPlayer'
import EntryImage from '@/components/EntryImage'
import DeleteEntryButton from '@/components/DeleteEntryButton'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

const mdxComponents = {
  Sticky, Annotation, CodeBlock,
  PhotoGrid, AudioPlayer,
  img: EntryImage,
  audio: ({ src }: { src?: string }) =>
    typeof src === 'string' ? <AudioPlayer src={src} /> : null,
}

const TAG_CLASS: Record<string, string> = {
  dev: 'tag-dev',
  dessin: 'tag-dessin',
  music: 'tag-music',
  musique: 'tag-music',
  écriture: 'tag-ecriture',
  ecriture: 'tag-ecriture',
  meta: 'tag-meta',
}

function formatDisplayDate(dateStr: string, time?: string | null): string {
  const date = new Date(dateStr + 'T12:00:00')
  const formatted = date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
  return time ? `${formatted} — ${time}` : formatted
}

export default async function EntryPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const result = await getEntry(new PrismaEntryRepository(), slug)
  if (!result.ok) notFound()

  const entry = result.value
  const { content } = await compileMDX({ source: entry.content, components: mdxComponents })
  const tagClass = entry.tag ? (TAG_CLASS[entry.tag] ?? 'tag-autre') : 'tag-autre'

  return (
    <main>
      <article className="entry entry--detail">
        <div className="entry-meta">
          <span className="entry-date">{formatDisplayDate(entry.date, entry.time)}</span>
          {entry.tag && <span className={`entry-tag ${tagClass}`}>{entry.tag}</span>}
          <DeleteEntryButton slug={entry.slug} />
        </div>
        <div className="entry-body">
          {content}
        </div>
      </article>
    </main>
  )
}
