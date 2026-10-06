import type { JobModalAdvertisementSection, JobModalPublicationPlace } from './types'

export function parsePlacePriceCzk(place: JobModalPublicationPlace) {
  const label = place.priceLabel?.trim()
  if (!label || /^zdarma$/i.test(label)) {
    return 0
  }

  const match = label.replace(/\s/g, '').match(/(\d+(?:[.,]\d+)?)/)
  if (!match) {
    return 0
  }

  return Number(match[1].replace(',', '.'))
}

export function formatCzechNumber(value: number) {
  return Math.round(value).toLocaleString('cs-CZ').replace(/\u00a0/g, ' ')
}

export function formatCreditsLabel(credits: number) {
  return `${credits} kreditů`
}

export function formatTotalCostLabel(totalCzk: number, totalCredits: number) {
  const parts: string[] = []

  if (totalCzk > 0) {
    parts.push(`${formatCzechNumber(totalCzk)} Kč`)
  }

  if (totalCredits > 0) {
    parts.push(formatCreditsLabel(totalCredits))
  }

  return `celkem ${parts.join(' / ') || '0 Kč'}`
}

export function formatPlacesSummary({
  advertisementCount,
  placementCount,
  totalCzk,
  totalCredits,
  hideCost = false,
}: {
  advertisementCount: number
  placementCount: number
  totalCzk: number
  totalCredits: number
  hideCost?: boolean
}) {
  const parts: string[] = []

  if (advertisementCount > 1) {
    parts.push(`Inzerátů ${advertisementCount}`)
  }

  parts.push(`vystavení ${placementCount}`)

  if (!hideCost) {
    parts.push(formatTotalCostLabel(totalCzk, totalCredits))
  }

  return parts.join(' · ')
}

export function summarizeSelectedPlaces(
  sections: JobModalAdvertisementSection[],
  selectedIds: string[],
) {
  const selectedBySection = sections.map((section) => {
    const places = [...section.places, ...(section.additionalPlaces ?? [])]
    return places.filter((place) => selectedIds.includes(place.id))
  })
  const selectedPlaces = selectedBySection.flat()

  return {
    advertisementCount: selectedBySection.filter((places) => places.length > 0).length,
    placementCount: selectedPlaces.length,
    totalCzk: selectedPlaces.reduce((sum, place) => sum + parsePlacePriceCzk(place), 0),
    totalCredits: selectedPlaces.reduce((sum, place) => sum + (place.credits ?? 0), 0),
  }
}
