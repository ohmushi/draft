import { describe, expect, it } from 'vitest'
import { listEntries } from './list-entries'
import { createEntry } from './create-entry'
import { InMemoryEntryRepository } from '@/infrastructure/in-memory/entry-repository'

describe('listEntries', () => {
  it('should return an empty array when no entries exist', async () => {
    const repository = new InMemoryEntryRepository()
    const entries = await listEntries(repository)
    expect(entries).toHaveLength(0)
  })

  it('should return all created entries', async () => {
    const repository = new InMemoryEntryRepository()
    await createEntry(repository, { text: 'first', tag: null }, () => new Date(2026, 3, 28))
    await createEntry(repository, { text: 'second', tag: 'dev' }, () => new Date(2026, 3, 29))
    const entries = await listEntries(repository)
    expect(entries).toHaveLength(2)
  })

  it('should return entries in reverse chronological order', async () => {
    const repository = new InMemoryEntryRepository()
    await createEntry(repository, { text: 'older', tag: null }, () => new Date(2026, 3, 28))
    await createEntry(repository, { text: 'newer', tag: null }, () => new Date(2026, 3, 29))
    const entries = await listEntries(repository)
    expect(entries[0].content).toBe('newer')
    expect(entries[1].content).toBe('older')
  })
})
