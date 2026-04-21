import type { MDXComponents } from 'mdx/types'
import Sticky from './components/Sticky'
import Annotation from './components/Annotation'
import CodeBlock from './components/CodeBlock'

const components: MDXComponents = {
  Sticky,
  Annotation,
  CodeBlock,
}

export function useMDXComponents(): MDXComponents {
  return components
}

