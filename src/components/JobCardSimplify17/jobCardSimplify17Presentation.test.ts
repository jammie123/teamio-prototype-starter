import { describe, expect, it } from 'vitest'
import type { JobAdvertisement } from '../JobCardSynteza/types'
import {
  buildSimplify17EndingSoonAggregateHeading,
  buildSimplify17NotAdvertisingPerex,
  buildSimplify17StatusHeading,
  formatSimplify17PortalCareerSummary,
  joinStatusDetail,
  notAdvertisingHasPublicationHistory,
  SIMPLIFY_17_NEVER_CREATED_BODY,
  SIMPLIFY_17_NOT_ADVERTISING_TITLE,
  SIMPLIFY_17_START_ADVERTISING_LABEL,
} from './jobCardSimplify17Presentation'

describe('jobCardSimplify17Presentation', () => {
  it('joins status detail with a middle dot', () => {
    expect(joinStatusDetail('Běží', '2 ze 3 kanálů')).toBe('Běží · 2 ze 3 kanálů')
  })

  it('formats portal and career page summary', () => {
    expect(
      formatSimplify17PortalCareerSummary([
        { id: 'jobs', channel: 'Jobs.cz' },
        { id: 'prace', channel: 'Prace.cz' },
        { id: 'career', channel: 'Kariérní stránky' },
      ]),
    ).toBe('2 portály + kariérní stránky')
  })

  it('builds partial running heading with channel counts', () => {
    const advertisement: JobAdvertisement = {
      id: 'ad-partial',
      publications: [
        { id: 'jobs', channel: 'Jobs.cz', startDate: '12. 7. 2026', endDate: '14. 11. 2026' },
        {
          id: 'prace',
          channel: 'Prace.cz',
          status: 'expired',
          startDate: '12. 6. 2026',
          endDate: '20. 10. 2026',
        },
        { id: 'career', channel: 'Kariérní web', startDate: '12. 7. 2026' },
      ],
    }

    const heading = buildSimplify17StatusHeading(advertisement)

    expect(heading?.label).toBe('Běží · 2 ze 3 kanálů')
    expect(heading?.className).toContain('secondary')
  })

  it('uses Končí za when every ending-soon channel shares the same end date', () => {
    const now = new Date(2026, 9, 23)
    const endDate = '28. 10. 2026'
    const advertisement: JobAdvertisement = {
      id: 'ad-ending-soon',
      publications: [
        { id: 'jobs', channel: 'Jobs.cz', startDate: '12. 7. 2026', endDate, viewCount: 1200 },
        { id: 'prace', channel: 'Prace.cz', startDate: '12. 7. 2026', endDate, viewCount: 640 },
      ],
    }

    expect(buildSimplify17EndingSoonAggregateHeading(advertisement.publications!, now)).toBe(
      'Končí za 5 dní · 28. 10.',
    )
    expect(buildSimplify17StatusHeading(advertisement, now)?.label).toBe('Končí za 5 dní · 28. 10.')
  })

  it('uses Končí brzy when active channels end on different dates', () => {
    const now = new Date(2026, 9, 23)
    const advertisement: JobAdvertisement = {
      id: 'ad-ending-soon-mixed',
      publications: [
        { id: 'jobs', channel: 'Jobs.cz', startDate: '12. 7. 2026', endDate: '28. 10. 2026', viewCount: 1200 },
        { id: 'prace', channel: 'Prace.cz', startDate: '12. 7. 2026', endDate: '10. 11. 2026', viewCount: 640 },
      ],
    }

    expect(buildSimplify17EndingSoonAggregateHeading(advertisement.publications!, now)).toBe(
      'Končí brzy',
    )
    expect(buildSimplify17StatusHeading(advertisement, now)?.label).toBe('Končí brzy')
  })

  it('builds running heading with a shared date range', () => {
    const advertisement: JobAdvertisement = {
      id: 'ad-running',
      publications: [
        { id: 'jobs', channel: 'Jobs.cz', startDate: '1. 10. 2026', endDate: '14. 11. 2026' },
        { id: 'prace', channel: 'Prace.cz', startDate: '1. 10. 2026', endDate: '14. 11. 2026' },
      ],
    }

    const heading = buildSimplify17StatusHeading(advertisement)

    expect(heading?.label).toBe('Běží · 1. 10. – 14. 11.')
  })

  it('builds declined not-advertising perex below the title', () => {
    const advertisement: JobAdvertisement = {
      id: 'ad-na',
      status: 'notAdvertising',
      advertisingDeclinedAt: '20. 10. 2026',
      publications: [
        {
          id: 'jobs',
          channel: 'Jobs.cz',
          status: 'expired',
          endDate: '20. 10. 2026',
          viewCount: 2100,
        },
        { id: 'prace', channel: 'Prace.cz', status: 'expired', endDate: '20. 10. 2026', viewCount: 1070 },
        { id: 'career', channel: 'Kariérní stránky', startDate: '12. 7. 2026', viewCount: 0 },
      ],
    }

    expect(notAdvertisingHasPublicationHistory(advertisement)).toBe(true)
    expect(SIMPLIFY_17_NOT_ADVERTISING_TITLE).toBe('Neinzeruje se')
    expect(buildSimplify17NotAdvertisingPerex(advertisement)).toMatch(
      /ukončeno od 20\. 10\. · 3[\s\u00a0]?170 zhlédnutí · 2 portály \+ kariérní stránky/,
    )
  })

  it('returns no perex for never-created not-advertising', () => {
    const advertisement: JobAdvertisement = {
      id: 'ad-empty',
      status: 'notAdvertising',
      publications: [],
    }

    expect(notAdvertisingHasPublicationHistory(advertisement)).toBe(false)
    expect(buildSimplify17NotAdvertisingPerex(advertisement)).toBeUndefined()
    expect(SIMPLIFY_17_NEVER_CREATED_BODY).toContain('Zveřejněte ji')
    expect(SIMPLIFY_17_START_ADVERTISING_LABEL).toBe('Začít inzerovat')
  })
})
