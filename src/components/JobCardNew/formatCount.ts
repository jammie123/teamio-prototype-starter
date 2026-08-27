const countFormat = new Intl.NumberFormat('cs-CZ')

export function formatCount(value: number) {
  return countFormat.format(value)
}
