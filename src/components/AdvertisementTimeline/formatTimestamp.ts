const timestampFormatter = new Intl.DateTimeFormat('cs-CZ', {
  day: 'numeric',
  month: 'numeric',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  timeZone: 'Europe/Prague',
})

export function formatAdvertisementTimelineTimestamp(value: string): string {
  return timestampFormatter.format(new Date(value))
}
