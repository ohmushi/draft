import { describe, expect, it } from 'vitest'
import { buildContent, createEntry } from './create-entry'
import { InMemoryEntryRepository } from '@/infrastructure/in-memory/entry-repository'

const fixedClock = () => new Date(2026, 3, 29, 14, 30, 0)

describe('createEntry', () => {
  it('should persist the entry content and tag', async () => {
    const repository = new InMemoryEntryRepository()
    const entry = await createEntry(repository, { text: 'hello world', tag: 'dev', mediaUrls: [], audioUrl: null }, fixedClock)
    expect(entry.content).toBe('hello world')
    expect(entry.tag).toBe('dev')
  })

  it('should generate the slug from the clock date', async () => {
    const repository = new InMemoryEntryRepository()
    const entry = await createEntry(repository, { text: 'test', tag: null, mediaUrls: [], audioUrl: null }, fixedClock)
    expect(entry.slug).toMatch(/^2026-04-29-\d+$/)
  })

  it('should set date and time from the clock', async () => {
    const repository = new InMemoryEntryRepository()
    const entry = await createEntry(repository, { text: 'test', tag: null, mediaUrls: [], audioUrl: null }, fixedClock)
    expect(entry.date).toBe('2026-04-29')
    expect(entry.time).toBe('14:30')
  })

  it('should accept a null tag', async () => {
    const repository = new InMemoryEntryRepository()
    const entry = await createEntry(repository, { text: 'sans tag', tag: null, mediaUrls: [], audioUrl: null }, fixedClock)
    expect(entry.tag).toBeNull()
  })

  it('should throw when text is empty and no media', async () => {
    const repository = new InMemoryEntryRepository()
    await expect(
      createEntry(repository, { text: '', tag: null, mediaUrls: [], audioUrl: null }, fixedClock)
    ).rejects.toThrow('Entry content cannot be empty')
  })

  it('should throw when text contains only whitespace and no media', async () => {
    const repository = new InMemoryEntryRepository()
    await expect(
      createEntry(repository, { text: '   \n  ', tag: null, mediaUrls: [], audioUrl: null }, fixedClock)
    ).rejects.toThrow('Entry content cannot be empty')
  })

  it('should succeed with empty text when mediaUrls are provided', async () => {
    const repository = new InMemoryEntryRepository()
    const entry = await createEntry(
      repository,
      { text: '', tag: null, mediaUrls: ['https://mock-minio/photo.jpg'], audioUrl: null },
      fixedClock,
    )
    expect(entry.content).toBe('![](https://mock-minio/photo.jpg)')
  })

  it('should append image markdown after text when both are present', async () => {
    const repository = new InMemoryEntryRepository()
    const entry = await createEntry(
      repository,
      { text: 'caption', tag: null, mediaUrls: ['https://mock-minio/a.jpg', 'https://mock-minio/b.jpg'], audioUrl: null },
      fixedClock,
    )
    expect(entry.content).toBe('caption\n\n![](https://mock-minio/a.jpg)\n![](https://mock-minio/b.jpg)')
  })

  it('should succeed with audio only', async () => {
    const repository = new InMemoryEntryRepository()
    const entry = await createEntry(
      repository,
      { text: '', tag: null, mediaUrls: [], audioUrl: 'https://mock-minio/rec.webm' },
      fixedClock,
    )
    expect(entry.content).toBe('<audio controls src="https://mock-minio/rec.webm"></audio>')
  })

  it('should append audio after text and images', async () => {
    const repository = new InMemoryEntryRepository()
    const entry = await createEntry(
      repository,
      { text: 'note vocale', tag: null, mediaUrls: ['https://mock-minio/img.jpg'], audioUrl: 'https://mock-minio/rec.webm' },
      fixedClock,
    )
    expect(entry.content).toBe(
      'note vocale\n\n![](https://mock-minio/img.jpg)\n\n<audio controls src="https://mock-minio/rec.webm"></audio>',
    )
  })
})

describe('buildContent', () => {
  it('should return text only when no media', () => {
    expect(buildContent('hello', [], null)).toBe('hello')
  })

  it('should return image markdown only when no text', () => {
    expect(buildContent('', ['https://cdn/img.jpg'], null)).toBe('![](https://cdn/img.jpg)')
  })

  it('should join text and images with a blank line', () => {
    expect(buildContent('note', ['https://cdn/a.jpg', 'https://cdn/b.jpg'], null)).toBe(
      'note\n\n![](https://cdn/a.jpg)\n![](https://cdn/b.jpg)',
    )
  })

  it('should trim leading/trailing whitespace from text', () => {
    expect(buildContent('  hello  ', [], null)).toBe('hello')
  })

  it('should return audio tag only when no text and no images', () => {
    expect(buildContent('', [], 'https://cdn/rec.webm')).toBe(
      '<audio controls src="https://cdn/rec.webm"></audio>',
    )
  })

  it('should append audio after images', () => {
    expect(buildContent('', ['https://cdn/img.jpg'], 'https://cdn/rec.webm')).toBe(
      '![](https://cdn/img.jpg)\n\n<audio controls src="https://cdn/rec.webm"></audio>',
    )
  })

  it('should order text then images then audio', () => {
    expect(buildContent('texte', ['https://cdn/img.jpg'], 'https://cdn/rec.webm')).toBe(
      'texte\n\n![](https://cdn/img.jpg)\n\n<audio controls src="https://cdn/rec.webm"></audio>',
    )
  })
})
