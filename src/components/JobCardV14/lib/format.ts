const countFormat = new Intl.NumberFormat('cs-CZ')

export function formatCount(value: number) {
  return countFormat.format(value)
}

export function formatViewCountLabel(count: number) {
  return `${formatCount(count)} zhlédnutí`
}

const conversionPercentFormat = new Intl.NumberFormat('cs-CZ', {
  maximumFractionDigits: 1,
  minimumFractionDigits: 0,
})

/** Conversion = reactions / views, shown as a Czech percent. */
export function formatConversionRate(reactionCount?: number, viewCount?: number) {
  if (reactionCount === undefined || viewCount === undefined || viewCount <= 0) {
    return undefined
  }

  return `${conversionPercentFormat.format((reactionCount / viewCount) * 100)} %`
}

/** First + last word initials, Czech-aware uppercase. */
export function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean)

  if (parts.length === 0) {
    return '?'
  }

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toLocaleUpperCase('cs')
  }

  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toLocaleUpperCase('cs')
}
