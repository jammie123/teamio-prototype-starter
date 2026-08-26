import { describe, expect, it, vi } from 'vitest'
import {
  formatCompactDateRange,
  formatEndedHeading,
  formatEndingSoonHeading,
  formatEndingSoonLabel,
  formatEndingSoonWithDate,
  formatExpiredPortalsLabel,
  formatPublicationDateLabel,
  formatRemainingDaysLabel,
  formatRunningHeading,
  formatUntilDate,
  formatViewCountLabel,
  formatConversionRate,
  getAdvertisementSummary,
  getRemainingCalendarDays,
  groupPublicationsByDate,
  isAdvertisementFullyExpired,
  isEndingSoon,
  partitionPublications,
  shareSameEndDate,
  visibleHighlights,
} from './advertisementSummary'
import type { JobAdvertisement } from './types'

function advertisement(publications: JobAdvertisement['publications']): JobAdvertisement {
  return { id: 'ad-1', publications }
}

describe('getAdvertisementSummary', () => {
  it('lists active portal names and the earliest end date without the year', () => {
    const summary = getAdvertisementSummary(
      advertisement([
        { id: 'jobs', channel: 'Jobs.cz', startDate: '12. 7.', endDate: '15. 9. 2026' },
        { id: 'prace', channel: 'Prace.cz', startDate: '12. 7.', endDate: '30. 9. 2026' },
        { id: 'career', channel: 'Kariérní stránky', startDate: '12. 7.', endDate: '12. 8. 2026' },
      ]),
    )

    expect(summary.activePortalNames).toEqual(['Jobs.cz', 'Prace.cz', 'Kariérní stránky'])
    expect(summary.firstEndsOn).toBe('12. 8.')
  })

  it('ignores expired publications when collecting names and the first end date', () => {
    const summary = getAdvertisementSummary(
      advertisement([
        { id: 'jobs', channel: 'Jobs.cz', startDate: '12. 7.', endDate: '15. 9. 2026' },
        {
          id: 'prace',
          channel: 'Prace.cz',
          status: 'expired',
          startDate: '12. 7.',
          endDate: '1. 8. 2026',
        },
      ]),
    )

    expect(summary.activePortalNames).toEqual(['Jobs.cz'])
    expect(summary.firstEndsOn).toBe('15. 9.')
  })

  it('omits firstEndsOn when no active publication has an end date', () => {
    const summary = getAdvertisementSummary(
      advertisement([{ id: 'jobs', channel: 'Jobs.cz', startDate: '12. 7.', viewCount: 10 }]),
    )

    expect(summary.activePortalNames).toEqual(['Jobs.cz'])
    expect(summary.firstEndsOn).toBeUndefined()
  })

  it('returns no names or date when every publication is expired', () => {
    const summary = getAdvertisementSummary(
      advertisement([
        {
          id: 'jobs',
          channel: 'Jobs.cz',
          status: 'expired',
          startDate: '12. 6.',
          endDate: '12. 7.',
          viewCount: 842,
        },
      ]),
    )

    expect(summary.activePortalNames).toEqual([])
    expect(summary.firstEndsOn).toBeUndefined()
    expect(summary.expiredPortalCount).toBe(1)
    expect(summary.lastEndedOn).toBe('12. 7.')
    expect(summary.viewCount).toBe(842)
  })

  it('uses the latest expired end date and the expired portal count', () => {
    const summary = getAdvertisementSummary(
      advertisement([
        {
          id: 'jobs',
          channel: 'Jobs.cz',
          status: 'expired',
          startDate: '12. 6.',
          endDate: '12. 7. 2026',
        },
        {
          id: 'prace',
          channel: 'Prace.cz',
          status: 'expired',
          startDate: '12. 6.',
          endDate: '15. 8. 2026',
        },
        {
          id: 'career',
          channel: 'Kariérní stránky',
          status: 'expired',
          startDate: '1. 6.',
          endDate: '1. 7. 2026',
        },
      ]),
    )

    expect(summary.expiredPortalCount).toBe(3)
    expect(summary.lastEndedOn).toBe('15. 8.')
  })

  it('counts expired portals even while some publications remain active', () => {
    const summary = getAdvertisementSummary(
      advertisement([
        { id: 'jobs', channel: 'Jobs.cz', startDate: '12. 7.', endDate: '15. 9. 2026' },
        {
          id: 'prace',
          channel: 'Prace.cz',
          status: 'expired',
          startDate: '12. 7.',
          endDate: '1. 8. 2026',
        },
      ]),
    )

    expect(summary.expiredPortalCount).toBe(1)
    expect(summary.lastEndedOn).toBe('1. 8.')
    expect(summary.activePortalNames).toEqual(['Jobs.cz'])
  })

  it('sums view counts from every publication', () => {
    const summary = getAdvertisementSummary(
      advertisement([
        { id: 'jobs', channel: 'Jobs.cz', startDate: '12. 7.', viewCount: 842 },
        {
          id: 'prace',
          channel: 'Prace.cz',
          status: 'expired',
          startDate: '12. 7.',
          viewCount: 312,
        },
      ]),
    )

    expect(summary.viewCount).toBe(1154)
  })

  it('does not add highlight view counts into the advertisement aggregate', () => {
    const summary = getAdvertisementSummary(
      advertisement([
        {
          id: 'jobs',
          channel: 'Jobs.cz',
          startDate: '12. 7.',
          viewCount: 842,
          highlights: [{ id: 'jobstip', name: 'Jobstip', startDate: '8. 6.', viewCount: 699 }],
        },
      ]),
    )

    expect(summary.viewCount).toBe(842)
  })

  it('omits viewCount when no publication has a count', () => {
    const summary = getAdvertisementSummary(
      advertisement([{ id: 'jobs', channel: 'Jobs.cz', startDate: '12. 7.' }]),
    )

    expect(summary.viewCount).toBeUndefined()
  })
})

