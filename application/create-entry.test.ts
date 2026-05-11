import { describe, expect, it } from 'vitest'
import { buildContent, createEntry } from './create-entry'
import { InMemoryEntryRepository } from '@/infrastructure/in-memory/entry-repository'

const fixedClock = () => new Date(2026, 3, 29, 14, 30, 0)

describe('createEntry', () => {
  it('should persist the entry content and tag', async () => {
    const repository = new InMemoryEntryRepository()
    const entry = await createEntry(repository, { text: 'hello world', tag: 'dev', mediaUrls: [], audioUrls: [] }, fixedClock)
    expect(entry.content).toBe('hello world')
    expect(entry.tag).toBe('dev')
  })

  it('should generate the slug from the clock date', async () => {
    const repository = new InMemoryEntryRepository()
    const entry = await createEntry(repository, { text: 'test', tag: null, mediaUrls: [], audioUrls: [] }, fixedClock)
    expect(entry.slug).toMatch(/^2026-04-29-\d+$/)
  })

  it('should set date and time from the clock', async () => {
    const repository = new InMemoryEntryRepository()
    const entry = await createEntry(repository, { text: 'test', tag: null, mediaUrls: [], audioUrls: [] }, fixedClock)
    expect(entry.date).toBe('2026-04-29')
    expect(entry.time).toBe('14:30')
  })

  it('should accept a null tag', async () => {
    const repository = new InMemoryEntryRepository()
    const entry = await createEntry(repository, { text: 'sans tag', tag: null, mediaUrls: [], audioUrls: [] }, fixedClock)
    expect(entry.tag).toBeNull()
  })

  it('should throw when text is empty and no media', async () => {
    const repository = new InMemoryEntryRepository()
    await expect(
      createEntry(repository, { text: '', tag: null, mediaUrls: [], audioUrls: [] }, fixedClock)
    ).rejects.toThrow('Entry content cannot be empty')
  })

  it('should throw when text contains only whitespace and no media', async () => {
    const repository = new InMemoryEntryRepository()
    await expect(
      createEntry(repository, { text: '   \n  ', tag: null, mediaUrls: [], audioUrls: [] }, fixedClock)
    ).rejects.toThrow('Entry content cannot be empty')
  })

  it('should succeed with empty text when mediaUrls are provided', async () => {
    const repository = new InMemoryEntryRepository()
    const entry = await createEntry(
      repository,
      { text: '', tag: null, mediaUrls: ['https://mock-minio/photo.jpg'], audioUrls: [] },
      fixedClock,
    )
    expect(entry.content).toBe('<PhotoGrid urls={["https://mock-minio/photo.jpg"]} />')
  })

  it('should append image markdown after text when both are present', async () => {
    const repository = new InMemoryEntryRepository()
    const entry = await createEntry(
      repository,
      { text: 'caption', tag: null, mediaUrls: ['https://mock-minio/a.jpg', 'https://mock-minio/b.jpg'], audioUrls: [] },
      fixedClock,
    )
    expect(entry.content).toBe(
      'caption\n\n<PhotoGrid urls={["https://mock-minio/a.jpg","https://mock-minio/b.jpg"]} />',
    )
  })

  it('should succeed with a single audio only', async () => {
    const repository = new InMemoryEntryRepository()
    const entry = await createEntry(
      repository,
      { text: '', tag: null, mediaUrls: [], audioUrls: ['https://mock-minio/rec.webm'] },
      fixedClock,
    )
    expect(entry.content).toBe('<AudioPlayer src="https://mock-minio/rec.webm" />')
  })

  it('should succeed with multiple audios only', async () => {
    const repository = new InMemoryEntryRepository()
    const entry = await createEntry(
      repository,
      { text: '', tag: null, mediaUrls: [], audioUrls: ['https://mock-minio/r1.webm', 'https://mock-minio/r2.webm'] },
      fixedClock,
    )
    expect(entry.content).toBe(
      '<AudioPlayer src="https://mock-minio/r1.webm" />\n<AudioPlayer src="https://mock-minio/r2.webm" />',
    )
  })

  it('should append audios after text and images', async () => {
    const repository = new InMemoryEntryRepository()
    const entry = await createEntry(
      repository,
      { text: 'note vocale', tag: null, mediaUrls: ['https://mock-minio/img.jpg'], audioUrls: ['https://mock-minio/rec.webm'] },
      fixedClock,
    )
    expect(entry.content).toBe(
      'note vocale\n\n<PhotoGrid urls={["https://mock-minio/img.jpg"]} />\n\n<AudioPlayer src="https://mock-minio/rec.webm" />',
    )
  })
})

describe('buildContent', () => {
  it('should return text only when no media', () => {
    expect(buildContent('hello', [], [])).toBe('hello')
  })

  it('should return PhotoGrid only when no text', () => {
    expect(buildContent('', ['https://cdn/img.jpg'], [])).toBe(
      '<PhotoGrid urls={["https://cdn/img.jpg"]} />',
    )
  })

  it('should join text and PhotoGrid with a blank line', () => {
    expect(buildContent('note', ['https://cdn/a.jpg', 'https://cdn/b.jpg'], [])).toBe(
      'note\n\n<PhotoGrid urls={["https://cdn/a.jpg","https://cdn/b.jpg"]} />',
    )
  })

  it('should trim leading/trailing whitespace from text', () => {
    expect(buildContent('  hello  ', [], [])).toBe('hello')
  })

  it('should return single AudioPlayer when no text and no images', () => {
    expect(buildContent('', [], ['https://cdn/rec.webm'])).toBe(
      '<AudioPlayer src="https://cdn/rec.webm" />',
    )
  })

  it('should return multiple AudioPlayers joined by newline', () => {
    expect(buildContent('', [], ['https://cdn/r1.webm', 'https://cdn/r2.webm'])).toBe(
      '<AudioPlayer src="https://cdn/r1.webm" />\n<AudioPlayer src="https://cdn/r2.webm" />',
    )
  })

  it('should append AudioPlayer after PhotoGrid', () => {
    expect(buildContent('', ['https://cdn/img.jpg'], ['https://cdn/rec.webm'])).toBe(
      '<PhotoGrid urls={["https://cdn/img.jpg"]} />\n\n<AudioPlayer src="https://cdn/rec.webm" />',
    )
  })

  it('should order text then PhotoGrid then AudioPlayer', () => {
    expect(buildContent('texte', ['https://cdn/img.jpg'], ['https://cdn/rec.webm'])).toBe(
      'texte\n\n<PhotoGrid urls={["https://cdn/img.jpg"]} />\n\n<AudioPlayer src="https://cdn/rec.webm" />',
    )
  })
})
