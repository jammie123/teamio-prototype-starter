import { describe, expect, it } from 'vitest'
import {
  formatExpiredPortalsLabel,
  formatRemainingDaysLabel,
  formatViewCountLabel,
  getAdvertisementSummary,
  getRemainingCalendarDays,
  isAdvertisementFullyExpired,
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
