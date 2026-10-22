import { describe, expect, it } from 'vitest'
import type { JobAdvertisement } from '../JobCardSynteza/types'
import {
  buildMixedEndDatesHeading,
  buildPartialHeading,
  buildRunningCalmHeading,
  getSimplify12PanelCta,
  isPaidEndedOwnChannelsOnly,
  resolveJobCardSimplify12PanelMode,
} from './jobCardSimplify12Presentation'

const now = new Date('2026-10-22T12:00:00')

describe('resolveJobCardSimplify12PanelMode', () => {
  it('returns partial for combination B', () => {
    const advertisement: JobAdvertisement = {
      id: 'ad-b',
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

    expect(resolveJobCardSimplify12PanelMode(advertisement, now)).toBe('partial')
    expect(buildPartialHeading(advertisement.publications!, now)).toBe('Běží na 2 ze 3 kanálů')
  })

  it('returns runningCalm for uniform running', () => {
    const advertisement: JobAdvertisement = {
      id: 'ad-a',
      publications: [
        { id: 'jobs', channel: 'Jobs.cz', startDate: '12. 7. 2026', endDate: '14. 11. 2026' },
        { id: 'prace', channel: 'Prace.cz', startDate: '12. 7. 2026', endDate: '14. 11. 2026' },
        { id: 'career', channel: 'Kariérní web', startDate: '12. 7. 2026' },
      ],
    }

    expect(resolveJobCardSimplify12PanelMode(advertisement, now)).toBe('runningCalm')
    expect(buildRunningCalmHeading(advertisement, now)).toBe('Běží do 14. 11. 2026')
  })

  it('returns mixedEndDates when active paid channels differ', () => {
    const advertisement: JobAdvertisement = {
      id: 'ad-c',
      publications: [
        { id: 'jobs', channel: 'Jobs.cz', startDate: '12. 7. 2026', endDate: '27. 10. 2026' },
        { id: 'prace', channel: 'Prace.cz', startDate: '12. 7. 2026', endDate: '3. 11. 2026' },
        { id: 'career', channel: 'Kariérní web', startDate: '12. 7. 2026' },
      ],
    }

    expect(resolveJobCardSimplify12PanelMode(advertisement, now)).toBe('mixedEndDates')
    expect(buildMixedEndDatesHeading(advertisement.publications!, now)).toBe(
      'Nejdřív končí za 5 dní · 27. 10.',
    )
  })

  it('returns paidEndedOwnChannelsOnly when only unlimited stays active', () => {
    const publications = [
      {
        id: 'jobs',
        channel: 'Jobs.cz',
        status: 'expired' as const,
        startDate: '12. 6. 2026',
        endDate: '20. 10. 2026',
      },
      {
        id: 'prace',
        channel: 'Prace.cz',
        status: 'expired' as const,
        startDate: '12. 6. 2026',
        endDate: '20. 10. 2026',
      },
      { id: 'career', channel: 'Kariérní web', startDate: '12. 7. 2026' },
    ]

    expect(isPaidEndedOwnChannelsOnly(publications, now)).toBe(true)
    expect(
      resolveJobCardSimplify12PanelMode({ id: 'ad-paid', publications }, now),
    ).toBe('paidEndedOwnChannelsOnly')
  })

  it('offers extend CTA for mixed end dates', () => {
    const advertisement: JobAdvertisement = {
      id: 'ad-c',
      publications: [
        { id: 'jobs', channel: 'Jobs.cz', startDate: '12. 7. 2026', endDate: '27. 10. 2026' },
        { id: 'prace', channel: 'Prace.cz', startDate: '12. 7. 2026', endDate: '3. 11. 2026' },
      ],
    }

    const cta = getSimplify12PanelCta(advertisement, 'mixedEndDates', now)
    expect(cta?.label).toBe('Prodloužit inzerci')
    expect(cta?.targetPublications.map((publication) => publication.id)).toEqual(['jobs', 'prace'])
  })
})
