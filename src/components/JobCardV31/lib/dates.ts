/** Dates come pre-formatted as `D. M.` or `D. M. YYYY`; the year is optional in the UI. */
function parseCzechDate(value: string, now: Date) {
  const match = value.trim().match(/^(\d{1,2})\.\s*(\d{1,2})\.(?:\s*(\d{4}))?\.?$/)

  if (!match) {
    return undefined
  }

  const [, day, month, year] = match

  return new Date(
    year ? Number(year) : now.getFullYear(),
    Number(month) - 1,
    Number(day),
  ).getTime()
}

function startOfDay(value: Date) {
  return new Date(value.getFullYear(), value.getMonth(), value.getDate()).getTime()
}

const MS_PER_DAY = 24 * 60 * 60 * 1000

/** Calendar days from `now` to `endDate`; negative when the date has passed. */
export function getRemainingCalendarDays(endDate: string, now = new Date()) {
  const time = parseCzechDate(endDate, now)

  if (time === undefined) {
    return undefined
  }

  return Math.round((startOfDay(new Date(time)) - startOfDay(now)) / MS_PER_DAY)
}

export function formatRemainingDaysLabel(days: number) {
  if (days === 0) {
    return 'dnes'
  }

  if (days === 1) {
    return '1 den'
  }

  if (days >= 2 && days <= 4) {
    return `${days} dny`
  }

  return `${days} dní`
}

export function stripYear(value: string) {
  return value.replace(/\s+\d{4}\.?$/, '')
}

function dateYear(value: string) {
  return value.trim().match(/(\d{4})\.?$/)?.[1]
}

/** Picks the label that carries a year (if any), otherwise the first one. */
export function richestDateLabel(dates: string[]) {
  return dates.find((date) => /\d{4}/.test(date)) ?? dates[0]
}

/** Same year once at the end; both years only when the range crosses a year. */
export function formatCompactDateRange(startDate: string, endDate: string) {
  const startYear = dateYear(startDate)
  const endYear = dateYear(endDate)
  const startDay = stripYear(startDate)
  const endDay = stripYear(endDate)
  const yearsDiffer = Boolean(startYear && endYear && startYear !== endYear)

  if (startDay === endDay && !yearsDiffer) {
    const year = endYear ?? startYear
    return year ? `${startDay} ${year}` : startDay
  }

  if (yearsDiffer) {
    return `${startDay} ${startYear} – ${endDay} ${endYear}`
  }

  const year = endYear ?? startYear
  const endLabel = year ? `${endDay} ${year}` : endDay
  return `${startDay} – ${endLabel}`
}

export function formatPublicationRange(startDate: string, endDate?: string) {
  if (!endDate) {
    return startDate
  }

  return formatCompactDateRange(startDate, endDate)
}
