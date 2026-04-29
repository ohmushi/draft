import { describe, expect, it } from 'vitest'
import { createEntry } from './create-entry'
import { InMemoryEntryRepository } from '@/infrastructure/in-memory/entry-repository'

const fixedClock = () => new Date(2026, 3, 29, 14, 30, 0)

describe('createEntry', () => {
  it('should persist the entry content and tag', async () => {
    const repository = new InMemoryEntryRepository()
    const entry = await createEntry(repository, { text: 'hello world', tag: 'dev' }, fixedClock)
    expect(entry.content).toBe('hello world')
    expect(entry.tag).toBe('dev')
  })

  it('should generate the slug from the clock date', async () => {
    const repository = new InMemoryEntryRepository()
    const entry = await createEntry(repository, { text: 'test', tag: null }, fixedClock)
    expect(entry.slug).toMatch(/^2026-04-29-\d+$/)
  })

  it('should set date and time from the clock', async () => {
    const repository = new InMemoryEntryRepository()
    const entry = await createEntry(repository, { text: 'test', tag: null }, fixedClock)
    expect(entry.date).toBe('2026-04-29')
    expect(entry.time).toBe('14:30')
  })

  it('should accept a null tag', async () => {
    const repository = new InMemoryEntryRepository()
    const entry = await createEntry(repository, { text: 'sans tag', tag: null }, fixedClock)
    expect(entry.tag).toBeNull()
  })

  it('should throw when text is empty', async () => {
    const repository = new InMemoryEntryRepository()
    await expect(
      createEntry(repository, { text: '', tag: null }, fixedClock)
    ).rejects.toThrow('Entry content cannot be empty')
  })

  it('should throw when text contains only whitespace', async () => {
    const repository = new InMemoryEntryRepository()
    await expect(
      createEntry(repository, { text: '   \n  ', tag: null }, fixedClock)
    ).rejects.toThrow('Entry content cannot be empty')
  })
})
