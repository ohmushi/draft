import type { MDXComponents } from 'mdx/types'
import Sticky from './components/Sticky'
import Annotation from './components/Annotation'
import CodeBlock from './components/CodeBlock'
import PhotoGrid from './components/PhotoGrid'
import AudioPlayer from './components/AudioPlayer'
import EntryImage from './components/EntryImage'

const components: MDXComponents = {
  PhotoGrid,
  AudioPlayer,
  Sticky,
  Annotation,
  CodeBlock,
  img: EntryImage,
  audio: ({ src }) => {
    if (typeof src !== 'string') return null
    return <AudioPlayer src={src} />
  },
}

export function useMDXComponents(): MDXComponents {
  return components
}
