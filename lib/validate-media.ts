import { MEDIA_LIMITS } from '@/domain/media'

export type MediaValidationError =
  | { readonly kind: 'TOO_MANY_PHOTOS'; readonly max: number }
  | { readonly kind: 'PHOTO_TOO_LARGE'; readonly maxBytes: number }
  | { readonly kind: 'AUDIO_TOO_LARGE'; readonly maxBytes: number }

type SizedFile = { readonly size: number }

export type MediaFilesInput = {
  readonly photos: readonly SizedFile[]
  readonly audio: SizedFile | null
}

export function validateMediaFiles(media: MediaFilesInput): MediaValidationError | null {
  if (media.photos.length > MEDIA_LIMITS.MAX_PHOTOS) {
    return { kind: 'TOO_MANY_PHOTOS', max: MEDIA_LIMITS.MAX_PHOTOS }
  }
  for (const photo of media.photos) {
    if (photo.size > MEDIA_LIMITS.MAX_PHOTO_SIZE_BYTES) {
      return { kind: 'PHOTO_TOO_LARGE', maxBytes: MEDIA_LIMITS.MAX_PHOTO_SIZE_BYTES }
    }
  }
  if (media.audio !== null && media.audio.size > MEDIA_LIMITS.MAX_AUDIO_SIZE_BYTES) {
    return { kind: 'AUDIO_TOO_LARGE', maxBytes: MEDIA_LIMITS.MAX_AUDIO_SIZE_BYTES }
  }
  return null
}
