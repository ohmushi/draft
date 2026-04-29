import type { Entry, EntryRepository, NewEntry } from '@/domain/entry'

export class InMemoryEntryRepository implements EntryRepository {
  private readonly entries: Entry[] = []
  private nextId = 1

  async save(entry: NewEntry): Promise<Entry> {
    const persisted: Entry = {
      id: this.nextId++,
      slug: entry.slug,
      date: entry.date,
      tag: entry.tag,
      time: entry.time,
      content: entry.content,
      createdAt: new Date(),
    }
    this.entries.push(persisted)
    return persisted
  }

  async findAll(): Promise<Entry[]> {
    return [...this.entries].reverse()
  }

  async findBySlug(slug: string): Promise<Entry | null> {
    return this.entries.find((entry) => entry.slug === slug) ?? null
  }
}