describe('formatExpiredPortalsLabel', () => {
  it('uses Czech plural forms', () => {
    expect(formatExpiredPortalsLabel(1)).toBe('1 portál ukončen')
    expect(formatExpiredPortalsLabel(2)).toBe('2 portály ukončeny')
    expect(formatExpiredPortalsLabel(3)).toBe('3 portály ukončeny')
    expect(formatExpiredPortalsLabel(5)).toBe('5 portálů ukončeno')
  })
})

describe('formatCompactDateRange', () => {
  it('keeps the year only once when both dates share it', () => {
    expect(formatCompactDateRange('12. 7. 2026', '30. 9. 2026')).toBe('12. 7. – 30. 9. 2026')
  })

  it('keeps both years when the range crosses a year', () => {
    expect(formatCompactDateRange('12. 12. 2025', '30. 3. 2026')).toBe(
      '12. 12. 2025 – 30. 3. 2026',
    )
  })

  it('collapses to one date when start and end are the same day', () => {
    expect(formatCompactDateRange('12. 7. 2026', '12. 7. 2026')).toBe('12. 7. 2026')
  })
})

describe('formatRunningHeading', () => {
  it('puts the from-to range on the heading when dates match', () => {
    expect(
      formatRunningHeading({ sameDate: true, startDate: '12. 7. 2026', endDate: '30. 9. 2026' }),
    ).toBe('Běží 12. 7. – 30. 9. 2026')
  })

  it('falls back to Běží do when only the end date is present', () => {
    expect(formatRunningHeading({ sameDate: true, endDate: '30. 9. 2026' })).toBe('Běží do 30. 9. 2026')
  })

  it('is only Běží when dates differ or the end date is missing', () => {
    expect(
      formatRunningHeading({ sameDate: false, startDate: '12. 7. 2026', endDate: '30. 9. 2026' }),
    ).toBe('Běží')
    expect(formatRunningHeading({ sameDate: true, startDate: '12. 7. 2026' })).toBe('Běží')
  })

  it('replaces Běží with Končí za and the end date when a shared insertion ends within a week', () => {
    expect(
      formatRunningHeading({
        sameDate: true,
        startDate: '12. 7. 2026',
        endDate: '30. 8. 2026',
        remainingDays: 6,
      }),
    ).toBe('Končí za 6 dní · 30. 8. 2026')
    expect(
      formatRunningHeading({
        sameDate: true,
        endDate: '27. 8. 2026',
        remainingDays: 3,
      }),
    ).toBe('Končí za 3 dny · 27. 8. 2026')
  })

  it('keeps only Běží when dates differ even if some portals end soon', () => {
    expect(
      formatRunningHeading({
        sameDate: false,
        startDate: '12. 7. 2026',
        endDate: '30. 8. 2026',
        remainingDays: 6,
      }),
    ).toBe('Běží')
  })

  it('does not switch copy when remaining days are over a week', () => {
    expect(
      formatRunningHeading({
        sameDate: true,
        startDate: '12. 7. 2026',
        endDate: '30. 9. 2026',
        remainingDays: 8,
      }),
    ).toBe('Běží 12. 7. – 30. 9. 2026')
  })
})

