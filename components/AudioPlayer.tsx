'use client'

import { useRef, useState } from 'react'

type AudioPlayerProps = {
  readonly src: string
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

export default function AudioPlayer({ src }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const audioRef = useRef<HTMLAudioElement>(null)

  function handleToggle() {
    const audio = audioRef.current
    if (audio === null) return
    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
    } else {
      void audio.play()
      setIsPlaying(true)
    }
  }

  function handleTimeUpdate() {
    const audio = audioRef.current
    if (audio === null) return
    setCurrentTime(audio.currentTime)
  }

  function handleLoadedMetadata() {
    const audio = audioRef.current
    if (audio === null) return
    setDuration(audio.duration)
  }

  function handleEnded() {
    setIsPlaying(false)
    setCurrentTime(0)
  }

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <div className="audio-player">
      <audio
        ref={audioRef}
        src={src}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      />
      <button
        className="audio-player__btn"
        onClick={handleToggle}
        aria-label={isPlaying ? 'Mettre en pause' : 'Lire'}
      >
        {isPlaying ? (
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <rect x="6" y="4" width="4" height="16" />
            <rect x="14" y="4" width="4" height="16" />
          </svg>
        ) : (
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
        )}
      </button>
      <div className="audio-player__track">
        <div className="audio-player__bar">
          <div
            className="audio-player__fill"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <span className="audio-player__time">
          {formatTime(currentTime)}
          {duration > 0 && ` / ${formatTime(duration)}`}
        </span>
      </div>
    </div>
  )
}
