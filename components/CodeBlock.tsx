import type { ReactNode } from 'react'

export default function CodeBlock({
  children,
  lang,
}: {
  children: ReactNode
  lang?: string
}) {
  return (
    <pre className="entry-code" data-lang={lang}>
      <code>{children}</code>
    </pre>
  )
}

