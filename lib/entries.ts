import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const ENTRIES_DIR = path.join(process.cwd(), 'content/entries')

export type Entry = {
  slug: string
  date: string
  tag: string
  time?: string
}

export function getAllEntries(): Entry[] {
  if (!fs.existsSync(ENTRIES_DIR)) return []

  const files = fs
    .readdirSync(ENTRIES_DIR)
    .filter((f) => f.endsWith('.mdx'))
    .sort()
    .reverse()

  return files.map((filename) => {
    const slug = filename.replace(/\.mdx$/, '')
    const datePart = slug.slice(0, 10)
    const raw = fs.readFileSync(path.join(ENTRIES_DIR, filename), 'utf-8')
    const { data } = matter(raw)

    return {
      slug,
      date: datePart,
      tag: (data.tag as string) ?? 'autre',
      time: (data.time as string | undefined),
    }
  })
}

export function getEntryBySlug(slug: string) {
  const filepath = path.join(ENTRIES_DIR, `${slug}.mdx`)
  const raw = fs.readFileSync(filepath, 'utf-8')
  const { data, content } = matter(raw)
  return { slug, date: slug.slice(0, 10), tag: (data.tag as string) ?? 'autre', time: (data.time as string | undefined), content }
}

export function getAllSlugs(): string[] {
  if (!fs.existsSync(ENTRIES_DIR)) return []
  return fs
    .readdirSync(ENTRIES_DIR)
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => f.replace(/\.mdx$/, ''))
}
