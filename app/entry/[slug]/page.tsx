import { getEntryBySlug } from '@/lib/entries'
import { compileMDX } from 'next-mdx-remote/rsc'
import Sticky from '@/components/Sticky'
import Annotation from '@/components/Annotation'
import CodeBlock from '@/components/CodeBlock'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

const mdxComponents = { Sticky, Annotation, CodeBlock }

const TAG_CLASS: Record<string, string> = {
  dev: 'tag-dev',
  dessin: 'tag-dessin',
  music: 'tag-music',
  musique: 'tag-music',
  écriture: 'tag-ecriture',
  ecriture: 'tag-ecriture',
  meta: 'tag-meta',
}

function formatDate(dateStr: string, time?: string | null): string {
  const d = new Date(dateStr + 'T12:00:00')
  const formatted = d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
  return time ? `${formatted} — ${time}` : formatted
}

export default async function EntryPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  let entry: Awaited<ReturnType<typeof getEntryBySlug>>
  try {
    entry = await getEntryBySlug(slug)
  } catch {
    notFound()
  }

  const { content } = await compileMDX({ source: entry.content, components: mdxComponents })
  const tagClass = entry.tag ? (TAG_CLASS[entry.tag] ?? 'tag-autre') : 'tag-autre'

  return (
    <main>
      <article className="entry">
        <div className="entry-meta">
          <span className="entry-date">{formatDate(entry.date, entry.time)}</span>
          {entry.tag && <span className={`entry-tag ${tagClass}`}>{entry.tag}</span>}
        </div>
        <div className="entry-body">
          {content}
        </div>
      </article>
    </main>
  )
}
