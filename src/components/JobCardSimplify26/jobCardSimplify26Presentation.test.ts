import { describe, expect, it } from 'vitest'
import type { JobAdvertisement, JobPublication } from '../JobCardSynteza/types'
import {
  buildSimplify26AdvertisementModel,
  SIMPLIFY_26_ENDED_CLASS,
  SIMPLIFY_26_ENDING_SOON_CLASS,
  SIMPLIFY_26_NOT_ADVERTISING_CLASS,
  SIMPLIFY_26_RUNNING_CLASS,
} from './jobCardSimplify26Presentation'

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

describe('buildSimplify26AdvertisementModel', () => {
  it('puts a shared running period into the heading and lays portals in a row', () => {
    const model = buildSimplify26AdvertisementModel(
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

    expect(model.inactive).toEqual([])
    expect(model.active).toHaveLength(1)
    expect(model.active[0]).toMatchObject({
      kind: 'running',
      title: 'Běží 1. 10. – 14. 11. 2026',
      className: SIMPLIFY_26_RUNNING_CLASS,
      layout: 'column',
      listStatus: 'active',
    })
    expect(model.active[0].items.map((item) => item.date)).toEqual([undefined, undefined, undefined])
    expect(model.active[0].items[0]?.status).toBe('active')
  })

  it('uses a mixed-period heading and shows each running period on the item', () => {
    const model = buildSimplify26AdvertisementModel(
      advertisement([
        publication({ id: 'jobs', channel: 'Jobs.cz', endDate: '14. 11. 2026' }),
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

    expect(model.active[0]).toMatchObject({
      title: 'Běží v různá období',
      layout: 'column',
    })
    expect(model.active[0].items.map((item) => ({ channel: item.channel, date: item.date }))).toEqual([
      { channel: 'Jobs.cz', date: '1. 10. – 14. 11. 2026' },
      { channel: 'Doporučení', date: '15. 9. – 30. 11. 2026' },
      { channel: 'Export', date: undefined },
    ])
  })

  it('puts a shared ending-soon date into the heading', () => {
    const model = buildSimplify26AdvertisementModel(
      advertisement([
        publication({ id: 'jobs', channel: 'Jobs.cz', endDate: '3. 11. 2026' }),
        publication({ id: 'prace', channel: 'Prace.cz', endDate: '3. 11. 2026' }),
      ]),
      NOW,
    )

    expect(model.kind).toBe('groups')
    if (model.kind !== 'groups') {
      return
    }

    expect(model.active[0]).toMatchObject({
      kind: 'endingSoon',
      title: 'Brzy končí 3. 11. 2026',
      className: SIMPLIFY_26_ENDING_SOON_CLASS,
      layout: 'column',
      listStatus: 'active',
    })
    expect(model.active[0].items.every((item) => item.date === undefined)).toBe(true)
    expect(model.active[0].items[0]?.status).toBe('endingSoon')
  })

  it('keeps Brzy končí plain and shows each end date when they differ', () => {
    const model = buildSimplify26AdvertisementModel(
      advertisement([
        publication({ id: 'jobs', channel: 'Jobs.cz', endDate: '30. 10. 2026' }),
        publication({ id: 'prace', channel: 'Prace.cz', endDate: '2. 11. 2026' }),
      ]),
      NOW,
    )

    expect(model.kind).toBe('groups')
    if (model.kind !== 'groups') {
      return
    }

    expect(model.active[0]).toMatchObject({
      title: 'Brzy končí',
      layout: 'column',
    })
    expect(model.active[0].items.map((item) => item.date)).toEqual(['30. 10. 2026', '2. 11. 2026'])
  })

  it('puts a shared ended date into the heading and uses the inactive column', () => {
    const model = buildSimplify26AdvertisementModel(
      advertisement([
        publication({
          id: 'jobs',
          channel: 'Jobs.cz',
          status: 'expired',
          endDate: '1. 1. 2026',
        }),
        publication({
          id: 'prace',
          channel: 'Prace.cz',
          status: 'expired',
          endDate: '1. 1. 2026',
        }),
      ]),
      NOW,
    )

    expect(model.kind).toBe('groups')
    if (model.kind !== 'groups') {
      return
    }

    expect(model.active).toEqual([])
    expect(model.inactive[0]).toMatchObject({
      kind: 'expired',
      title: 'Inzerce skončila 1. 1. 2026',
      className: SIMPLIFY_26_ENDED_CLASS,
      layout: 'column',
      listStatus: 'inactive',
    })
    expect(model.inactive[0].items.every((item) => item.date === undefined)).toBe(true)
    expect(model.inactive[0].items[0]?.status).toBe('expired')
  })

  it('keeps Inzerce skončila plain when end dates differ', () => {
    const model = buildSimplify26AdvertisementModel(
      advertisement([
        publication({
          id: 'jobs',
          channel: 'Jobs.cz',
          status: 'expired',
          endDate: '1. 1. 2026',
        }),
        publication({
          id: 'prace',
          channel: 'Prace.cz',
          status: 'expired',
          endDate: '15. 2. 2026',
        }),
      ]),
      NOW,
    )

    expect(model.kind).toBe('groups')
    if (model.kind !== 'groups') {
      return
    }

    expect(model.inactive[0]).toMatchObject({
      title: 'Inzerce skončila',
      layout: 'column',
    })
    expect(model.inactive[0].items.map((item) => item.date)).toEqual(['1. 1. 2026', '15. 2. 2026'])
  })

  it('stacks running and ending soon in the active column and ended ads in the inactive column', () => {
    const model = buildSimplify26AdvertisementModel(
      advertisement([
        publication({ id: 'jobs', channel: 'Jobs.cz', endDate: '14. 11. 2026' }),
        publication({ id: 'prace', channel: 'Prace.cz', endDate: '30. 10. 2026' }),
        publication({
          id: 'atmoskop',
          channel: 'Atmoskop',
          status: 'expired',
          endDate: '1. 1. 2026',
        }),
      ]),
      NOW,
    )

    expect(model.kind).toBe('groups')
    if (model.kind !== 'groups') {
      return
    }

    expect(model.active.map((group) => group.kind)).toEqual(['running', 'endingSoon'])
    expect(model.inactive.map((group) => group.kind)).toEqual(['expired'])
  })

  it('renders Neinzeruje se for a declined advertisement', () => {
    const model = buildSimplify26AdvertisementModel(
      advertisement(
        [publication({ id: 'jobs', channel: 'Jobs.cz', status: 'expired', endDate: '1. 1. 2026' })],
        'notAdvertising',
      ),
      NOW,
    )

    expect(model).toMatchObject({
      kind: 'notAdvertising',
      title: 'Neinzeruje se',
      className: SIMPLIFY_26_NOT_ADVERTISING_CLASS,
    })
  })

  it('renders Neinzeruje se when every publication is disabled', () => {
    const model = buildSimplify26AdvertisementModel(
      advertisement([
        publication({ id: 'jobs', channel: 'Jobs.cz', status: 'disabled', endDate: '1. 1. 2026' }),
      ]),
      NOW,
    )

    expect(model.kind).toBe('notAdvertising')
  })

  it('leaves draft and empty advertisements to the Simplify 13 panel', () => {
    expect(
      buildSimplify26AdvertisementModel({ id: 'draft', status: 'draft', publications: [] }, NOW).kind,
    ).toBe('fallback')
    expect(buildSimplify26AdvertisementModel({ id: 'empty', publications: [] }, NOW).kind).toBe(
      'fallback',
    )
  })
})
