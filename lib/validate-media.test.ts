import { describe, it, expect } from 'vitest'
import { validateMediaFiles } from './validate-media'
import { MEDIA_LIMITS } from '@/domain/media'

const photo = (size: number) => ({ size })

describe('validateMediaFiles', () => {
  it('returns null for empty input', () => {
    expect(validateMediaFiles({ photos: [], audio: null })).toBeNull()
  })

  it('returns null when photos and audio are exactly at limits', () => {
    const photos = Array.from({ length: MEDIA_LIMITS.MAX_PHOTOS }, () =>
      photo(MEDIA_LIMITS.MAX_PHOTO_SIZE_BYTES)
    )
    expect(validateMediaFiles({ photos, audio: photo(MEDIA_LIMITS.MAX_AUDIO_SIZE_BYTES) })).toBeNull()
  })

  it('returns TOO_MANY_PHOTOS when photo count exceeds limit', () => {
    const photos = Array.from({ length: MEDIA_LIMITS.MAX_PHOTOS + 1 }, () => photo(1000))
    expect(validateMediaFiles({ photos, audio: null })).toEqual({
      kind: 'TOO_MANY_PHOTOS',
      max: MEDIA_LIMITS.MAX_PHOTOS,
    })
  })

  it('returns PHOTO_TOO_LARGE when one photo exceeds size limit', () => {
    const photos = [photo(1000), photo(MEDIA_LIMITS.MAX_PHOTO_SIZE_BYTES + 1)]
    expect(validateMediaFiles({ photos, audio: null })).toEqual({
      kind: 'PHOTO_TOO_LARGE',
      maxBytes: MEDIA_LIMITS.MAX_PHOTO_SIZE_BYTES,
    })
  })

  it('returns AUDIO_TOO_LARGE when audio exceeds size limit', () => {
    expect(validateMediaFiles({ photos: [], audio: photo(MEDIA_LIMITS.MAX_AUDIO_SIZE_BYTES + 1) })).toEqual({
      kind: 'AUDIO_TOO_LARGE',
      maxBytes: MEDIA_LIMITS.MAX_AUDIO_SIZE_BYTES,
    })
  })

  it('checks TOO_MANY_PHOTOS before PHOTO_TOO_LARGE', () => {
    const photos = Array.from({ length: MEDIA_LIMITS.MAX_PHOTOS + 1 }, () =>
      photo(MEDIA_LIMITS.MAX_PHOTO_SIZE_BYTES + 1)
    )
    expect(validateMediaFiles({ photos, audio: null })?.kind).toBe('TOO_MANY_PHOTOS')
  })
})
