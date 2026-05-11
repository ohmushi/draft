// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import AudioPlayer from './AudioPlayer'

describe('AudioPlayer', () => {
  it('renders the audio element with correct src', () => {
    const { container } = render(<AudioPlayer src="https://cdn/rec.webm" />)
    const audio = container.querySelector('audio')
    expect(audio).not.toBeNull()
    expect(audio?.getAttribute('src')).toBe('https://cdn/rec.webm')
  })

  it('renders the play button with correct aria-label', () => {
    const { container } = render(<AudioPlayer src="https://cdn/rec.webm" />)
    const btn = container.querySelector('.audio-player__btn')
    expect(btn?.getAttribute('aria-label')).toBe('Lire')
  })

  it('renders initial time as 0:00', () => {
    const { container } = render(<AudioPlayer src="https://cdn/rec.webm" />)
    expect(container.querySelector('.audio-player__time')?.textContent).toBe('0:00')
  })

  it('renders the expected structure', () => {
    const { container } = render(<AudioPlayer src="https://cdn/rec.webm" />)
    expect(container.querySelector('.audio-player')).not.toBeNull()
    expect(container.querySelector('.audio-player__track')).not.toBeNull()
    expect(container.querySelector('.audio-player__bar')).not.toBeNull()
    expect(container.querySelector('.audio-player__fill')).not.toBeNull()
  })
})
