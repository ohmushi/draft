import { describe, it, expect } from 'vitest'
import { deleteEntry } from './delete-entry'
import { createEntry } from './create-entry'
import { InMemoryEntryRepository } from '@/infrastructure/in-memory/entry-repository'

const fixedClock = () => new Date('2026-04-29T14:30:00')

describe('deleteEntry', () => {
  it('should delete an existing entry and return ok', async () => {
    const repository = new InMemoryEntryRepository()
    const entry = await createEntry(repository, { text: 'contenu', tag: null, mediaUrls: [], audioUrls: [] }, fixedClock)

    const result = await deleteEntry(repository, entry.slug)

    expect(result.ok).toBe(true)
    expect(await repository.findBySlug(entry.slug)).toBeNull()
  })

  it('should return not-found error for unknown slug', async () => {
    const repository = new InMemoryEntryRepository()

    const result = await deleteEntry(repository, 'slug-inexistant')

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error.kind).toBe('not-found')
      expect(result.error.slug).toBe('slug-inexistant')
    }
  })

  it('should not affect other entries when deleting one', async () => {
    const repository = new InMemoryEntryRepository()
    const first = await createEntry(repository, { text: 'premier', tag: null, mediaUrls: [], audioUrls: [] }, fixedClock)
    const second = await createEntry(repository, { text: 'deuxième', tag: null, mediaUrls: [], audioUrls: [] }, () => new Date('2026-04-30T10:00:00'))

    await deleteEntry(repository, first.slug)

    expect(await repository.findBySlug(first.slug)).toBeNull()
    expect(await repository.findBySlug(second.slug)).not.toBeNull()
  })
})
