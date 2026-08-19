import { describe, expect, it } from 'vitest'
import { getAdvertisementSummary } from './advertisementSummary'
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
    expect(summary.viewCount).toBe(842)
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
