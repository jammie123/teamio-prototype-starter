import type { JobModalAdvertisement, JobModalPublicationPlace } from './types'

export const samplePlaces: JobModalPublicationPlace[] = [
  {
    id: 'jobs',
    name: 'Jobs.cz',
    description: 'Inzerát na hlavní pracovní portál',
    startDate: '12. 7. 2026',
    endDate: '30. 9. 2026',
    priceLabel: '1 290 Kč',
    credits: 12,
  },
  {
    id: 'prace',
    name: 'Prace.cz',
    description: 'Doplňkové vystavení na Prace.cz',
    startDate: '12. 7. 2026',
    endDate: '30. 9. 2026',
    credits: 8,
  },
  {
    id: 'career',
    name: 'Kariérní stránky',
    description: 'Vlastní kariérní stránky společnosti',
    startDate: '12. 7. 2026',
    endDate: '30. 9. 2026',
    priceLabel: 'zdarma',
  },
]

export const creditsOnlyPlaces: JobModalPublicationPlace[] = [
  {
    id: 'jobs',
    name: 'Jobs.cz',
    description: 'Platba kredity Teamio',
    startDate: '12. 7. 2026',
    endDate: '30. 9. 2026',
    credits: 12,
  },
  {
    id: 'prace',
    name: 'Prace.cz',
    description: 'Platba kredity Teamio',
    startDate: '12. 7. 2026',
    endDate: '30. 9. 2026',
    credits: 8,
  },
]

export const singlePlace: JobModalPublicationPlace[] = [
  {
    id: 'jobs',
    name: 'Jobs.cz',
    description: 'Inzerát na hlavní pracovní portál',
    startDate: '12. 7. 2026',
    endDate: '30. 9. 2026',
    priceLabel: '1 290 Kč',
  },
]

export const additionalPlaces: JobModalPublicationPlace[] = [
  {
    id: 'atmoskop',
    name: 'Atmoskop',
    description: 'Nové místo vystavení',
    startDate: '12. 7. 2026',
    endDate: '30. 9. 2026',
    credits: 3,
  },
  {
    id: 'profesia',
    name: 'Profesia',
    description: 'Nové místo vystavení',
    startDate: '12. 7. 2026',
    endDate: '30. 9. 2026',
    priceLabel: '890 Kč',
  },
  {
    id: 'nearby',
    name: 'Práce za rohem',
    description: 'Nové místo vystavení',
    startDate: '12. 7. 2026',
    endDate: '30. 9. 2026',
    credits: 2,
  },
]

export const longPlaceList: JobModalPublicationPlace[] = [
  ...samplePlaces,
  {
    id: 'atmoskop',
    name: 'Atmoskop',
    startDate: '12. 7. 2026',
    endDate: '30. 9. 2026',
    credits: 3,
  },
  {
    id: 'profesia',
    name: 'Profesia',
    startDate: '12. 7. 2026',
    endDate: '30. 9. 2026',
    priceLabel: '890 Kč',
  },
  {
    id: 'nearby',
    name: 'Práce za rohem',
    startDate: '12. 7. 2026',
    endDate: '30. 9. 2026',
    credits: 2,
  },
  {
    id: 'teamio',
    name: 'Teamio',
    startDate: '12. 7. 2026',
    endDate: '30. 9. 2026',
    priceLabel: 'zdarma',
  },
  {
    id: 'export',
    name: 'Export',
    startDate: '12. 7. 2026',
    endDate: '30. 9. 2026',
    credits: 1,
  },
]

export const sampleAdvertisements: JobModalAdvertisement[] = [
  { id: 'ad-1', title: 'Hlavní inzerát', createdAt: '12. 3. 2026' },
  { id: 'ad-2', title: 'Inzerát pro brigádníky', createdAt: '20. 4. 2026' },
  { id: 'ad-3', title: 'Ukončený inzerát', createdAt: '2. 1. 2026' },
]

export const placesByAdvertisementId: Record<string, JobModalPublicationPlace[]> = {
  'ad-1': samplePlaces,
  'ad-2': singlePlace.map((place) => ({ ...place, id: `ad-2-${place.id}` })),
  'ad-3': creditsOnlyPlaces.map((place) => ({ ...place, id: `ad-3-${place.id}` })),
}
