import { describe, expect, it } from 'vitest'
import type { JobAdvertisement, JobPublication } from '../JobCardSynteza/types'
import {
  buildSimplify29AdvertisementModel,
  formatEndedPortalsBadgeLabel,
  formatEndedPortalsHighlightPerex,
  formatEndedPortalsHighlightTitle,
} from './jobCardSimplify29Presentation'

const NOW = new Date(2026, 9, 27)

function publication(
  partial: Partial<JobPublication> & Pick<JobPublication, 'id' | 'channel'>,
): JobPublication {
  return { startDate: '1. 10. 2026', ...partial }
}

function advertisement(
  publications: JobPublication[],
  status?: JobAdvertisement['status'],
): JobAdvertisement {
  return { id: 'ad', status, publications }
}

describe('buildSimplify29AdvertisementModel', () => {
  it('hides item dates when live portals share one period', () => {
    const model = buildSimplify29AdvertisementModel(
      advertisement([
        publication({ id: 'jobs', channel: 'Jobs.cz', endDate: '14. 11. 2026' }),
        publication({ id: 'prace', channel: 'Prace.cz', endDate: '14. 11. 2026' }),
        publication({ id: 'export', channel: 'Export', startDate: '1. 10. 2026' }),
      ]),
      NOW,
    )

    expect(model.kind).toBe('groups')
    if (model.kind !== 'groups') {
      return
    }

    expect(model.title).toBe('Běží 1. 10. – 14. 11. 2026')
    expect(model.titleClassName).toBe('tm-text-emotion-success-emphasis')
    expect(model.badges).toEqual([])
    expect(model.datesDiffer).toBe(false)
    expect(model.prolongHighlight).toBeUndefined()
    expect(model.groups).toHaveLength(1)
    expect(model.groups[0]).toMatchObject({ kind: 'running', listStatus: 'active' })
    expect(model.groups[0].items.map((item) => item.date)).toEqual([undefined, undefined, undefined])
    expect(model.groups[0].items[0]).toMatchObject({
      channel: 'Jobs.cz',
      status: 'active',
      dateLayout: 'hidden',
    })
  })

  it('groups mixed live portals onto one period row per end date', () => {
    const model = buildSimplify29AdvertisementModel(
      advertisement([
        publication({ id: 'jobs', channel: 'Jobs.cz', endDate: '14. 11. 2026' }),
        publication({ id: 'prace', channel: 'Prace.cz', endDate: '14. 11. 2026' }),
        publication({
          id: 'recommend',
          channel: 'Doporučení',
          startDate: '15. 9. 2026',
          endDate: '30. 11. 2026',
        }),
        publication({ id: 'export', channel: 'Export', startDate: '1. 10. 2026' }),
      ]),
      NOW,
    )

    expect(model.kind).toBe('groups')
    if (model.kind !== 'groups') {
      return
    }

    expect(model.title).toBe('Běží v různá období')
    expect(model.datesDiffer).toBe(true)
    expect(model.groups).toHaveLength(3)
    expect(model.groups.map((group) => group.kind)).toEqual(['period', 'period', 'period'])
    expect(model.groups.map((group) => group.periodKey)).toEqual(['14. 11.', '30. 11.', 'unlimited'])
    expect(model.groups.map((group) => group.periodDate)).toEqual([
      '1. 10. – 14. 11. 2026',
      '15. 9. – 30. 11. 2026',
      undefined,
    ])
    expect(model.groups[0].items.map((item) => item.channel)).toEqual(['Jobs.cz', 'Prace.cz'])
    expect(model.groups[1].items.map((item) => item.channel)).toEqual(['Doporučení'])
    expect(model.groups[2].items.map((item) => item.channel)).toEqual(['Export'])
    expect(model.groups.flatMap((group) => group.items).every((item) => item.date === undefined)).toBe(
      true,
    )
    expect(
      model.groups.flatMap((group) => group.items).every((item) => item.dateLayout === 'hidden'),
    ).toBe(true)
  })

  it('keeps ending-soon status on items while grouping mixed periods by end date', () => {
    const model = buildSimplify29AdvertisementModel(
      advertisement([
        publication({ id: 'jobs', channel: 'Jobs.cz', endDate: '14. 11. 2026' }),
        publication({ id: 'prace', channel: 'Prace.cz', endDate: '3. 11. 2026' }),
        publication({ id: 'atmoskop', channel: 'Atmoskop', endDate: '30. 10. 2026' }),
      ]),
      NOW,
    )

    expect(model.kind).toBe('groups')
    if (model.kind !== 'groups') {
      return
    }

    expect(model.title).toBe('Běží v různá období')
    expect(model.titleClassName).toBe('tm-text-emotion-success-emphasis')
    expect(model.badges).toEqual([{ color: 'warning', label: '2 Brzy končí' }])
    expect(model.datesDiffer).toBe(true)
    expect(model.groups.map((group) => group.periodDate)).toEqual([
      '1. 10. – 30. 10. 2026',
      '1. 10. – 3. 11. 2026',
      '1. 10. – 14. 11. 2026',
    ])
    expect(model.groups.map((group) => group.items.map((item) => item.status))).toEqual([
      ['endingSoon'],
      ['endingSoon'],
      ['active'],
    ])
  })

  it('keeps ended portals in a badge and highlight, not in the list', () => {
    const model = buildSimplify29AdvertisementModel(
      advertisement([
        publication({ id: 'jobs', channel: 'Jobs.cz', status: 'expired', endDate: '1. 1. 2026' }),
        publication({ id: 'prace', channel: 'Prace.cz', status: 'expired', endDate: '15. 2. 2026' }),
      ]),
      NOW,
    )

    expect(model.kind).toBe('groups')
    if (model.kind !== 'groups') {
      return
    }

    expect(model.title).toBe('Ukončeno')
    expect(model.badges).toEqual([{ color: 'neutral', label: '2 ukončené' }])
    expect(model.groups).toEqual([])
    expect(model.datesDiffer).toBe(false)
    expect(model.prolongHighlight).toEqual({
      channels: ['Jobs.cz', 'Prace.cz'],
      title: 'Inzerce ukončena na 2 portálech',
      perex: 'Ukončeno 1. 1. a 15. 2.',
    })
  })

  it('keeps ending-soon and ended badges while listing only live portals', () => {
    const model = buildSimplify29AdvertisementModel(
      advertisement([
        publication({ id: 'jobs', channel: 'Jobs.cz', endDate: '14. 11. 2026' }),
        publication({ id: 'prace', channel: 'Prace.cz', endDate: '3. 11. 2026' }),
        publication({ id: 'atmoskop', channel: 'Atmoskop', status: 'expired', endDate: '1. 1. 2026' }),
      ]),
      NOW,
    )

    expect(model.kind).toBe('groups')
    if (model.kind !== 'groups') {
      return
    }

    expect(model.title).toBe('Běží v různá období')
    expect(model.badges.map((badge) => badge.label)).toEqual(['1 Brzy končí', '1 ukončený'])
    expect(model.groups.map((group) => group.kind)).toEqual(['period', 'period'])
    expect(model.groups.map((group) => group.periodDate)).toEqual([
      '1. 10. – 3. 11. 2026',
      '1. 10. – 14. 11. 2026',
    ])
    expect(model.prolongHighlight).toEqual({
      channels: ['Atmoskop'],
      title: 'Atmoskop',
      perex: 'Ukončeno 1. 1.',
    })
  })

  it('uses Běží when the only live portals have no end date', () => {
    const model = buildSimplify29AdvertisementModel(
      advertisement([publication({ id: 'export', channel: 'Export', startDate: '1. 10. 2026' })]),
      NOW,
    )

    expect(model.kind).toBe('groups')
    if (model.kind !== 'groups') {
      return
    }

    expect(model.title).toBe('Běží')
    expect(model.titleClassName).toBe('tm-text-emotion-success-emphasis')
    expect(model.datesDiffer).toBe(false)
  })

  it('renders Neinzeruje se for a declined advertisement', () => {
    const model = buildSimplify29AdvertisementModel(
      advertisement(
        [publication({ id: 'jobs', channel: 'Jobs.cz', status: 'expired', endDate: '1. 1. 2026' })],
        'notAdvertising',
      ),
      NOW,
    )

    expect(model).toMatchObject({
      kind: 'notAdvertising',
      title: 'Neinzeruje se',
    })
  })

  it('renders Neinzeruje se when every publication is disabled', () => {
    const model = buildSimplify29AdvertisementModel(
      advertisement([
        publication({ id: 'jobs', channel: 'Jobs.cz', status: 'disabled', endDate: '1. 1. 2026' }),
      ]),
      NOW,
    )

    expect(model.kind).toBe('notAdvertising')
  })

  it('leaves draft and empty advertisements to the Simplify 13 panel', () => {
    expect(
      buildSimplify29AdvertisementModel({ id: 'draft', status: 'draft', publications: [] }, NOW).kind,
    ).toBe('fallback')
    expect(buildSimplify29AdvertisementModel({ id: 'empty', publications: [] }, NOW).kind).toBe(
      'fallback',
    )
  })
})

