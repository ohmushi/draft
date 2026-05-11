// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import PhotoGrid from './PhotoGrid'

describe('PhotoGrid', () => {
  it('renders nothing when urls is empty', () => {
    const { container } = render(<PhotoGrid urls={[]} />)
    expect(container.firstChild).toBeNull()
  })

  it('renders all images when limit is not provided', () => {
    const urls = ['a.jpg', 'b.jpg', 'c.jpg', 'd.jpg', 'e.jpg']
    const { container } = render(<PhotoGrid urls={urls} />)
    expect(container.querySelectorAll('.photo-grid__img')).toHaveLength(5)
    expect(container.querySelector('.photo-grid__badge')).toBeNull()
  })

  it('limits images and shows badge when limit is exceeded', () => {
    const urls = ['a.jpg', 'b.jpg', 'c.jpg', 'd.jpg', 'e.jpg', 'f.jpg']
    const { container } = render(<PhotoGrid urls={urls} limit={4} />)
    expect(container.querySelectorAll('.photo-grid__img')).toHaveLength(4)
    expect(container.querySelector('.photo-grid__badge')?.textContent).toBe('+2')
  })

  it('does not show badge when visible count equals total', () => {
    const urls = ['a.jpg', 'b.jpg', 'c.jpg']
    const { container } = render(<PhotoGrid urls={urls} limit={4} />)
    expect(container.querySelectorAll('.photo-grid__img')).toHaveLength(3)
    expect(container.querySelector('.photo-grid__badge')).toBeNull()
  })

  it('applies correct grid class for 2 visible images', () => {
    const { container } = render(<PhotoGrid urls={['a.jpg', 'b.jpg']} />)
    expect(container.querySelector('.photo-grid--2')).not.toBeNull()
  })

  it('caps grid class at --4 for more than 4 images', () => {
    const urls = ['a.jpg', 'b.jpg', 'c.jpg', 'd.jpg', 'e.jpg']
    const { container } = render(<PhotoGrid urls={urls} />)
    expect(container.querySelector('.photo-grid--4')).not.toBeNull()
  })
})
