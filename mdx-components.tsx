import type { MDXComponents } from 'mdx/types'
import Sticky from './components/Sticky'
import Annotation from './components/Annotation'
import CodeBlock from './components/CodeBlock'
import PhotoGrid from './components/PhotoGrid'
import AudioPlayer from './components/AudioPlayer'

const components: MDXComponents = {
  PhotoGrid,
  AudioPlayer,
  Sticky,
  Annotation,
  CodeBlock,
  img: ({ src, alt }) => {
    if (typeof src !== 'string') return null
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt={alt ?? ''} className="entry-img-legacy" />
    )
  },
  audio: ({ src }) => {
    if (typeof src !== 'string') return null
    return <AudioPlayer src={src} />
  },
}

export function useMDXComponents(): MDXComponents {
  return components
}
