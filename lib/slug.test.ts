import { describe, expect, it } from 'vitest'
import { formatDate, formatTime, generateSlug } from './slug'

describe('generateSlug', () => {
  it('should combine date and timestamp with a dash', () => {
    expect(generateSlug('2026-04-29', 1745932800000)).toBe('2026-04-29-1745932800000')
  })
})

describe('formatDate', () => {
  it('should format a date as YYYY-MM-DD', () => {
    expect(formatDate(new Date('2026-04-29T12:00:00'))).toBe('2026-04-29')
  })

  it('should zero-pad month and day below 10', () => {
    expect(formatDate(new Date('2026-01-05T12:00:00'))).toBe('2026-01-05')
  })

  it('should handle December correctly', () => {
    expect(formatDate(new Date('2026-12-31T12:00:00'))).toBe('2026-12-31')
  })
})

describe('formatTime', () => {
  it('should format time as HH:MM', () => {
    const date = new Date(2026, 3, 29, 14, 7, 0)
    expect(formatTime(date)).toBe('14:07')
  })

  it('should zero-pad single-digit hours and minutes', () => {
    const date = new Date(2026, 3, 29, 8, 5, 0)
    expect(formatTime(date)).toBe('08:05')
  })

  it('should handle midnight correctly', () => {
    const date = new Date(2026, 3, 29, 0, 0, 0)
    expect(formatTime(date)).toBe('00:00')
  })
})
