import type { Entry, EntryRepository, NewEntry } from '@/domain/entry'
import { isEntryTag } from '@/domain/entry'
import { getPrisma } from '@/lib/db'

type PrismaEntryRecord = {
  id: number
  slug: string
  date: string
  tag: string | null
  time: string | null
  content: string
  createdAt: Date
}

function toDomainEntry(record: PrismaEntryRecord): Entry {
  const tag = record.tag && isEntryTag(record.tag) ? record.tag : null
  return {
    id: record.id,
    slug: record.slug,
    date: record.date,
    tag,
    time: record.time,
    content: record.content,
    createdAt: record.createdAt,
  }
}

export class PrismaEntryRepository implements EntryRepository {
  async save(entry: NewEntry): Promise<Entry> {
    const record = await getPrisma().entry.create({
      data: {
        slug: entry.slug,
        date: entry.date,
        time: entry.time,
        tag: entry.tag,
        content: entry.content,
      },
    })
    return toDomainEntry(record)
  }

  async findAll(): Promise<Entry[]> {
    const records = await getPrisma().entry.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return records.map(toDomainEntry)
  }

  async findBySlug(slug: string): Promise<Entry | null> {
    const record = await getPrisma().entry.findUnique({ where: { slug } })
    return record ? toDomainEntry(record) : null
  }
}
