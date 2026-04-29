import type { Entry, EntryNotFoundError, EntryRepository, Result } from '@/domain/entry'

export async function getEntry(
  repository: EntryRepository,
  slug: string,
): Promise<Result<Entry, EntryNotFoundError>> {
  const entry = await repository.findBySlug(slug)
  if (!entry) return { ok: false, error: { kind: 'not-found', slug } }
  return { ok: true, value: entry }
}
