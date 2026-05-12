import { describe, it, expect } from 'vitest'
import { getAdjacentEntries } from './get-adjacent-entries'
import { InMemoryEntryRepository } from '@/infrastructure/in-memory/entry-repository'

async function makeRepo(slugs: string[]) {
  const repository = new InMemoryEntryRepository()
  for (const slug of slugs) {
    await repository.save({ slug, date: slug.slice(0, 10), time: null, tag: null, content: 'x' })
  }
  return repository
}

describe('getAdjacentEntries', () => {
  it('returns both adjacent entries for a middle entry', async () => {
    const repository = await makeRepo(['2026-04-15', '2026-04-18', '2026-04-20'])
    const result = await getAdjacentEntries(repository, '2026-04-18')
    expect(result.next?.slug).toBe('2026-04-20')
    expect(result.previous?.slug).toBe('2026-04-15')
  })

  it('returns no next for the most recent entry', async () => {
    const repository = await makeRepo(['2026-04-15', '2026-04-18', '2026-04-20'])
    const result = await getAdjacentEntries(repository, '2026-04-20')
    expect(result.next).toBeNull()
    expect(result.previous?.slug).toBe('2026-04-18')
  })

  it('returns no previous for the oldest entry', async () => {
    const repository = await makeRepo(['2026-04-15', '2026-04-18', '2026-04-20'])
    const result = await getAdjacentEntries(repository, '2026-04-15')
    expect(result.previous).toBeNull()
    expect(result.next?.slug).toBe('2026-04-18')
  })

  it('returns both null for a single entry', async () => {
    const repository = await makeRepo(['2026-04-20'])
    const result = await getAdjacentEntries(repository, '2026-04-20')
    expect(result.previous).toBeNull()
    expect(result.next).toBeNull()
  })

  it('returns both null for an unknown slug', async () => {
    const repository = await makeRepo(['2026-04-15', '2026-04-20'])
    const result = await getAdjacentEntries(repository, 'inexistant')
    expect(result.previous).toBeNull()
    expect(result.next).toBeNull()
  })
})
