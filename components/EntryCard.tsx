import type { Entry } from '@/lib/entries'
import Link from 'next/link'

const TAG_CLASS: Record<string, string> = {
  dev: 'tag-dev',
  dessin: 'tag-dessin',
  music: 'tag-music',
  musique: 'tag-music',
  écriture: 'tag-ecriture',
  ecriture: 'tag-ecriture',
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00')
  return d.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export default function EntryCard({
  entry,
  index,
}: {
  entry: Entry
  index: number
}) {
  const tagClass = TAG_CLASS[entry.tag] ?? ''

  return (
    <article
      className="entry"
      style={{ animationDelay: `${0.05 + index * 0.1}s` }}
    >
      <div className="entry-meta">
        <span className="entry-date">{formatDate(entry.date)}</span>
        <span className={`entry-tag ${tagClass}`}>{entry.tag}</span>
      </div>
      <div className="entry-body">
        <p>{entry.excerpt}</p>
      </div>
      <Link href={`/entry/${entry.slug}`} className="entry-link">
        lire →
      </Link>
    </article>
  )
}

