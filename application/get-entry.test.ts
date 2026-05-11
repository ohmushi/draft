import { describe, expect, it } from 'vitest'
import { getEntry } from './get-entry'
import { createEntry } from './create-entry'
import { InMemoryEntryRepository } from '@/infrastructure/in-memory/entry-repository'

const fixedClock = () => new Date(2026, 3, 29, 14, 30, 0)

describe('getEntry', () => {
  it('should return the entry when it exists', async () => {
    const repository = new InMemoryEntryRepository()
    const created = await createEntry(repository, { text: 'contenu', tag: 'dev', mediaUrls: [], audioUrl: null }, fixedClock)
    const result = await getEntry(repository, created.slug)
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.value.content).toBe('contenu')
      expect(result.value.tag).toBe('dev')
    }
  })

  it('should return a not-found error for an unknown slug', async () => {
    const repository = new InMemoryEntryRepository()
    const result = await getEntry(repository, 'slug-inexistant')
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error.kind).toBe('not-found')
      expect(result.error.slug).toBe('slug-inexistant')
    }
  })

  it('should find an entry by its exact slug', async () => {
    const repository = new InMemoryEntryRepository()
    await createEntry(repository, { text: 'first', tag: null, mediaUrls: [], audioUrl: null }, fixedClock)
    const created = await createEntry(repository, { text: 'target', tag: 'dessin', mediaUrls: [], audioUrl: null }, () => new Date(2026, 3, 29, 15, 0, 0))
    const result = await getEntry(repository, created.slug)
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.value.content).toBe('target')
    }
  })
})
