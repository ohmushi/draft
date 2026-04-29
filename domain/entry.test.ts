import { describe, expect, it } from 'vitest'
import { isEntryTag, ENTRY_TAGS } from './entry'

describe('isEntryTag', () => {
  it('should return true for all valid tags', () => {
    for (const tag of ENTRY_TAGS) {
      expect(isEntryTag(tag)).toBe(true)
    }
  })

  it('should return false for an unknown string', () => {
    expect(isEntryTag('unknown')).toBe(false)
  })

  it('should return false for empty string', () => {
    expect(isEntryTag('')).toBe(false)
  })

  it('should be case-sensitive', () => {
    expect(isEntryTag('DEV')).toBe(false)
    expect(isEntryTag('Dev')).toBe(false)
  })
})
