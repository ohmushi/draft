import { listEntries } from '@/application/list-entries'
import { PrismaEntryRepository } from '@/infrastructure/prisma/entry-repository'
import EntryCard from '@/components/EntryCard'
import { compileMDX } from 'next-mdx-remote/rsc'
import Sticky from '@/components/Sticky'
import Annotation from '@/components/Annotation'
import CodeBlock from '@/components/CodeBlock'
import PhotoGrid from '@/components/PhotoGrid'
import AudioPlayer from '@/components/AudioPlayer'

export const dynamic = 'force-dynamic'

function PhotoGridCompact(props: { readonly urls: readonly string[] }) {
  return <PhotoGrid {...props} limit={4} />
}

function LegacyImg({ src, alt }: { src?: string; alt?: string }) {
  if (typeof src !== 'string') return null
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt ?? ''} className="entry-img-legacy" />
}

function LegacyAudio({ src }: { src?: string }) {
  if (typeof src !== 'string') return null
  return <AudioPlayer src={src} />
}

const mdxComponents = {
  Sticky, Annotation, CodeBlock,
  PhotoGrid: PhotoGridCompact, AudioPlayer,
  img: LegacyImg,
  audio: LegacyAudio,
}

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
