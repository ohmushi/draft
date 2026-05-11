import type { CreateEntryInput, Entry, EntryRepository, NewEntry } from '@/domain/entry'
import { formatDate, formatTime, generateSlug } from '@/lib/slug'

export function buildContent(
  text: string,
  mediaUrls: readonly string[],
  audioUrl: string | null,
): string {
  const trimmed = text.trim()
  const imageMarkdown = mediaUrls.map(url => `![](${url})`).join('\n')
  const audioMarkdown = audioUrl !== null ? `<audio controls src="${audioUrl}"></audio>` : ''

  const parts = [trimmed, imageMarkdown, audioMarkdown].filter(Boolean)
  return parts.join('\n\n')
}

export async function createEntry(
  repository: EntryRepository,
  input: CreateEntryInput,
  clock: () => Date = () => new Date(),
): Promise<Entry> {
  if (!input.text.trim() && input.mediaUrls.length === 0 && input.audioUrl === null) {
    throw new Error('Entry content cannot be empty')
  }
  const now = clock()
  const newEntry: NewEntry = {
    slug: generateSlug(formatDate(now), now.getTime()),
    date: formatDate(now),
    time: formatTime(now),
    tag: input.tag,
    content: buildContent(input.text, input.mediaUrls, input.audioUrl),
  }
  return repository.save(newEntry)
}
