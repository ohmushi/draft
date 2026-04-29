function pad2(n: number): string {
  return n.toString().padStart(2, '0')
}

export function formatDate(date: Date): string {
  const year = date.getFullYear()
  const month = pad2(date.getMonth() + 1)
  const day = pad2(date.getDate())
  return `${year}-${month}-${day}`
}

export function formatTime(date: Date): string {
  return `${pad2(date.getHours())}:${pad2(date.getMinutes())}`
}

export function generateSlug(date: string, timestamp: number): string {
  return `${date}-${timestamp}`
}
