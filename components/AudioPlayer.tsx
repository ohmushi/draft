'use client'

import { useRef, useState } from 'react'
import { PlayIcon, PauseIcon } from './svg'

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
  const [duration, setDuration] = useState(0)

  const audioRef = useRef<HTMLAudioElement>(null)
  const fillRef = useRef<HTMLDivElement>(null)
  const timeRef = useRef<HTMLSpanElement>(null)
  const rafRef = useRef<number | null>(null)
  const durationRef = useRef<number>(0)
  const currentTimeRef = useRef<number>(0)

  function tick() {
    const audio = audioRef.current
    if (audio === null) return
    const current = audio.currentTime
    currentTimeRef.current = current
    const dur = durationRef.current
    if (fillRef.current !== null) {
      fillRef.current.style.width = dur > 0 ? `${(current / dur) * 100}%` : '0%'
    }
    if (timeRef.current !== null) {
      timeRef.current.textContent = dur > 0
        ? `${formatTime(current)} / ${formatTime(dur)}`
        : formatTime(current)
    }
    rafRef.current = requestAnimationFrame(tick)
  }

  function startRAF() {
    if (rafRef.current !== null) return
    rafRef.current = requestAnimationFrame(tick)
  }

  function stopRAF() {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
  }

  function handleToggle() {
    const audio = audioRef.current
    if (audio === null) return
    if (isPlaying) {
      audio.pause()
      stopRAF()
      setIsPlaying(false)
    } else {
      void audio.play()
      startRAF()
      setIsPlaying(true)
    }
  }

  function handleLoadedMetadata() {
    const audio = audioRef.current
    if (audio === null) return
    durationRef.current = audio.duration
    setDuration(audio.duration)
  }

  function handleEnded() {
    stopRAF()
    currentTimeRef.current = 0
    if (fillRef.current !== null) fillRef.current.style.width = '0%'
    if (timeRef.current !== null) {
      const dur = durationRef.current
      timeRef.current.textContent = dur > 0 ? `0:00 / ${formatTime(dur)}` : '0:00'
    }
    setIsPlaying(false)
  }

  const timeText = `${formatTime(currentTimeRef.current)}${duration > 0 ? ` / ${formatTime(duration)}` : ''}`

  return (
    <div className="audio-player">
      <audio
        ref={audioRef}
        src={src}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      />
      <button
        className="audio-player__btn"
        onClick={handleToggle}
        aria-label={isPlaying ? 'Mettre en pause' : 'Lire'}
      >
        {isPlaying ? <PauseIcon /> : <PlayIcon />}
      </button>
      <div className="audio-player__track">
        <div className="audio-player__bar">
          <div ref={fillRef} className="audio-player__fill" />
        </div>
        <span ref={timeRef} className="audio-player__time">
          {timeText}
        </span>
      </div>
    </div>
  )
}
