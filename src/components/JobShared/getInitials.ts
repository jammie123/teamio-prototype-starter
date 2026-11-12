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
