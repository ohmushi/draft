import type { Entry, EntryRepository } from '@/domain/entry'

export type AdjacentEntries = {
  readonly previous: Entry | null
  readonly next: Entry | null
}

export async function getAdjacentEntries(
  repository: EntryRepository,
  slug: string,
): Promise<AdjacentEntries> {
  const all = await repository.findAll()
  const index = all.findIndex((e) => e.slug === slug)
  if (index === -1) return { previous: null, next: null }
  return {
    next: all[index - 1] ?? null,
    previous: all[index + 1] ?? null,
  }
}