describe('formatEndingSoonHeading', () => {
  it('uses Končí za and the end date when every portal in the group shares that date', () => {
    expect(
      formatEndingSoonHeading({
        sameDate: true,
        endDate: '31. 8. 2026',
        remainingDays: 5,
      }),
    ).toBe('Končí za 5 dní · 31. 8. 2026')
  })

  it('is only Končí when dates in the group differ', () => {
    expect(
      formatEndingSoonHeading({
        sameDate: false,
        endDate: '31. 8. 2026',
        remainingDays: 5,
      }),
    ).toBe('Končí')
  })
})

describe('formatEndedHeading', () => {
  it('puts the date on the heading when dates match, without do', () => {
    expect(formatEndedHeading({ sameDate: true, date: '1. 9.' })).toBe('Ukončeno 1. 9.')
  })

  it('is only Ukončeno when dates differ or the date is missing', () => {
    expect(formatEndedHeading({ sameDate: false, date: '1. 9.' })).toBe('Ukončeno')
    expect(formatEndedHeading({ sameDate: true })).toBe('Ukončeno')
  })
})

describe('formatViewCountLabel', () => {
  it('uses Czech plural forms', () => {
    expect(formatViewCountLabel(1)).toBe('1 zhlédnutí')
    expect(formatViewCountLabel(2)).toBe('2 zhlédnutí')
    expect(formatViewCountLabel(4)).toBe('4 zhlédnutí')
    expect(formatViewCountLabel(5)).toBe('5 zhlédnutí')
    expect(formatViewCountLabel(1284)).toMatch(/^1\s284 zhlédnutí$/)
  })
})

describe('formatRemainingDaysLabel', () => {
  it('uses Czech plural forms including today', () => {
    expect(formatRemainingDaysLabel(0)).toBe('dnes')
    expect(formatRemainingDaysLabel(1)).toBe('1 den')
    expect(formatRemainingDaysLabel(2)).toBe('2 dny')
    expect(formatRemainingDaysLabel(4)).toBe('4 dny')
    expect(formatRemainingDaysLabel(5)).toBe('5 dní')
    expect(formatRemainingDaysLabel(6)).toBe('6 dní')
  })
})

describe('formatEndingSoonLabel', () => {
  it('uses Končí za with Czech day counts, and Končí dnes for today', () => {
    expect(formatEndingSoonLabel(0)).toBe('Končí dnes')
    expect(formatEndingSoonLabel(1)).toBe('Končí za 1 den')
    expect(formatEndingSoonLabel(3)).toBe('Končí za 3 dny')
    expect(formatEndingSoonLabel(6)).toBe('Končí za 6 dní')
    expect(formatEndingSoonLabel(7)).toBe('Končí za 7 dní')
  })
})

describe('formatEndingSoonWithDate', () => {
  it('joins the remaining-days copy with the end date', () => {
    expect(formatEndingSoonWithDate(6, '30. 8. 2026')).toBe('Končí za 6 dní · 30. 8. 2026')
    expect(formatEndingSoonWithDate(3, '27. 8.')).toBe('Končí za 3 dny · 27. 8.')
  })
})

describe('isEndingSoon', () => {
  const now = new Date(2026, 7, 24)

  it('is true from today through seven remaining days', () => {
    expect(isEndingSoon('24. 8. 2026', now)).toBe(true)
    expect(isEndingSoon('27. 8. 2026', now)).toBe(true)
    expect(isEndingSoon('31. 8. 2026', now)).toBe(true)
  })

  it('is false when the insertion is more than a week away, already past, or unparseable', () => {
    expect(isEndingSoon('1. 9. 2026', now)).toBe(false)
    expect(isEndingSoon('20. 8. 2026', now)).toBe(false)
    expect(isEndingSoon('soon', now)).toBe(false)
    expect(isEndingSoon(undefined, now)).toBe(false)
  })
})

