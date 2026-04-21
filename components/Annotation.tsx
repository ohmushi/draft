import type { ReactNode } from 'react'

export default function Annotation({ children }: { children: ReactNode }) {
  return <p className="annotation">{children}</p>
}

