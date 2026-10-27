import { describe, expect, it } from 'vitest'
import type { JobAdvertisement, JobPublication } from '../JobCardSynteza/types'
import {
  buildSimplify28AdvertisementModel,
  formatEndedPortalsBadgeLabel,
} from './jobCardSimplify28Presentation'

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

describe('buildSimplify28AdvertisementModel', () => {
  it('hides item dates when live portals share one period', () => {
    const model = buildSimplify28AdvertisementModel(
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
    expect(model.datesDiffer).toBe(false)
    expect(model.groups).toHaveLength(1)
    expect(model.groups[0]).toMatchObject({
      kind: 'running',
      listStatus: 'success',
      badge: { tone: 'success', label: 'Běží' },
    })
    expect(model.groups[0].items.map((item) => item.date)).toEqual([undefined, undefined, undefined])
    expect(model.groups[0].items[0]).toMatchObject({
      channel: 'Jobs.cz',
      status: 'active',
      dateLayout: 'hidden',
    })
  })

  it('puts the end date under every dated live portal when live end dates differ', () => {
    const model = buildSimplify28AdvertisementModel(
      advertisement([
        publication({ id: 'jobs', channel: 'Jobs.cz', endDate: '14. 11. 2026' }),
        publication({
          id: 'recommend',
          channel: 'Doporučení',
          startDate: '15. 9. 2026',
          endDate: '30. 11. 2026',
        }),
      ]),
      NOW,
    )

    expect(model.kind).toBe('groups')
    if (model.kind !== 'groups') {
      return
    }

    expect(model.title).toBe('Běží v různá období')
    expect(model.datesDiffer).toBe(true)
    expect(model.groups[0].items.map((item) => item.date)).toEqual([
      'do 14. 11. 2026',
      'do 30. 11. 2026',
    ])
    expect(model.groups[0].items.every((item) => item.dateLayout === 'beside')).toBe(true)
  })

  it('lists ending-soon portals after running ones with a success badge', () => {
    const model = buildSimplify28AdvertisementModel(
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
    expect(model.datesDiffer).toBe(true)
    expect(model.groups.map((group) => group.kind)).toEqual(['running', 'endingSoon'])
    expect(model.groups[0].badge).toEqual({ tone: 'success', label: 'Běží' })
    expect(model.groups[1].badge).toEqual({ tone: 'success', label: '2 Brzy končí' })
    expect(model.groups[1].listStatus).toBe('success')
    expect(model.groups[1].items.map((item) => item.date)).toEqual(['do 3. 11. 2026', 'do 30. 10. 2026'])
    expect(model.groups[1].items.map((item) => item.status)).toEqual(['endingSoon', 'endingSoon'])
  })

  it('lists ended portals under a default badge instead of a prolong highlight', () => {
    const model = buildSimplify28AdvertisementModel(
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
    expect(model.groups).toHaveLength(1)
    expect(model.groups[0]).toMatchObject({
      kind: 'expired',
      listStatus: 'default',
      badge: { tone: 'default', label: '2 ukončené' },
    })
    expect(model.groups[0].items.map((item) => item.channel)).toEqual(['Jobs.cz', 'Prace.cz'])
    expect(model.groups[0].items.map((item) => item.date)).toEqual(['do 1. 1. 2026', 'do 15. 2. 2026'])
    expect(model.groups[0].items.every((item) => item.dateLayout === 'beside')).toBe(true)
    expect(model).not.toHaveProperty('prolongHighlight')
  })

  it('stacks a success list and a default list when live and ended portals mix', () => {
    const model = buildSimplify28AdvertisementModel(
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
    expect(model.groups.map((group) => group.badge)).toEqual([
      { tone: 'success', label: 'Běží' },
      { tone: 'success', label: '1 Brzy končí' },
      { tone: 'default', label: '1 ukončený' },
    ])
    expect(model.groups.map((group) => group.kind)).toEqual(['running', 'endingSoon', 'expired'])
    expect(model).not.toHaveProperty('prolongHighlight')
  })

  it('uses Běží when the only live portals have no end date', () => {
    const model = buildSimplify28AdvertisementModel(
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
    expect(model.groups[0].badge).toEqual({ tone: 'success', label: 'Běží' })
  })

  it('renders Neinzeruje se for a declined advertisement', () => {
    const model = buildSimplify28AdvertisementModel(
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
    const model = buildSimplify28AdvertisementModel(
      advertisement([
        publication({ id: 'jobs', channel: 'Jobs.cz', status: 'disabled', endDate: '1. 1. 2026' }),
      ]),
      NOW,
    )

    expect(model.kind).toBe('notAdvertising')
  })

  it('leaves draft and empty advertisements to the Simplify 13 panel', () => {
    expect(
      buildSimplify28AdvertisementModel({ id: 'draft', status: 'draft', publications: [] }, NOW).kind,
    ).toBe('fallback')
    expect(buildSimplify28AdvertisementModel({ id: 'empty', publications: [] }, NOW).kind).toBe(
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