describe('formatPublicationDateLabel', () => {
  it('keeps the from-to range when the portal is not ending soon', () => {
    expect(
      formatPublicationDateLabel({
        startDate: '12. 7. 2026',
        endDate: '30. 9. 2026',
      }),
    ).toBe('12. 7. – 30. 9. 2026')
  })

  it('shows Končí za and the end date when that portal ends within a week', () => {
    expect(
      formatPublicationDateLabel({
        startDate: '12. 7. 2026',
        endDate: '30. 8. 2026',
        remainingDays: 6,
      }),
    ).toBe('Končí za 6 dní · 30. 8. 2026')
  })
})

describe('getRemainingCalendarDays', () => {
  const now = new Date(2026, 7, 19)

  it('counts whole days from today to the end date', () => {
    expect(getRemainingCalendarDays('19. 8. 2026', now)).toBe(0)
    expect(getRemainingCalendarDays('20. 8. 2026', now)).toBe(1)
    expect(getRemainingCalendarDays('25. 8. 2026', now)).toBe(6)
    expect(getRemainingCalendarDays('26. 8. 2026', now)).toBe(7)
  })

  it('uses the given now year when the end date omits it', () => {
    expect(getRemainingCalendarDays('22. 8.', now)).toBe(3)
  })

  it('returns undefined for unparseable dates', () => {
    expect(getRemainingCalendarDays('soon', now)).toBeUndefined()
  })
})

describe('isAdvertisementFullyExpired', () => {
  it('is true only when every publication is expired', () => {
    expect(
      isAdvertisementFullyExpired(
        advertisement([
          { id: 'jobs', channel: 'Jobs.cz', status: 'expired', startDate: '12. 6.', endDate: '12. 7.' },
        ]),
      ),
    ).toBe(true)
    expect(
      isAdvertisementFullyExpired(
        advertisement([
          { id: 'jobs', channel: 'Jobs.cz', startDate: '12. 7.' },
          { id: 'prace', channel: 'Prace.cz', status: 'expired', startDate: '12. 7.' },
        ]),
      ),
    ).toBe(false)
    expect(isAdvertisementFullyExpired(advertisement([]))).toBe(false)
  })
})

describe('formatUntilDate', () => {
  it('keeps the full date and prefixes do, or ukončeno do when all expired share a date', () => {
    expect(formatUntilDate('15. 9. 2026')).toBe('do 15. 9. 2026')
    expect(formatUntilDate('12. 8.')).toBe('do 12. 8.')
    expect(formatUntilDate('15. 9. 2026', { expiredSameDate: true })).toBe('ukončeno do 15. 9. 2026')
  })
})

describe('shareSameEndDate', () => {
  it('is true when every publication ends on the same calendar day', () => {
    expect(
      shareSameEndDate([
        { id: 'jobs', channel: 'Jobs.cz', startDate: '12. 7.', endDate: '15. 9. 2026' },
        { id: 'prace', channel: 'Prace.cz', startDate: '12. 7.', endDate: '15. 9.' },
      ]),
    ).toBe(true)
  })

  it('is false when dates differ or any end date is missing', () => {
    expect(
      shareSameEndDate([
        { id: 'jobs', channel: 'Jobs.cz', startDate: '12. 7.', endDate: '15. 9. 2026' },
        { id: 'prace', channel: 'Prace.cz', startDate: '12. 7.', endDate: '30. 9. 2026' },
      ]),
    ).toBe(false)
    expect(
      shareSameEndDate([{ id: 'jobs', channel: 'Jobs.cz', startDate: '12. 7.' }]),
    ).toBe(false)
    expect(shareSameEndDate([])).toBe(false)
  })
})

describe('groupPublicationsByDate', () => {
  it('keeps first-seen order and groups portals that share a start and end day', () => {
    expect(
      groupPublicationsByDate([
        { id: 'jobs', channel: 'Jobs.cz', startDate: '12. 7. 2026', endDate: '30. 9. 2026' },
        { id: 'prace', channel: 'Prace.cz', startDate: '12. 7.', endDate: '30. 9.' },
        { id: 'career', channel: 'Kariérní stránky', startDate: '12. 7. 2026', endDate: '30. 9. 2026' },
        { id: 'atmoskop', channel: 'Atmoskop', startDate: '12. 7. 2026', endDate: '12. 8. 2026' },
      ]).map((group) => group.map((publication) => publication.id)),
    ).toEqual([['jobs', 'prace', 'career'], ['atmoskop']])
  })

  it('does not group portals that only share an end date', () => {
    expect(
      groupPublicationsByDate([
        { id: 'jobs', channel: 'Jobs.cz', startDate: '1. 7. 2026', endDate: '30. 9. 2026' },
        { id: 'prace', channel: 'Prace.cz', startDate: '12. 7. 2026', endDate: '30. 9. 2026' },
      ]).map((group) => group.map((publication) => publication.id)),
    ).toEqual([['jobs'], ['prace']])
  })

  it('leaves every portal on its own row when dates all differ', () => {
    expect(
      groupPublicationsByDate([
        { id: 'jobs', channel: 'Jobs.cz', startDate: '12. 7.', endDate: '15. 9. 2026' },
        { id: 'prace', channel: 'Prace.cz', startDate: '12. 7.', endDate: '30. 9. 2026' },
        { id: 'career', channel: 'Kariérní stránky', startDate: '12. 7.', endDate: '12. 8. 2026' },
      ]).map((group) => group.map((publication) => publication.id)),
    ).toEqual([['jobs'], ['prace'], ['career']])
  })
})

