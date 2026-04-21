import type { ReactNode } from 'react'

export default function Sticky({ children }: { children: ReactNode }) {
  return <div className="sticky-note">{children}</div>
}

