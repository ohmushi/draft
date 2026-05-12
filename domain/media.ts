export interface MediaStorage {
  upload(file: File, filename: string): Promise<string>
}

export const MEDIA_LIMITS = {
  MAX_PHOTOS: 5,
  MAX_PHOTO_SIZE_BYTES: 10 * 1024 * 1024,
  MAX_AUDIO_SIZE_BYTES: 25 * 1024 * 1024,
} as const
