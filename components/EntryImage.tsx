type EntryImageProps = {
  readonly src?: string
  readonly alt?: string
}

export default function EntryImage({ src, alt }: EntryImageProps) {
  if (typeof src !== 'string') return null
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt ?? ''} className="entry-img" />
}
