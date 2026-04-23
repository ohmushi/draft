import type { Entry } from '@/lib/entries'
import type { ReactNode } from 'react'
import Link from 'next/link'

const TAG_CLASS: Record<string, string> = {
  dev: 'tag-dev',
  dessin: 'tag-dessin',
  music: 'tag-music',
  musique: 'tag-music',
  écriture: 'tag-ecriture',
  ecriture: 'tag-ecriture',
}

function formatDate(dateStr: string, time?: string): string {
  const d = new Date(dateStr + 'T12:00:00')
  const formatted = d.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
  return time ? `${formatted} - ${time}` : formatted
}

export default function EntryCard({
  entry,
  index,
  children,
}: {
  entry: Entry
  index: number
  children: ReactNode
}) {
  const tagClass = TAG_CLASS[entry.tag] ?? 'tag-autre'

  return (
    <article
      className="entry"
      style={{ animationDelay: `${0.05 + index * 0.1}s` }}
    >
      <div className="entry-meta">
        <Link
          href={`/entry/${entry.slug}`}
          className="entry-date-link"
          title={`Voir l'entrée du ${formatDate(entry.date, entry.time)}`}
        >
          <span className="entry-date">{formatDate(entry.date, entry.time)}</span>
        </Link>
        <span className={`entry-tag ${tagClass}`}>{entry.tag}</span>
      </div>
      <div className="entry-body">{children}</div>
    </article>
  )
}
