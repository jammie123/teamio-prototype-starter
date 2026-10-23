import { describe, expect, it } from 'vitest'
import type { JobAdvertisement } from '../JobCardSynteza/types'
import {
  buildSimplify19EndingSoonSecondary,
  buildSimplify19NotAdvertisingPerex,
  buildSimplify19StatusHeading,
  formatSimplify19PortalCareerSummary,
  formatSimplify19RemainingSecondary,
  getSimplify19HeadingActions,
  notAdvertisingHasPublicationHistory,
  SIMPLIFY_19_DECLINE_LABEL,
  SIMPLIFY_19_ENDED_TITLE,
  SIMPLIFY_19_ENDING_SOON_TITLE,
  SIMPLIFY_19_EXTEND_LABEL,
  SIMPLIFY_19_NEVER_CREATED_BODY,
  SIMPLIFY_19_NOT_ADVERTISING_TITLE,
  SIMPLIFY_19_START_ADVERTISING_LABEL,
} from './jobCardSimplify19Presentation'

describe('jobCardSimplify19Presentation', () => {
  it('formats remaining secondary with full end date', () => {
    expect(formatSimplify19RemainingSecondary(5, '5. 10. 2026')).toBe(
      'Zbývá 5 dní, do 5. 10. 2026',
    )
  })

  it('formats portal and career page summary', () => {
    expect(
      formatSimplify19PortalCareerSummary([
        { id: 'jobs', channel: 'Jobs.cz' },
        { id: 'prace', channel: 'Prace.cz' },
        { id: 'career', channel: 'Kariérní stránky' },
      ]),
    ).toBe('2 portály + kariérní stránky')
  })

  it('builds partial heading with expired portal count', () => {
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

    const heading = buildSimplify19StatusHeading(advertisement)

    expect(heading?.title).toBe('Běží')
    expect(heading?.secondary).toBe('1 portál ukončen')
    expect(heading?.actions?.[0]?.label).toBe(SIMPLIFY_19_EXTEND_LABEL)
  })

  it('uses Brzy končí with shared end date secondary', () => {
    const now = new Date(2026, 9, 23)
    const endDate = '28. 10. 2026'
    const advertisement: JobAdvertisement = {
      id: 'ad-ending-soon',
      publications: [
        { id: 'jobs', channel: 'Jobs.cz', startDate: '12. 7. 2026', endDate, viewCount: 1200 },
        { id: 'prace', channel: 'Prace.cz', startDate: '12. 7. 2026', endDate, viewCount: 640 },
      ],
    }

    expect(buildSimplify19EndingSoonSecondary(advertisement.publications!, now)).toBe(
      'Zbývá 5 dní, do 28. 10. 2026',
    )

    const heading = buildSimplify19StatusHeading(advertisement, now)
    expect(heading?.title).toBe(SIMPLIFY_19_ENDING_SOON_TITLE)
    expect(heading?.secondary).toBe('Zbývá 5 dní, do 28. 10. 2026')
    expect(heading?.actions?.[0]?.label).toBe(SIMPLIFY_19_EXTEND_LABEL)
  })

  it('uses single portal ending soon secondary when only one paid portal ends soon', () => {
    const now = new Date(2026, 9, 23)
    const advertisement: JobAdvertisement = {
      id: 'ad-ending-soon-one',
      publications: [
        { id: 'jobs', channel: 'Jobs.cz', startDate: '12. 7. 2026', endDate: '28. 10. 2026' },
        { id: 'prace', channel: 'Prace.cz', startDate: '12. 7. 2026', endDate: '10. 11. 2026' },
        { id: 'career', channel: 'Kariérní web', startDate: '12. 7. 2026' },
      ],
    }

    const heading = buildSimplify19StatusHeading(advertisement, now)
    expect(heading?.title).toBe(SIMPLIFY_19_ENDING_SOON_TITLE)
    expect(heading?.secondary).toBe('1 portál končí za 5 dní')
  })

  it('builds running heading with date range in secondary', () => {
    const advertisement: JobAdvertisement = {
      id: 'ad-running',
      publications: [
        { id: 'jobs', channel: 'Jobs.cz', startDate: '1. 10. 2026', endDate: '14. 11. 2026' },
        { id: 'prace', channel: 'Prace.cz', startDate: '1. 10. 2026', endDate: '14. 11. 2026' },
      ],
    }

    const heading = buildSimplify19StatusHeading(advertisement)

    expect(heading?.title).toBe('Běží')
    expect(heading?.secondary).toBe('1. 10. – 14. 11.')
  })

  it('builds ended heading with full date and decline action', () => {
    const advertisement: JobAdvertisement = {
      id: 'ad-ended',
      publications: [
        {
          id: 'jobs',
          channel: 'Jobs.cz',
          status: 'expired',
          endDate: '20. 10. 2026',
        },
        {
          id: 'prace',
          channel: 'Prace.cz',
          status: 'expired',
          endDate: '20. 10. 2026',
        },
      ],
    }

    const heading = buildSimplify19StatusHeading(advertisement)
    expect(heading?.title).toBe(SIMPLIFY_19_ENDED_TITLE)
    expect(heading?.secondary).toBe('20. 10. 2026')

    const actions = getSimplify19HeadingActions(advertisement, 'expired')
    expect(actions?.some((action) => action.label === SIMPLIFY_19_EXTEND_LABEL)).toBe(true)
    expect(actions?.some((action) => action.label === SIMPLIFY_19_DECLINE_LABEL)).toBe(true)
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
    expect(SIMPLIFY_19_NOT_ADVERTISING_TITLE).toBe('Neinzeruje se')
    expect(buildSimplify19NotAdvertisingPerex(advertisement)).toMatch(
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
    expect(buildSimplify19NotAdvertisingPerex(advertisement)).toBeUndefined()
    expect(SIMPLIFY_19_NEVER_CREATED_BODY).toContain('Zveřejněte ji')
    expect(SIMPLIFY_19_START_ADVERTISING_LABEL).toBe('Začít inzerovat')
  })
})
