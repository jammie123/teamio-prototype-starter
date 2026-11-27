import { describe, expect, it } from 'vitest'
import { buildAdvertisementModel } from './advertisementModel'
import type { JobPublication } from '../types'

const now = new Date(2026, 8, 27)

function portal(
  partial: Partial<JobPublication> & Pick<JobPublication, 'id' | 'channel'>,
): JobPublication {
  return { startDate: '1. 9. 2026', ...partial }
}

describe('buildAdvertisementModel', () => {
  it('returns notPublished for an advertisement without portals', () => {
    const model = buildAdvertisementModel({ id: 'a' }, now)

    expect(model.kind).toBe('notPublished')
    expect(model.header).toEqual({ tone: 'neutral', label: 'Zatím nevystavený inzerát' })
    expect(model.publications).toEqual([])
    expect(model.canProlong).toBe(false)
  })

  it('shows one period for running portals with the same dates', () => {
    const model = buildAdvertisementModel(
      {
        id: 'a',
        publications: [
          portal({ id: '1', channel: 'Jobs.cz', endDate: '30. 10. 2026', viewCount: 10 }),
          portal({ id: '2', channel: 'Prace.cz', endDate: '30. 10. 2026', viewCount: 5 }),
        ],
      },
      now,
    )

    expect(model.kind).toBe('running')
    expect(model.header).toEqual({
      tone: 'success',
      dateInfo: '1. 9. – 30. 10. 2026',
    })
    expect(model.publications.every((item) => item.dateLabel === undefined)).toBe(true)
    expect(model.showStatusDots).toBe(false)
    expect(model.viewCount).toBe(15)
  })

  it('labels each portal when running periods differ', () => {
    const model = buildAdvertisementModel(
      {
        id: 'a',
        publications: [
          portal({ id: '1', channel: 'Jobs.cz', endDate: '30. 10. 2026' }),
          portal({ id: '2', channel: 'Prace.cz', endDate: '15. 11. 2026' }),
        ],
      },
      now,
    )

    expect(model.kind).toBe('runningDifferent')
    expect(model.header).toEqual({ tone: 'success' })
    expect(model.publications.map((item) => item.dateLabel)).toEqual(['do 30. 10.', 'do 15. 11.'])
  })

  it('keeps ended portals last with an ended date and shows status dots', () => {
    const model = buildAdvertisementModel(
      {
        id: 'a',
        publications: [
          portal({ id: '1', channel: 'Prace.cz', status: 'expired', endDate: '15. 8. 2026' }),
          portal({ id: '2', channel: 'Jobs.cz', endDate: '30. 10. 2026' }),
        ],
      },
      now,
    )

    expect(model.kind).toBe('runningMixed')
    expect(model.canProlong).toBe(true)
    expect(model.header).toEqual({ tone: 'success', dateInfo: '1. 9. – 30. 10. 2026' })
    expect(model.publications.map((item) => [item.publication.id, item.status, item.dateLabel])).toEqual([
      ['2', 'active', undefined],
      ['1', 'expired', 'ukončeno 15. 8.'],
    ])
    expect(model.showStatusDots).toBe(true)
  })

  it('has no label when running portals share only the end date next to an ended portal', () => {
    const model = buildAdvertisementModel(
      {
        id: 'a',
        publications: [
          portal({ id: '1', channel: 'Prace.cz', status: 'expired', endDate: '15. 8. 2026' }),
          portal({ id: '2', channel: 'Jobs.cz', startDate: '1. 9. 2026', endDate: '30. 10. 2026' }),
          portal({ id: '3', channel: 'Kariéra', startDate: '5. 9. 2026', endDate: '30. 10. 2026' }),
        ],
      },
      now,
    )

    expect(model.kind).toBe('runningMixed')
    expect(model.header).toEqual({ tone: 'success', dateInfo: '30. 10.' })
  })

  it('detects an advertisement that ends within 7 days', () => {
    const model = buildAdvertisementModel(
      {
        id: 'a',
        publications: [
          portal({ id: '1', channel: 'Jobs.cz', endDate: '30. 9. 2026' }),
          portal({ id: '2', channel: 'Prace.cz', endDate: '30. 9. 2026' }),
        ],
      },
      now,
    )

    expect(model.kind).toBe('endingSoon')
    expect(model.header).toEqual({
      tone: 'warning',
      label: 'Končí za 3 dny',
      dateInfo: '1. 9. – 30. 9. 2026',
      highlighted: true,
    })
    expect(model.canProlong).toBe(true)
    expect(model.publications.every((item) => item.status === 'endingSoon')).toBe(true)
  })

  it('says "Končí dnes" on the last day', () => {
    const model = buildAdvertisementModel(
      { id: 'a', publications: [portal({ id: '1', channel: 'Jobs.cz', endDate: '27. 9. 2026' })] },
      now,
    )

    expect(model.header.label).toBe('Končí dnes')
  })

  it('shows only the soonest end date when ending portals have different periods', () => {
    const model = buildAdvertisementModel(
      {
        id: 'a',
        publications: [
          portal({ id: '1', channel: 'Jobs.cz', endDate: '30. 9. 2026' }),
          portal({ id: '2', channel: 'Prace.cz', startDate: '5. 9. 2026', endDate: '2. 10. 2026' }),
        ],
      },
      now,
    )

    expect(model.header).toMatchObject({ label: 'Končí za 3 dny', dateInfo: '30. 9.' })
    expect(model.publications.map((item) => item.dateLabel)).toEqual(['do 30. 9.', 'do 2. 10.'])
  })

  it('shows a from-to range when every ended portal shares the dates', () => {
    const model = buildAdvertisementModel(
      {
        id: 'a',
        publications: [
          portal({ id: '1', channel: 'Jobs.cz', status: 'expired', startDate: '1. 8. 2026', endDate: '15. 8. 2026' }),
          portal({ id: '2', channel: 'Prace.cz', status: 'expired', startDate: '1. 8. 2026', endDate: '15. 8. 2026' }),
        ],
      },
      now,
    )

    expect(model.kind).toBe('ended')
    expect(model.header).toEqual({
      tone: 'ended',
      label: 'Expirováno',
      dateInfo: '1. 8. – 15. 8. 2026',
    })
    expect(model.canProlong).toBe(true)
  })

  it('labels each ended portal when end dates differ', () => {
    const model = buildAdvertisementModel(
      {
        id: 'a',
        publications: [
          portal({ id: '1', channel: 'Jobs.cz', status: 'expired', endDate: '15. 8. 2026' }),
          portal({ id: '2', channel: 'Prace.cz', status: 'expired', endDate: '20. 8. 2026' }),
        ],
      },
      now,
    )

    expect(model.header).toEqual({ tone: 'ended', label: 'Expirováno', dateInfo: undefined })
    expect(model.publications.map((item) => item.dateLabel)).toEqual([
      'ukončeno 15. 8.',
      'ukončeno 20. 8.',
    ])
  })
  describe('ended advertisements', () => {
    const ended = (endDate: string) => ({
      id: 'a',
      publications: [
        portal({ id: '1', channel: 'Jobs.cz', status: 'expired' as const, endDate }),
        portal({ id: '2', channel: 'Prace.cz', status: 'expired' as const, endDate }),
      ],
    })

    it.each([
      ['27. 9. 2026', 'Expirováno dnes'],
      ['26. 9. 2026', 'Expirováno před 1 dnem'],
      ['24. 9. 2026', 'Expirováno před 3 dny'],
      ['20. 9. 2026', 'Expirováno před 7 dny'],
    ])('highlights an advertisement that expired on %s as recently expired', (endDate, label) => {
      const model = buildAdvertisementModel(ended(endDate), now)

      expect(model.kind).toBe('endedRecently')
      expect(model.header).toMatchObject({ tone: 'warning', label, highlighted: true })
      expect(model.canProlong).toBe(true)
    })

    it('treats an advertisement that expired 8 days ago as an old expired one', () => {
      const model = buildAdvertisementModel(ended('19. 9. 2026'), now)

      expect(model.kind).toBe('ended')
      expect(model.header).toMatchObject({ tone: 'ended', label: 'Expirováno' })
      expect(model.header.highlighted).toBeFalsy()
    })

    it('uses the most recent end date when portals ended on different days', () => {
      const model = buildAdvertisementModel(
        {
          id: 'a',
          publications: [
            portal({ id: '1', channel: 'Jobs.cz', status: 'expired', endDate: '1. 8. 2026' }),
            portal({ id: '2', channel: 'Prace.cz', status: 'expired', endDate: '25. 9. 2026' }),
          ],
        },
        now,
      )

      expect(model.kind).toBe('endedRecently')
      expect(model.header.label).toBe('Expirováno před 2 dny')
    })

    it('stays neutral when the end date is missing or still in the future', () => {
      expect(
        buildAdvertisementModel(
          { id: 'a', publications: [portal({ id: '1', channel: 'Jobs.cz', status: 'expired' })] },
          now,
        ).kind,
      ).toBe('ended')
      expect(buildAdvertisementModel(ended('30. 9. 2026'), now).kind).toBe('ended')
    })

    it('labels a manually ended advertisement "Ukončené vystavování" without highlight', () => {
      const model = buildAdvertisementModel(ended('26. 9. 2026'), now, { endedBy: 'manual' })

      expect(model.kind).toBe('endedManually')
      expect(model.header).toMatchObject({ tone: 'ended', label: 'Ukončené vystavování' })
      expect(model.canProlong).toBe(true)
    })

    it('never highlights an archived job', () => {
      const model = buildAdvertisementModel(ended('26. 9. 2026'), now, { endedBy: 'archived' })

      expect(model.kind).toBe('endedManually')
      expect(model.header).toMatchObject({ tone: 'ended', label: 'Ukončené vystavování' })
    })

    it('has no heading label for any running advertisement', () => {
      const running = buildAdvertisementModel(
        { id: 'a', publications: [portal({ id: '1', channel: 'Jobs.cz', endDate: '30. 10. 2026' })] },
        now,
      )
      const different = buildAdvertisementModel(
        {
          id: 'a',
          publications: [
            portal({ id: '1', channel: 'Jobs.cz', endDate: '30. 10. 2026' }),
            portal({ id: '2', channel: 'Prace.cz', endDate: '15. 11. 2026' }),
          ],
        },
        now,
      )

      expect(running.header.label).toBeUndefined()
      expect(different.header.label).toBeUndefined()
    })
  })
})
