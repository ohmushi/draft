type PhotoGridProps = {
  readonly urls?: readonly string[] | string
  readonly limit?: number
  readonly alt?: string
}

export default function PhotoGrid({ urls: urlsProp, limit, alt = '' }: PhotoGridProps) {
  const urls: readonly string[] =
    typeof urlsProp === 'string'
      ? (JSON.parse(urlsProp) as string[])
      : (urlsProp ?? [])

  const visibleUrls = limit !== undefined ? urls.slice(0, limit) : urls
  const hiddenCount = urls.length - visibleUrls.length

  if (visibleUrls.length === 0) return null

  const count = Math.min(visibleUrls.length, 4)
  const gridClass = `photo-grid photo-grid--${count}`

  return (
    <div className={gridClass}>
      {visibleUrls.map((url) => (
        <div key={url} className="photo-grid__item">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={url} alt={alt} className="photo-grid__img" />
        </div>
      ))}
      {hiddenCount > 0 && (
        <div className="photo-grid__badge">+{hiddenCount}</div>
      )}
    </div>
  )
}
