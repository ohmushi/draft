import type { EntryNotFoundError, EntryRepository, Result } from '@/domain/entry'

export async function deleteEntry(
  repository: EntryRepository,
  slug: string,
): Promise<Result<void, EntryNotFoundError>> {
  const existing = await repository.findBySlug(slug)
  if (!existing) return { ok: false, error: { kind: 'not-found', slug } }
  await repository.delete(slug)
  return { ok: true, value: undefined }
}
