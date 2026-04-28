import { getPrisma } from './db'

export type Entry = {
  id: number
  slug: string
  date: string
  tag: string | null
  time: string | null
  content: string
}

export async function getAllEntries(): Promise<Entry[]> {
  return getPrisma().entry.findMany({
    orderBy: { createdAt: 'desc' },
  })
}

export async function getEntryBySlug(slug: string): Promise<Entry> {
  const entry = await getPrisma().entry.findUniqueOrThrow({ where: { slug } })
  return entry
}

export async function getAllSlugs(): Promise<string[]> {
  const entries = await getPrisma().entry.findMany({ select: { slug: true } })
  return entries.map((e) => e.slug)
}
