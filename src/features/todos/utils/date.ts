export function startOfDay(value: Date): Date {
  const result = new Date(value)
  result.setHours(0, 0, 0, 0)
  return result
}

export function addDays(value: Date, amount: number): Date {
  const result = new Date(value)
  result.setDate(result.getDate() + amount)
  return result
}

export function isSameDay(left: Date | null, right: Date | null): boolean {
  if (!left || !right) return false
  return startOfDay(left).getTime() === startOfDay(right).getTime()
}

export function isWithinDays(
  value: Date | null,
  start: Date,
  dayCount: number,
): boolean {
  if (!value) return false

  const time = startOfDay(value).getTime()
  const from = startOfDay(start).getTime()
  const until = addDays(startOfDay(start), dayCount).getTime()

  return time >= from && time < until
}

export function isPast(value: Date | null): boolean {
  return value
    ? startOfDay(value).getTime() < startOfDay(new Date()).getTime()
    : false
}

export function toDateInput(value: Date | null): string {
  if (!value) return ''

  const year = value.getFullYear()
  const month = String(value.getMonth() + 1).padStart(2, '0')
  const day = String(value.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

export function fromDateInput(value: string): Date | null {
  if (!value) return null

  const [year, month, day] = value.split('-').map(Number)

  if (!year || !month || !day) return null

  const result = new Date(year, month - 1, day)

  return Number.isNaN(result.getTime()) ? null : result
}

export function formatLongDate(value: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).format(value)
}

export function formatShortDate(value: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  }).format(value)
}

export function formatDay(value: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
  }).format(value)
}

export function formatDueLabel(value: Date | null): string {
  if (!value) return 'No date'

  const today = new Date()

  if (isSameDay(value, today)) return 'Today'
  if (isSameDay(value, addDays(today, 1))) return 'Tomorrow'

  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  }).format(value)
}
