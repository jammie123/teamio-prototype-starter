import { describe, expect, it } from 'vitest'
import type { JobAdvertisement, JobPublication } from '../JobCardSynteza/types'
import {
  buildSimplify16AggregateStatus,
  formatSimplify16CellDate,
  formatSimplify16CellStatusLabel,
  formatSimplify16PromoSubline,
  partitionSimplify16GridPublications,
  simplify16GridColumnCount,
} from './jobCardSimplify16Presentation'

const now = new Date('2026-10-22T12:00:00')

const runningPublication: JobPublication = {
  id: 'jobs',
  channel: 'Jobs.cz',
  startDate: '12. 7. 2026',
  endDate: '20. 1. 2027',
}

const unlimitedPublication: JobPublication = {
  id: 'career',
  channel: 'Kariérní stránky',
  startDate: '12. 7. 2026',
}

describe('formatSimplify16CellDate', () => {
  it('formats running finite channel with do prefix', () => {
    expect(formatSimplify16CellDate(runningPublication, 'running')).toBe('do 20. 1.')
  })

  it('formats unlimited channel', () => {
    expect(formatSimplify16CellDate(unlimitedPublication, 'running')).toBe('bez limitu')
  })

  it('formats ending soon without do prefix', () => {
    expect(formatSimplify16CellDate(runningPublication, 'endingSoon')).toBe('20. 1.')
  })

  it('formats expired and disabled dates', () => {
    expect(
      formatSimplify16CellDate(
        { ...runningPublication, endDate: '20. 10. 2026' },
        'expired',
      ),
    ).toBe('20. 10.')
    expect(formatSimplify16CellDate(unlimitedPublication, 'disabled')).toBe('od 12. 7.')
  })
})

describe('formatSimplify16CellStatusLabel', () => {
  it('maps visual states to Czech labels', () => {
    expect(formatSimplify16CellStatusLabel('running')).toBe('Běží')
    expect(formatSimplify16CellStatusLabel('endingSoon')).toBe('Končí')
    expect(formatSimplify16CellStatusLabel('expired')).toBe('Skončila')
    expect(formatSimplify16CellStatusLabel('disabled')).toBe('Vypnuto')
  })
})

describe('buildSimplify16AggregateStatus', () => {
  it('joins running heading with until date', () => {
    const advertisement: JobAdvertisement = {
      id: 'ad-a',
      publications: [
        runningPublication,
        {
          id: 'prace',
          channel: 'Prace.cz',
          startDate: '12. 7. 2026',
          endDate: '20. 1. 2027',
        },
      ],
    }

    const status = buildSimplify16AggregateStatus(advertisement, 'running', now)

    expect(status?.label).toContain('Běží')
    expect(status?.label).toContain('do')
  })

  it('returns partial heading', () => {
    const advertisement: JobAdvertisement = {
      id: 'ad-d',
      publications: [
        runningPublication,
        {
          id: 'prace',
          channel: 'Prace.cz',
          status: 'expired',
          startDate: '12. 6. 2026',
          endDate: '20. 10. 2026',
        },
      ],
    }

    expect(buildSimplify16AggregateStatus(advertisement, 'partial', now)?.label).toBe(
      'Běží částečně',
    )
  })
})

describe('formatSimplify16PromoSubline', () => {
  it('returns nearest highlight end date', () => {
    const publications: JobPublication[] = [
      {
        id: 'jobs',
        channel: 'Jobs.cz',
        startDate: '12. 7. 2026',
        endDate: '14. 11. 2026',
        highlights: [
          {
            id: 'h1',
            name: 'Top',
            startDate: '1. 10. 2026',
            endDate: '24. 10. 2026',
          },
        ],
      },
    ]

    expect(formatSimplify16PromoSubline(publications, now)).toBe('Zvýrazněno do 24. 10.')
  })
})

describe('grid layout helpers', () => {
  it('uses one column for a single channel', () => {
    expect(simplify16GridColumnCount(1)).toBe(1)
    expect(simplify16GridColumnCount(2)).toBe(2)
  })

  it('limits visible channels to six', () => {
    const publications = Array.from({ length: 8 }, (_, index) => ({
      id: `ch-${index}`,
      channel: `Kanál ${index}`,
      startDate: '1. 1. 2026',
    }))

    const { visible, hiddenCount } = partitionSimplify16GridPublications(publications)

    expect(visible).toHaveLength(6)
    expect(hiddenCount).toBe(2)
  })
})
