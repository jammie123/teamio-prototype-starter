import { describe, expect, it, vi } from 'vitest'
import {
  expiredPeriodBadge,
  formatRemainingBadgeLabel,
  advertisementSwitcherTitle,
  DRAFT_ADVERTISEMENT_BADGE,
  DRAFT_ADVERTISEMENT_HEADING,
  isDraftAdvertisement,
  MIXED_PERIOD_HEADING,
  publicationPeriodBadge,
  groupPublicationsByEndDate,
  sortPublicationsBySoonestEnd,
  splitIntoBalancedColumns,
} from './advertisementSummaryAds'

describe('advertisementSummaryAds', () => {
  it('uses Czech remaining-days copy on warning badges', () => {
    expect(formatRemainingBadgeLabel(0)).toBe('zbývá dnes')
    expect(formatRemainingBadgeLabel(1)).toBe('zbývá 1 den')
    expect(formatRemainingBadgeLabel(2)).toBe('zbývá 2 dny')
    expect(formatRemainingBadgeLabel(6)).toBe('zbývá 6 dní')
  })

  it('returns a warning badge when the portal ends within a week', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 7, 24))

    try {
      expect(
        publicationPeriodBadge({
          id: 'jobs',
          channel: 'Jobs.cz',
          startDate: '12. 7. 2026',
          endDate: '30. 8. 2026',
        }),
      ).toEqual({ color: 'warning', label: 'zbývá 6 dní' })
    } finally {
      vi.useRealTimers()
    }
  })

  it('returns an informative badge with the end date when the portal still runs later', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 7, 24))

    try {
      expect(
        publicationPeriodBadge({
          id: 'prace',
          channel: 'Prace.cz',
          startDate: '12. 7. 2026',
          endDate: '30. 9. 2026',
        }),
      ).toEqual({ color: 'informative', label: '30. 9. 2026' })
    } finally {
      vi.useRealTimers()
    }
  })

  it('uses an informative end-date badge for expired portals', () => {
    expect(
      expiredPeriodBadge({
        id: 'jobs',
        channel: 'Jobs.cz',
        status: 'expired',
        startDate: '12. 6. 2026',
        endDate: '1. 9. 2026',
      }),
    ).toEqual({ color: 'informative', label: '1. 9. 2026' })
  })

  it('exposes the mixed-period heading copy', () => {
    expect(MIXED_PERIOD_HEADING).toBe('Běží v různá období')
  })

  it('exposes the draft status badge copy', () => {
    expect(DRAFT_ADVERTISEMENT_BADGE).toBe('Rozpracovaný')
  })
})

describe('isDraftAdvertisement', () => {
  it('is true only when status is draft, not when publications are missing', () => {
    expect(isDraftAdvertisement({ id: 'ad-draft', status: 'draft' })).toBe(true)
    expect(isDraftAdvertisement({ id: 'ad-draft', status: 'draft', publications: [] })).toBe(true)
    expect(isDraftAdvertisement({ id: 'ad-empty', publications: [] })).toBe(false)
    expect(
      isDraftAdvertisement({
        id: 'ad-running',
        publications: [{ id: 'jobs', channel: 'Jobs.cz', startDate: '12. 7. 2026' }],
      }),
    ).toBe(false)
  })
})

describe('advertisementSwitcherTitle', () => {
  it('prefers the advertisement title, then draft fallback, then a numbered label', () => {
    expect(advertisementSwitcherTitle({ id: 'ad-1', title: 'Hlavní inzerát' }, 0)).toBe(
      'Hlavní inzerát',
    )
    expect(advertisementSwitcherTitle({ id: 'ad-draft', status: 'draft' }, 1)).toBe(
      DRAFT_ADVERTISEMENT_HEADING,
    )
    expect(advertisementSwitcherTitle({ id: 'ad-2' }, 1)).toBe('Inzerát 2')
  })
})

describe('sortPublicationsBySoonestEnd', () => {
  it('puts the soonest end date first and keeps equal dates stable', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 7, 24))

    try {
      const jobs = { id: 'jobs', channel: 'Jobs.cz', startDate: '12. 7. 2026', endDate: '30. 9. 2026' }
      const career = {
        id: 'career',
        channel: 'Kariérní stránky',
        startDate: '12. 7. 2026',
        endDate: '20. 9. 2026',
      }
      const prace = { id: 'prace', channel: 'Prace.cz', startDate: '12. 7. 2026', endDate: '30. 9. 2026' }

      expect(sortPublicationsBySoonestEnd([jobs, career, prace]).map((publication) => publication.id)).toEqual([
        'career',
        'jobs',
        'prace',
      ])
    } finally {
      vi.useRealTimers()
    }
  })

  it('keeps still-running soonest dates before already-ended ones', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 8, 25))

    try {
      const jobs = { id: 'jobs', channel: 'Jobs.cz', startDate: '12. 7. 2026', endDate: '30. 9. 2026' }
      const careerEnded = {
        id: 'career',
        channel: 'Kariérní stránky',
        startDate: '12. 7. 2026',
        endDate: '20. 9. 2026',
      }
      const atmoskopLater = {
        id: 'atmoskop',
        channel: 'Atmoskop',
        startDate: '12. 7. 2026',
        endDate: '12. 10. 2026',
      }
      const atmoskopPast = {
        id: 'atmoskop-past',
        channel: 'Atmoskop',
        startDate: '12. 7. 2026',
        endDate: '12. 8. 2026',
      }

      expect(
        sortPublicationsBySoonestEnd([careerEnded, atmoskopLater, jobs]).map(
          (publication) => publication.id,
        ),
      ).toEqual(['jobs', 'atmoskop', 'career'])
      expect(
        sortPublicationsBySoonestEnd([jobs, careerEnded, atmoskopPast]).map(
          (publication) => publication.id,
        ),
      ).toEqual(['jobs', 'atmoskop-past', 'career'])
    } finally {
      vi.useRealTimers()
    }
  })
})

describe('groupPublicationsByEndDate', () => {
  it('merges publications that share an end date while preserving soonest-first order', () => {
    const career = {
      id: 'career',
      channel: 'Kariérní stránky',
      startDate: '12. 7. 2026',
      endDate: '20. 9. 2026',
    }
    const jobs = { id: 'jobs', channel: 'Jobs.cz', startDate: '12. 7. 2026', endDate: '30. 9. 2026' }
    const prace = { id: 'prace', channel: 'Prace.cz', startDate: '12. 7. 2026', endDate: '30. 9. 2026' }

    expect(groupPublicationsByEndDate([jobs, career, prace]).map((group) => group.map((p) => p.id))).toEqual([
      ['career'],
      ['jobs', 'prace'],
    ])
  })
})

describe('splitIntoBalancedColumns', () => {
  it('keeps one or two portals in a single column', () => {
    expect(splitIntoBalancedColumns([])).toEqual([[]])
    expect(splitIntoBalancedColumns(['a'])).toEqual([['a']])
    expect(splitIntoBalancedColumns(['a', 'b'])).toEqual([['a', 'b']])
  })

  it('splits three or more portals into two balanced columns, longer one first', () => {
    expect(splitIntoBalancedColumns(['a', 'b', 'c'])).toEqual([['a', 'b'], ['c']])
    expect(splitIntoBalancedColumns(['a', 'b', 'c', 'd'])).toEqual([
      ['a', 'b'],
      ['c', 'd'],
    ])
    expect(splitIntoBalancedColumns(['a', 'b', 'c', 'd', 'e'])).toEqual([
      ['a', 'b', 'c'],
      ['d', 'e'],
    ])
  })
})