describe('formatEndedPortalsBadgeLabel', () => {
  it('uses the Czech plural that matches the count', () => {
    expect(formatEndedPortalsBadgeLabel(1)).toBe('1 ukončený')
    expect(formatEndedPortalsBadgeLabel(2)).toBe('2 ukončené')
    expect(formatEndedPortalsBadgeLabel(4)).toBe('4 ukončené')
    expect(formatEndedPortalsBadgeLabel(5)).toBe('5 ukončených')
    expect(formatEndedPortalsBadgeLabel(12)).toBe('12 ukončených')
    expect(formatEndedPortalsBadgeLabel(22)).toBe('22 ukončené')
  })
})

describe('formatEndedPortalsHighlightTitle', () => {
  it('uses the portal name for one channel and a generic count for more', () => {
    expect(formatEndedPortalsHighlightTitle(['Jobs.cz'])).toBe('Jobs.cz')
    expect(formatEndedPortalsHighlightTitle(['Jobs.cz', 'Prace.cz'])).toBe(
      'Inzerce ukončena na 2 portálech',
    )
    expect(formatEndedPortalsHighlightTitle(['Jobs.cz', 'Prace.cz', 'Atmoskop', 'Profesia', 'Export'])).toBe(
      'Inzerce ukončena na 5 portálech',
    )
  })
})

describe('formatEndedPortalsHighlightPerex', () => {
  it('formats one, two and three unique end dates', () => {
    expect(formatEndedPortalsHighlightPerex(['1. 1. 2026'])).toBe('Ukončeno 1. 1.')
    expect(formatEndedPortalsHighlightPerex(['1. 1. 2026', '15. 2. 2026'])).toBe(
      'Ukončeno 1. 1. a 15. 2.',
    )
    expect(formatEndedPortalsHighlightPerex(['1. 1. 2026', '15. 2. 2026', '3. 3. 2026'])).toBe(
      'Ukončeno 1. 1., 15. 2. a 3. 3.',
    )
  })

  it('dedupes the same calendar day and skips empty dates', () => {
    expect(formatEndedPortalsHighlightPerex(['1. 1. 2026', '1. 1.'])).toBe('Ukončeno 1. 1.')
    expect(formatEndedPortalsHighlightPerex([])).toBeUndefined()
  })
})
