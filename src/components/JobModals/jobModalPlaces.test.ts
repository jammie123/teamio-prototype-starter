import { describe, expect, it } from 'vitest'
import {
  formatAdvertisedFrom,
  formatNewPeriod,
  placeStatusLabel,
  resolvePlaceRunStatus,
  resolveProlongConfirmLabel,
  sortPlacesByOldestAdvertised,
} from './jobModalPlaces'
import type { JobModalPublicationPlace } from './types'

const now = new Date(2026, 9, 6)

function place(overrides: Partial<JobModalPublicationPlace> = {}): JobModalPublicationPlace {
  return {
    id: 'jobs',
    name: 'Jobs.cz',
    ...overrides,
  }
}

describe('formatAdvertisedFrom', () => {
  it('returns the full from–to range when the place was advertised', () => {
    expect(formatAdvertisedFrom(place({ startDate: '12. 7. 2026', endDate: '30. 9. 2026' }))).toBe(
      '12. 7. – 30. 9. 2026',
    )
  })

  it('returns a dash when the place was never advertised', () => {
    expect(formatAdvertisedFrom(place())).toBe('–')
    expect(formatAdvertisedFrom(place({ startDate: '   ' }))).toBe('–')
  })
})

describe('sortPlacesByOldestAdvertised', () => {
  it('sorts by the oldest Inzerováno start, then the oldest end, with never-advertised last', () => {
    const running = place({ id: 'jobs', startDate: '12. 7. 2026', endDate: '17. 10. 2026' })
    const endingSoon = place({ id: 'prace', startDate: '12. 7. 2026', endDate: '10. 10. 2026' })
    const ended = place({ id: 'career', startDate: '1. 6. 2026', endDate: '30. 9. 2026' })
    const never = place({ id: 'atmoskop' })

    expect(
      sortPlacesByOldestAdvertised([running, never, endingSoon, ended], now).map((item) => item.id),
    ).toEqual(['career', 'prace', 'jobs', 'atmoskop'])
  })
})

describe('resolveProlongConfirmLabel', () => {
  const running = place({ id: 'jobs', startDate: '12. 7. 2026', endDate: '17. 10. 2026' })
  const ended = place({ id: 'career', startDate: '12. 7. 2026', endDate: '30. 9. 2026' })
  const never = place({ id: 'atmoskop' })

  it('uses Prodloužit when every selected place is still running', () => {
    expect(resolveProlongConfirmLabel([running], now)).toBe('Prodloužit')
  })

  it('uses Znovuvystavit inzeráty when only ended or never-advertised places are selected', () => {
    expect(resolveProlongConfirmLabel([ended, never], now)).toBe('Znovuvystavit inzeráty')
  })

  it('uses Prodloužit a znovuvystavit when the selection mixes both actions', () => {
    expect(resolveProlongConfirmLabel([running, ended], now)).toBe('Prodloužit a znovuvystavit')
  })
})

describe('resolvePlaceRunStatus', () => {
  it('is never when there is no start date', () => {
    expect(resolvePlaceRunStatus(place(), now)).toBe('never')
  })

  it('is running when the end date is more than a week away', () => {
    expect(resolvePlaceRunStatus(place({ startDate: '12. 7. 2026', endDate: '17. 10. 2026' }), now)).toBe(
      'running',
    )
  })

  it('is ending soon within seven days', () => {
    expect(resolvePlaceRunStatus(place({ startDate: '12. 7. 2026', endDate: '10. 10. 2026' }), now)).toBe(
      'endingSoon',
    )
  })

  it('is ended after the end date', () => {
    expect(resolvePlaceRunStatus(place({ startDate: '12. 7. 2026', endDate: '30. 9. 2026' }), now)).toBe(
      'ended',
    )
  })
})

describe('placeStatusLabel', () => {
  it('uses the lowercase Czech labels', () => {
    expect(placeStatusLabel('running')).toBe('běží')
    expect(placeStatusLabel('endingSoon')).toBe('brzy končí')
    expect(placeStatusLabel('ended')).toBe('ukončeno')
    expect(placeStatusLabel('never')).toBe('–')
  })
})

describe('formatNewPeriod', () => {
  it('extends a running place from its current end date for 30 inclusive days', () => {
    expect(
      formatNewPeriod(place({ startDate: '12. 7. 2026', endDate: '17. 10. 2026' }), now),
    ).toEqual({
      kind: 'extend',
      title: 'Prodloužení o 30 dní.',
      range: 'Od 17.10.2026 do 15.11.2026',
    })
  })

  it('republishes an ended place from today for 30 inclusive days', () => {
    expect(
      formatNewPeriod(place({ startDate: '12. 7. 2026', endDate: '30. 9. 2026' }), now),
    ).toEqual({
      kind: 'republish',
      title: 'Na 30 dní',
      range: 'od 6.10.2026-4.11.2026',
    })
  })

  it('republishes a never-advertised place from today', () => {
    expect(formatNewPeriod(place(), now)).toEqual({
      kind: 'republish',
      title: 'Na 30 dní',
      range: 'od 6.10.2026-4.11.2026',
    })
  })
})
