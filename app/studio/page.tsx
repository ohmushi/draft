'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import type { EntryTag } from '@/domain/entry'
import styles from './studio.module.css'

type Photo = {
  readonly id: number
  readonly url: string
  readonly file: File
}

type AudioCapture = {
  readonly blob: Blob
  readonly duration: number
  readonly objectUrl: string
}

type SubmitState = 'idle' | 'loading' | 'success' | 'error'

const TAGS: readonly { value: EntryTag; label: string; activeClass: string }[] = [
  { value: 'dev', label: 'dev', activeClass: styles.tagDev },
  { value: 'dessin', label: 'dessin', activeClass: styles.tagDessin },
  { value: 'music', label: 'musique', activeClass: styles.tagMusic },
  { value: 'ecriture', label: 'écriture', activeClass: styles.tagEcriture },
]

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

export default function StudioPage() {
  const [text, setText] = useState('')
  const [selectedTag, setSelectedTag] = useState<EntryTag | null>(null)
  const [photos, setPhotos] = useState<readonly Photo[]>([])
  const [isRecording, setIsRecording] = useState(false)
  const [recSeconds, setRecSeconds] = useState(0)
  const [audioCapture, setAudioCapture] = useState<AudioCapture | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [submitState, setSubmitState] = useState<SubmitState>('idle')

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const recordingChunksRef = useRef<Blob[]>([])
  const recTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const pendingDurationRef = useRef<number>(0)

  useEffect(() => {
    textareaRef.current?.focus()
  }, [])

  useEffect(() => {
    return () => {
      if (recTimerRef.current !== null) clearInterval(recTimerRef.current)
      if (mediaRecorderRef.current?.state === 'recording') {
        mediaRecorderRef.current.stop()
      }
    }
  }, [])

  const canPublish = text.trim().length > 0 || photos.length > 0 || audioCapture !== null

  const handleTagClick = useCallback((tag: EntryTag) => {
    setSelectedTag(current => (current === tag ? null : tag))
  }, [])

  const handleAddPhoto = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0]
    if (file === undefined) return
    const reader = new FileReader()
    reader.onload = (e) => {
      const url = e.target?.result
      if (typeof url !== 'string') return
      setPhotos(prev => [...prev, { id: Date.now(), url, file }])
    }
    reader.readAsDataURL(file)
    event.currentTarget.value = ''
  }, [])

  const handleRemovePhoto = useCallback((id: number) => {
    setPhotos(prev => prev.filter(p => p.id !== id))
  }, [])

  const handleRemoveAudio = useCallback(() => {
    if (audioCapture !== null) {
      URL.revokeObjectURL(audioCapture.objectUrl)
    }
    setAudioCapture(null)
    setIsPlaying(false)
  }, [audioCapture])

  const handleToggleRecording = useCallback(async () => {
    if (isRecording) {
      pendingDurationRef.current = recSeconds
      if (recTimerRef.current !== null) {
        clearInterval(recTimerRef.current)
        recTimerRef.current = null
      }
      mediaRecorderRef.current?.stop()
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        const recorder = new MediaRecorder(stream)
        recordingChunksRef.current = []

        recorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            recordingChunksRef.current.push(event.data)
          }
        }

        recorder.onstop = () => {
          const blob = new Blob(recordingChunksRef.current, { type: recorder.mimeType })
          const objectUrl = URL.createObjectURL(blob)
          setAudioCapture({ blob, duration: pendingDurationRef.current, objectUrl })
          stream.getTracks().forEach(track => track.stop())
          setIsRecording(false)
        }

        mediaRecorderRef.current = recorder
        recorder.start()
        setRecSeconds(0)
        setIsRecording(true)
        recTimerRef.current = setInterval(() => {
          setRecSeconds(s => s + 1)
        }, 1000)
      } catch {
        // getUserMedia non disponible ou permission refusée
      }
    }
  }, [isRecording, recSeconds])

  const handleTogglePlayback = useCallback(() => {
    const audio = audioRef.current
    if (audio === null) return
    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
    } else {
      void audio.play()
      setIsPlaying(true)
    }
  }, [isPlaying])

  const handleSubmit = useCallback(async () => {
    if (!canPublish) return
    setSubmitState('loading')

    const formData = new FormData()
    formData.append('text', text.trim())
    if (selectedTag !== null) formData.append('tag', selectedTag)
    for (const photo of photos) {
      formData.append('photos', photo.file)
    }
    if (audioCapture !== null) {
      const ext = audioCapture.blob.type.includes('ogg') ? '.ogg' : '.webm'
      formData.append('audio', audioCapture.blob, `audio${ext}`)
    }

    try {
      const response = await fetch('/api/entry', { method: 'POST', body: formData })
      if (!response.ok) {
        setSubmitState('error')
        return
      }
      setSubmitState('success')
      setTimeout(() => {
        if (audioCapture !== null) {
          URL.revokeObjectURL(audioCapture.objectUrl)
        }
        setText('')
        setSelectedTag(null)
        setPhotos([])
        setAudioCapture(null)
        setIsPlaying(false)
        setRecSeconds(0)
        setSubmitState('idle')
        textareaRef.current?.focus()
      }, 1600)
    } catch {
      setSubmitState('error')
    }
  }, [canPublish, text, selectedTag, photos, audioCapture])

  return (
    <div className={styles.phoneBg}>
      <div className={styles.page}>

        {/* Header */}
        <div className={styles.header}>
          <span className={styles.logo}>Draft</span>
          <Link href="/" className={styles.fluxLink}>flux</Link>
        </div>

        {/* Wavy divider */}
        <div className={styles.wavy}>
          <svg viewBox="0 0 340 8" fill="none">
            <path
              d="M0 4 C40 1, 80 7, 130 4 S220 1.5, 270 4.5 S320 6, 340 4"
              stroke="#1C1A17"
              strokeWidth="1"
              strokeLinecap="round"
              opacity="0.12"
              fill="none"
            />
          </svg>
        </div>

        {/* Content area */}
        <div className={styles.content}>
          <textarea
            ref={textareaRef}
            className={styles.textarea}
            placeholder="une pensée, une observation, un bout de quelque chose…"
            value={text}
            onChange={e => setText(e.target.value)}
          />

          {isRecording && (
            <div className={styles.recordingBar}>
              <div className={styles.recDot} />
              <span className={styles.recLabel}>
                enregistrement — {formatDuration(recSeconds)}
              </span>
              <button className={styles.recStop} onClick={handleToggleRecording}>
                arrêter
              </button>
            </div>
          )}

          {(photos.length > 0 || audioCapture !== null) && (
            <div className={styles.mediaPreviews}>
              {photos.map(photo => (
                <div key={photo.id} className={styles.mediaThumb}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={photo.url} alt="" />
                  <button
                    className={styles.thumbRemove}
                    onClick={() => handleRemovePhoto(photo.id)}
                    aria-label="Supprimer la photo"
                  >
                    ×
                  </button>
                </div>
              ))}
              {audioCapture !== null && (
                <>
                  <audio
                    ref={audioRef}
                    src={audioCapture.objectUrl}
                    onEnded={() => setIsPlaying(false)}
                  />
                  <div className={`${styles.mediaThumb} ${styles.audioThumb}`}>
                    <button
                      className={styles.audioPlayBtn}
                      onClick={handleTogglePlayback}
                      aria-label={isPlaying ? "Mettre en pause" : "Écouter l'enregistrement"}
                    >
                      {isPlaying ? (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="6" y="4" width="4" height="16" />
                          <rect x="14" y="4" width="4" height="16" />
                        </svg>
                      ) : (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <polygon points="5 3 19 12 5 21 5 3" />
                        </svg>
                      )}
                    </button>
                    <span className={styles.audioLabel}>{formatDuration(audioCapture.duration)}</span>
                    <button
                      className={styles.thumbRemove}
                      onClick={handleRemoveAudio}
                      aria-label="Supprimer l'audio"
                    >
                      ×
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {submitState === 'error' && (
            <p className={styles.errorMsg}>erreur — réessayer</p>
          )}
        </div>

        {/* Bottom bar */}
        <div className={styles.bottomBar}>
          <div className={styles.tagRow}>
            <span className={styles.tagLabel}>tag</span>
            {TAGS.map(({ value, label, activeClass }) => (
              <button
                key={value}
                className={`${styles.tagBtn} ${selectedTag === value ? activeClass : ''}`}
                onClick={() => handleTagClick(value)}
              >
                {label}
              </button>
            ))}
          </div>

          <div className={styles.actionsRow}>
            <div className={styles.mediaActions}>
              <div className={styles.iconBtn}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="6" width="20" height="14" rx="2" />
                  <circle cx="12" cy="13" r="3.5" />
                  <path d="M8 6V5a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v1" />
                </svg>
                <input type="file" accept="image/*" onChange={handleAddPhoto} />
              </div>

              <button
                className={`${styles.iconBtn} ${isRecording ? styles.iconBtnRecording : ''}`}
                onClick={handleToggleRecording}
                aria-label={isRecording ? "Arrêter l'enregistrement" : "Démarrer l'enregistrement"}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="2" width="6" height="11" rx="3" />
                  <path d="M5 10a7 7 0 0 0 14 0" />
                  <line x1="12" y1="17" x2="12" y2="21" />
                  <line x1="9" y1="21" x2="15" y2="21" />
                </svg>
              </button>
            </div>

            <button
              className={styles.sendBtn}
              onClick={handleSubmit}
              disabled={!canPublish || submitState === 'loading'}
            >
              {submitState === 'loading' ? '…' : 'publier ↑'}
            </button>
          </div>
        </div>

        {/* Success overlay */}
        {submitState === 'success' && (
          <div className={styles.successOverlay}>
            <div className={styles.successMark}>✓</div>
            <div className={styles.successLabel}>posté dans le flux</div>
          </div>
        )}

      </div>
    </div>
  )
}
