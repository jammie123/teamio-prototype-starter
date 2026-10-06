import { describe, expect, it } from 'vitest'
import {
  formatPlacesSummary,
  formatTotalCostLabel,
  parsePlacePriceCzk,
  summarizeSelectedPlaces,
} from './jobModalSummary'
import type { JobModalAdvertisementSection, JobModalPublicationPlace } from './types'

function place(overrides: Partial<JobModalPublicationPlace> = {}): JobModalPublicationPlace {
  return {
    id: 'jobs',
    name: 'Jobs.cz',
    ...overrides,
  }
}

describe('parsePlacePriceCzk', () => {
  it('reads a spaced Czech amount and treats zdarma as zero', () => {
    expect(parsePlacePriceCzk(place({ priceLabel: '1 290 Kč' }))).toBe(1290)
    expect(parsePlacePriceCzk(place({ priceLabel: 'zdarma' }))).toBe(0)
    expect(parsePlacePriceCzk(place())).toBe(0)
  })
})

describe('formatPlacesSummary', () => {
  it('omits Inzerátů when only one advertisement is selected', () => {
    expect(
      formatPlacesSummary({
        advertisementCount: 1,
        placementCount: 7,
        totalCzk: 25100,
        totalCredits: 0,
      }),
    ).toBe('vystavení 7 · celkem 25 100 Kč')
  })

  it('includes Inzerátů when more advertisements are selected', () => {
    expect(
      formatPlacesSummary({
        advertisementCount: 3,
        placementCount: 7,
        totalCzk: 25100,
        totalCredits: 12,
      }),
    ).toBe('Inzerátů 3 · vystavení 7 · celkem 25 100 Kč / 12 kreditů')
  })

  it('uses credits alone when there is no Kč total', () => {
    expect(formatTotalCostLabel(0, 8)).toBe('celkem 8 kreditů')
  })
})

describe('summarizeSelectedPlaces', () => {
  const sections: JobModalAdvertisementSection[] = [
    {
      advertisement: { id: 'ad-1', title: 'Hlavní inzerát', createdAt: '12. 3. 2026' },
      places: [place({ id: 'jobs', priceLabel: '1 290 Kč', credits: 4 })],
      additionalPlaces: [place({ id: 'atmoskop', credits: 3 })],
    },
    {
      advertisement: { id: 'ad-2', title: 'Brigády', createdAt: '20. 4. 2026' },
      places: [place({ id: 'ad-2-jobs', priceLabel: '890 Kč' })],
    },
  ]

  it('counts only selected advertisements, vystavení and money', () => {
    expect(summarizeSelectedPlaces(sections, ['jobs', 'atmoskop', 'ad-2-jobs'])).toEqual({
      advertisementCount: 2,
      placementCount: 3,
      totalCzk: 2180,
      totalCredits: 7,
    })
  })

  it('drops an advertisement that has no selected vystavení', () => {
    expect(summarizeSelectedPlaces(sections, ['jobs']).advertisementCount).toBe(1)
  })
})
