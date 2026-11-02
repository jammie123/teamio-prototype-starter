import { describe, expect, it } from 'vitest'
import type { JobAdvertisement, JobPublication } from '../JobCard/types'
import { buildJobCardV2AdvertisementModel } from './jobCardV2Presentation'

const now = new Date(2026, 8, 27) // 27. 9. 2026

function ad(publications: JobPublication[]): JobAdvertisement {
  return { id: 'ad-1', publications }
}

function portal(
  partial: Partial<JobPublication> & Pick<JobPublication, 'id' | 'channel'>,
): JobPublication {
  return { startDate: '1. 1. 2026', ...partial }
}

describe('buildJobCardV2AdvertisementModel', () => {
  it('returns empty when the advertisement has no publications', () => {
    expect(buildJobCardV2AdvertisementModel(ad([]), now)).toEqual({ kind: 'empty' })
  })

  it('uses a green from–to heading when every portal shares the same period', () => {
    const model = buildJobCardV2AdvertisementModel(
      ad([
        portal({ id: 'jobs', channel: 'Jobs.cz', endDate: '1. 2. 2026', viewCount: 2000 }),
        portal({ id: 'prace', channel: 'Prace.cz', endDate: '1. 2. 2026', viewCount: 800 }),
        portal({ id: 'career', channel: 'Kariérní stránky', endDate: '1. 2. 2026', viewCount: 370 }),
      ]),
      now,
    )

    expect(model).toMatchObject({
      kind: 'runningSame',
      heading: 'Běží od 1. 1. do 1. 2. 2026',
      headingTone: 'success',
    })
    if (model.kind === 'empty') {
      throw new Error('expected publications')
    }
    expect(model.portals.map((item) => [item.publication.channel, item.tone, item.dateLabel])).toEqual([
      ['Jobs.cz', 'success', undefined],
      ['Prace.cz', 'success', undefined],
      ['Kariérní stránky', 'success', undefined],
    ])
  })

  it('uses Běží v různých obdobích and per-portal dates when periods differ', () => {
    const model = buildJobCardV2AdvertisementModel(
      ad([
        portal({
          id: 'jobs',
          channel: 'Jobs.cz',
          startDate: '1. 9. 2026',
          endDate: '30. 9. 2026',
        }),
        portal({
          id: 'prace',
          channel: 'Prace.cz',
          startDate: '15. 9. 2026',
          endDate: '15. 10. 2026',
        }),
        portal({ id: 'career', channel: 'Kariérní stránky', startDate: '', endDate: '1. 11. 2026' }),
      ]),
      now,
    )

    expect(model).toMatchObject({
      kind: 'runningDifferent',
      heading: 'Běží v různých obdobích',
      headingTone: 'success',
    })
    if (model.kind === 'empty') {
      throw new Error('expected publications')
    }
    expect(model.portals.map((item) => item.dateLabel)).toEqual([
      '1. 9. – 30. 9.',
      '15. 9. – 15. 10.',
      'do 1. 11.',
    ])
    expect(model.portals.every((item) => item.tone === 'success')).toBe(true)
  })

  it('keeps a green mixed heading and dates only on ended portals when remaining share an end date', () => {
    const model = buildJobCardV2AdvertisementModel(
      ad([
        portal({ id: 'jobs', channel: 'Jobs.cz', startDate: '1. 9. 2026', endDate: '30. 11. 2026' }),
        portal({
          id: 'prace',
          channel: 'Prace.cz',
          status: 'expired',
          startDate: '1. 8. 2026',
          endDate: '15. 8. 2026',
        }),
        portal({
          id: 'career',
          channel: 'Kariérní stránky',
          startDate: '1. 9. 2026',
          endDate: '30. 11. 2026',
        }),
      ]),
      now,
    )

    expect(model).toMatchObject({
      kind: 'mixed',
      heading: 'Běží do 30. 11. · 1 portál ukončen',
      headingTone: 'success',
    })
    if (model.kind === 'empty') {
      throw new Error('expected publications')
    }
    expect(model.portals.map((item) => [item.publication.channel, item.tone, item.dateLabel])).toEqual([
      ['Jobs.cz', 'success', undefined],
      ['Kariérní stránky', 'success', undefined],
      ['Prace.cz', 'ended', 'ukončeno 15. 8.'],
    ])
  })

  it('adds live portal dates when remaining periods differ and some portals have ended', () => {
    const model = buildJobCardV2AdvertisementModel(
      ad([
        portal({ id: 'jobs', channel: 'Jobs.cz', startDate: '1. 9. 2026', endDate: '20. 9. 2026' }),
        portal({ id: 'prace', channel: 'Prace.cz', startDate: '1. 9. 2026', endDate: '30. 9. 2026' }),
        portal({
          id: 'career',
          channel: 'Kariérní stránky',
          status: 'expired',
          startDate: '1. 8. 2026',
          endDate: '15. 8. 2026',
        }),
      ]),
      now,
    )

    expect(model).toMatchObject({
      kind: 'mixed',
      heading: 'Běží v různých obdobích · 1 portál ukončen',
      headingTone: 'success',
    })
    if (model.kind === 'empty') {
      throw new Error('expected publications')
    }
    expect(model.portals.map((item) => item.dateLabel)).toEqual([
      '1. 9. – 20. 9.',
      '1. 9. – 30. 9.',
      'ukončeno 15. 8.',
    ])
  })

  it('greys the whole row when every portal has ended on the same day', () => {
    const model = buildJobCardV2AdvertisementModel(
      ad([
        portal({
          id: 'jobs',
          channel: 'Jobs.cz',
          status: 'expired',
          endDate: '1. 1. 2026',
        }),
        portal({
          id: 'prace',
          channel: 'Prace.cz',
          status: 'expired',
          endDate: '1. 1. 2026',
        }),
        portal({
          id: 'career',
          channel: 'Kariérní stránky',
          status: 'expired',
          endDate: '1. 1. 2026',
        }),
      ]),
      now,
    )

    expect(model).toMatchObject({
      kind: 'ended',
      heading: 'Ukončeno 1. 1. 2026',
      headingTone: 'ended',
    })
    if (model.kind === 'empty') {
      throw new Error('expected publications')
    }
    expect(model.portals.every((item) => item.tone === 'ended' && item.dateLabel === undefined)).toBe(
      true,
    )
  })

  it('uses a bare Ukončeno heading and per-portal ended dates when end dates differ', () => {
    const model = buildJobCardV2AdvertisementModel(
      ad([
        portal({
          id: 'jobs',
          channel: 'Jobs.cz',
          status: 'expired',
          endDate: '15. 8. 2026',
        }),
        portal({
          id: 'prace',
          channel: 'Prace.cz',
          status: 'expired',
          endDate: '1. 9. 2026',
        }),
      ]),
      now,
    )

    expect(model).toMatchObject({
      kind: 'ended',
      heading: 'Ukončeno',
      headingTone: 'ended',
    })
    if (model.kind === 'empty') {
      throw new Error('expected publications')
    }
    expect(model.portals.map((item) => item.dateLabel)).toEqual(['ukončeno 15. 8.', 'ukončeno 1. 9.'])
  })

  it('uses amber endingSoon only when every remaining dated portal ends within 7 days', () => {
    const model = buildJobCardV2AdvertisementModel(
      ad([
        portal({ id: 'jobs', channel: 'Jobs.cz', startDate: '1. 9. 2026', endDate: '30. 9. 2026' }),
        portal({ id: 'prace', channel: 'Prace.cz', startDate: '1. 9. 2026', endDate: '30. 9. 2026' }),
        portal({
          id: 'career',
          channel: 'Kariérní stránky',
          startDate: '1. 9. 2026',
          endDate: '30. 9. 2026',
        }),
      ]),
      now,
    )

    expect(model).toMatchObject({
      kind: 'endingSoon',
      heading: 'Končí za 3 dny · 30. 9.',
      headingTone: 'warning',
    })
    if (model.kind === 'empty') {
      throw new Error('expected publications')
    }
    expect(model.portals.every((item) => item.tone === 'warning' && item.dateLabel === undefined)).toBe(
      true,
    )
  })

  it('treats status endingSoon as soon even when the date is farther out', () => {
    const model = buildJobCardV2AdvertisementModel(
      ad([
        portal({
          id: 'jobs',
          channel: 'Jobs.cz',
          status: 'endingSoon',
          startDate: '1. 9. 2026',
          endDate: '30. 11. 2026',
        }),
      ]),
      now,
    )

    expect(model.kind).toBe('endingSoon')
    if (model.kind === 'empty') {
      throw new Error('expected publications')
    }
    expect(model.heading).toBe('Končí za 64 dní · 30. 11.')
  })

  it('does not raise a card-level amber alarm when one portal is soon and another still has runway', () => {
    const model = buildJobCardV2AdvertisementModel(
      ad([
        portal({ id: 'jobs', channel: 'Jobs.cz', startDate: '1. 9. 2026', endDate: '30. 9. 2026' }),
        portal({ id: 'prace', channel: 'Prace.cz', startDate: '1. 9. 2026', endDate: '6. 11. 2026' }),
      ]),
      now,
    )

    expect(model.kind).toBe('runningDifferent')
    if (model.kind === 'empty') {
      throw new Error('expected publications')
    }
    expect(model.headingTone).toBe('success')
    expect(model.portals.map((item) => item.tone)).toEqual(['success', 'success'])
  })

  it('lets unlimited portals sit next to ending-soon dated portals without blocking the amber state', () => {
    const model = buildJobCardV2AdvertisementModel(
      ad([
        portal({ id: 'jobs', channel: 'Jobs.cz', startDate: '1. 9. 2026', endDate: '30. 9. 2026' }),
        portal({ id: 'career', channel: 'Kariérní stránky', startDate: '1. 9. 2026' }),
      ]),
      now,
    )

    expect(model.kind).toBe('endingSoon')
    if (model.kind === 'empty') {
      throw new Error('expected publications')
    }
    expect(model.portals.map((item) => item.tone)).toEqual(['warning', 'warning'])
  })

  it('does not treat a card of only unlimited portals as ending soon', () => {
    const model = buildJobCardV2AdvertisementModel(
      ad([portal({ id: 'career', channel: 'Kariérní stránky', startDate: '1. 9. 2026' })]),
      now,
    )

    expect(model.kind).not.toBe('endingSoon')
  })

  it('keeps expired portals grey when remaining dated portals are all ending soon', () => {
    const model = buildJobCardV2AdvertisementModel(
      ad([
        portal({ id: 'jobs', channel: 'Jobs.cz', startDate: '1. 9. 2026', endDate: '30. 9. 2026' }),
        portal({
          id: 'prace',
          channel: 'Prace.cz',
          status: 'expired',
          startDate: '1. 8. 2026',
          endDate: '15. 8. 2026',
        }),
      ]),
      now,
    )

    expect(model.kind).toBe('endingSoon')
    if (model.kind === 'empty') {
      throw new Error('expected publications')
    }
    expect(model.portals.map((item) => [item.tone, item.dateLabel])).toEqual([
      ['warning', undefined],
      ['ended', 'ukončeno 15. 8.'],
    ])
  })

  it('shows per-portal dates when remaining soon portals do not share an end date', () => {
    const model = buildJobCardV2AdvertisementModel(
      ad([
        portal({ id: 'jobs', channel: 'Jobs.cz', startDate: '1. 9. 2026', endDate: '28. 9. 2026' }),
        portal({ id: 'prace', channel: 'Prace.cz', startDate: '1. 9. 2026', endDate: '30. 9. 2026' }),
      ]),
      now,
    )

    expect(model.kind).toBe('endingSoon')
    if (model.kind === 'empty') {
      throw new Error('expected publications')
    }
    expect(model.heading).toBe('Končí za 1 den · 28. 9.')
    expect(model.portals.map((item) => item.dateLabel)).toEqual(['1. 9. – 28. 9.', '1. 9. – 30. 9.'])
  })

  it('sorts live job boards by end date and pushes ended portals to the end', () => {
    const model = buildJobCardV2AdvertisementModel(
      ad([
        portal({
          id: 'career',
          channel: 'Kariérní stránky',
          status: 'expired',
          startDate: '1. 8. 2026',
          endDate: '1. 9. 2026',
        }),
        portal({
          id: 'prace',
          channel: 'Prace.cz',
          startDate: '15. 9. 2026',
          endDate: '15. 10. 2026',
        }),
        portal({
          id: 'jobs',
          channel: 'Jobs.cz',
          startDate: '1. 9. 2026',
          endDate: '30. 9. 2026',
        }),
        portal({
          id: 'atmoskop',
          channel: 'Atmoskop',
          status: 'expired',
          startDate: '1. 7. 2026',
          endDate: '15. 8. 2026',
        }),
      ]),
      now,
    )

    expect(model.kind).toBe('mixed')
    if (model.kind === 'empty') {
      throw new Error('expected publications')
    }
    expect(model.portals.map((item) => item.publication.channel)).toEqual([
      'Jobs.cz',
      'Prace.cz',
      'Atmoskop',
      'Kariérní stránky',
    ])
    expect(model.portals.map((item) => item.tone)).toEqual([
      'success',
      'success',
      'ended',
      'ended',
    ])
  })

  it('uses Končí dnes when the shared remaining end is today', () => {
    const model = buildJobCardV2AdvertisementModel(
      ad([portal({ id: 'jobs', channel: 'Jobs.cz', startDate: '1. 9. 2026', endDate: '27. 9. 2026' })]),
      now,
    )

    expect(model).toMatchObject({
      kind: 'endingSoon',
      heading: 'Končí dnes · 27. 9.',
      headingTone: 'warning',
    })
  })
})
