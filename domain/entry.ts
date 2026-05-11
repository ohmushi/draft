export type EntryTag = 'dev' | 'dessin' | 'music' | 'ecriture'

export const ENTRY_TAGS: readonly EntryTag[] = ['dev', 'dessin', 'music', 'ecriture'] as const

export function isEntryTag(value: string): value is EntryTag {
  return (ENTRY_TAGS as readonly string[]).includes(value)
}

export type Entry = {
  readonly id: number
  readonly slug: string
  readonly date: string
  readonly tag: EntryTag | null
  readonly time: string | null
  readonly content: string
  readonly createdAt: Date
}

export type CreateEntryInput = {
  readonly text: string
  readonly tag: EntryTag | null
  readonly mediaUrls: readonly string[]
  readonly audioUrl: string | null
}

export type NewEntry = {
  readonly slug: string
  readonly date: string
  readonly time: string
  readonly tag: EntryTag | null
  readonly content: string
}

export type EntryNotFoundError = {
  readonly kind: 'not-found'
  readonly slug: string
}

export type Result<T, E> =
  | { readonly ok: true; readonly value: T }
  | { readonly ok: false; readonly error: E }

export interface EntryRepository {
  save(entry: NewEntry): Promise<Entry>
  findAll(): Promise<Entry[]>
  findBySlug(slug: string): Promise<Entry | null>
}
