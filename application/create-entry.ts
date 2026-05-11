import type { CreateEntryInput, Entry, EntryRepository, NewEntry } from '@/domain/entry'
import { formatDate, formatTime, generateSlug } from '@/lib/slug'

export function buildContent(
  text: string,
  mediaUrls: readonly string[],
  audioUrls: readonly string[],
): string {
  const trimmed = text.trim()
  const imageMarkdown = mediaUrls.map(url => `![](${url})`).join('\n')
  const audioMarkdown = audioUrls.map(url => `<audio controls src="${url}"></audio>`).join('\n')

  const parts = [trimmed, imageMarkdown, audioMarkdown].filter(Boolean)
  return parts.join('\n\n')
}

export async function createEntry(
  repository: EntryRepository,
  input: CreateEntryInput,
  clock: () => Date = () => new Date(),
): Promise<Entry> {
  if (!input.text.trim() && input.mediaUrls.length === 0 && input.audioUrls.length === 0) {
    throw new Error('Entry content cannot be empty')
  }
  const now = clock()
  const newEntry: NewEntry = {
    slug: generateSlug(formatDate(now), now.getTime()),
    date: formatDate(now),
    time: formatTime(now),
    tag: input.tag,
    content: buildContent(input.text, input.mediaUrls, input.audioUrls),
  }
  return repository.save(newEntry)
}
