import type { CreateEntryInput, Entry, EntryRepository, NewEntry } from '@/domain/entry'
import { formatDate, formatTime, generateSlug } from '@/lib/slug'

export async function createEntry(
  repository: EntryRepository,
  input: CreateEntryInput,
  clock: () => Date = () => new Date(),
): Promise<Entry> {
  if (!input.text.trim()) throw new Error('Entry content cannot be empty')
  const now = clock()
  const newEntry: NewEntry = {
    slug: generateSlug(formatDate(now), now.getTime()),
    date: formatDate(now),
    time: formatTime(now),
    tag: input.tag,
    content: input.text,
  }
  return repository.save(newEntry)
}
