import { listEntries } from '@/application/list-entries'
import { PrismaEntryRepository } from '@/infrastructure/prisma/entry-repository'
import EntryCard from '@/components/EntryCard'
import { compileMDX } from 'next-mdx-remote/rsc'
import Sticky from '@/components/Sticky'
import Annotation from '@/components/Annotation'
import CodeBlock from '@/components/CodeBlock'

export const dynamic = 'force-dynamic'

const mdxComponents = { Sticky, Annotation, CodeBlock }

export default async function Home() {
  const entries = await listEntries(new PrismaEntryRepository())

  const compiled = await Promise.all(
    entries.map((entry) =>
      compileMDX({ source: entry.content, components: mdxComponents })
    )
  )

  return (
    <main>
      {entries.map((entry, i) => (
        <div key={entry.slug}>
          <EntryCard entry={entry} index={i}>
            {compiled[i].content}
          </EntryCard>
          {i < entries.length - 1 && <hr className="entry-sep" />}
        </div>
      ))}

      {entries.length === 0 && (
        <p style={{ color: 'var(--ink-faint)', fontStyle: 'italic' }}>
          Aucune entrée pour le moment.
        </p>
      )}

      {entries.length > 0 && (
        <div className="scroll-hint">↓ &nbsp; plus haut dans le flux</div>
      )}
    </main>
  )
}
