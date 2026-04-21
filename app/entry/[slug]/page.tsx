import { getAllSlugs } from '@/lib/entries'

export default async function EntryPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const { default: Post } = await import(`@/content/entries/${slug}.mdx`)

  return (
    <main>
      <article className="entry">
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