describe('partitionPublications', () => {
  it('splits active and expired publications', () => {
    expect(
      partitionPublications([
        { id: 'jobs', channel: 'Jobs.cz', startDate: '12. 7.', endDate: '15. 9. 2026' },
        {
          id: 'prace',
          channel: 'Prace.cz',
          status: 'expired',
          startDate: '12. 7.',
          endDate: '12. 8.',
        },
      ]),
    ).toEqual({
      active: [{ id: 'jobs', channel: 'Jobs.cz', startDate: '12. 7.', endDate: '15. 9. 2026' }],
      running: [{ id: 'jobs', channel: 'Jobs.cz', startDate: '12. 7.', endDate: '15. 9. 2026' }],
      endingSoon: [],
      expired: [
        {
          id: 'prace',
          channel: 'Prace.cz',
          status: 'expired',
          startDate: '12. 7.',
          endDate: '12. 8.',
        },
      ],
    })
  })

  it('splits ending-soon publications out of the running group', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 7, 26))

    try {
      const jobs = { id: 'jobs', channel: 'Jobs.cz', startDate: '20. 8. 2026', endDate: '31. 8. 2026' }
      const prace = { id: 'prace', channel: 'Prace.cz', startDate: '20. 8. 2026', endDate: '31. 10. 2026' }
      const career = {
        id: 'career',
        channel: 'Kariérní stránky',
        status: 'expired' as const,
        startDate: '2. 6. 2026',
        endDate: '10. 8. 2026',
      }

      expect(partitionPublications([jobs, prace, career])).toEqual({
        active: [jobs, prace],
        running: [prace],
        endingSoon: [jobs],
        expired: [career],
      })
    } finally {
      vi.useRealTimers()
    }
  })
})

describe('formatConversionRate', () => {
  it('is reactions divided by views as a Czech percent', () => {
    expect(formatConversionRate(42, 1840)).toBe('2,3 %')
    expect(formatConversionRate(0, 1840)).toBe('0 %')
  })

  it('is undefined when views are missing or zero', () => {
    expect(formatConversionRate(42, 0)).toBeUndefined()
    expect(formatConversionRate(42)).toBeUndefined()
    expect(formatConversionRate(undefined, 1840)).toBeUndefined()
  })
})

describe('visibleHighlights', () => {
  const jobstip = {
    id: 'jobstip',
    name: 'Jobstip',
    startDate: '8. 6.',
    endDate: '30. 9. 2026',
    viewCount: 699,
  }
  const expiredTop = {
    id: 'top',
    name: 'Topováno',
    status: 'expired' as const,
    startDate: '22. 6.',
    endDate: '6. 7. 2026',
    viewCount: 331,
  }

  it('returns running highlights on a running portal', () => {
    expect(
      visibleHighlights({
        id: 'jobs',
        channel: 'Jobs.cz',
        startDate: '1. 6.',
        highlights: [jobstip, expiredTop],
      }),
    ).toEqual([jobstip])
  })

  it('hides every highlight when the portal has ended', () => {
    expect(
      visibleHighlights({
        id: 'jobs',
        channel: 'Jobs.cz',
        status: 'expired',
        startDate: '1. 6.',
        highlights: [jobstip],
      }),
    ).toEqual([])
  })

  it('returns an empty list when the portal has no highlights', () => {
    expect(
      visibleHighlights({ id: 'jobs', channel: 'Jobs.cz', startDate: '1. 6.' }),
    ).toEqual([])
  })
})
