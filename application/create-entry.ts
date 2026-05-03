import type { CreateEntryInput, Entry, EntryRepository, NewEntry } from '@/domain/entry'
import { formatDate, formatTime, generateSlug } from '@/lib/slug'

export function buildContent(text: string, mediaUrls: readonly string[]): string {
  const trimmed = text.trim()
  const imageMarkdown = mediaUrls.map(url => `![](${url})`).join('\n')
  if (trimmed && imageMarkdown) return `${trimmed}\n\n${imageMarkdown}`
  if (trimmed) return trimmed
  return imageMarkdown
}

export async function createEntry(
  repository: EntryRepository,
  input: CreateEntryInput,
  clock: () => Date = () => new Date(),
): Promise<Entry> {
  if (!input.text.trim() && input.mediaUrls.length === 0) {
    throw new Error('Entry content cannot be empty')
  }
  const now = clock()
  const newEntry: NewEntry = {
    slug: generateSlug(formatDate(now), now.getTime()),
    date: formatDate(now),
    time: formatTime(now),
    tag: input.tag,
    content: buildContent(input.text, input.mediaUrls),
  }
  return repository.save(newEntry)
}
