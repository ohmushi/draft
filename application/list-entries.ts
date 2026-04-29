import type { Entry, EntryRepository } from '@/domain/entry'

export async function listEntries(repository: EntryRepository): Promise<Entry[]> {
  return repository.findAll()
}
