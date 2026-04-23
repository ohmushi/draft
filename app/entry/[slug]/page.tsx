import { getAllSlugs, getEntryBySlug } from '@/lib/entries'

const TAG_CLASS: Record<string, string> = {
  dev: 'tag-dev',
  dessin: 'tag-dessin',
  music: 'tag-music',
  musique: 'tag-music',
  écriture: 'tag-ecriture',
  ecriture: 'tag-ecriture',
  meta: 'tag-meta',
}

function formatDate(dateStr: string, time?: string): string {
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
  const entry = getEntryBySlug(slug)
  const { default: Post } = await import(`@/content/entries/${slug}.mdx`)
  const tagClass = TAG_CLASS[entry.tag] ?? 'tag-autre'

  return (
    <main>
      <article className="entry">
        <div className="entry-meta">
          <span className="entry-date">{formatDate(entry.date, entry.time)}</span>
          <span className={`entry-tag ${tagClass}`}>{entry.tag}</span>
        </div>
        <div className="entry-body">
          <Post />
        </div>
      </article>
    </main>
  )
}

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }))
}

export const dynamicParams = false
