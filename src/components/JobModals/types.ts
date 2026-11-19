import type { JobPortalLogoType } from '../JobPortalLogo'
import type { JobPublicationStatus } from '../JobShared/types'

export interface JobModalPublicationPlace {
  id: string
  name: string
  description?: string
  /** Missing or empty when the place was never advertised. */
  startDate?: string
  endDate?: string
  status?: JobPublicationStatus
  priceLabel?: string
  credits?: number
  logoType?: JobPortalLogoType
}

export interface JobPreviewPublication {
  id: string
  /** Portal name; used as accessible name and tooltip. */
  name: string
  /** Falls back to a logo resolved from `name`. */
  logoType?: JobPortalLogoType
  /** Public URL of the advertisement on this portal. */
  url: string
}

export interface JobModalAdvertisement {
  id: string
  title: string
  createdAt: string
}

export interface JobModalAdvertisementSection {
  advertisement: JobModalAdvertisement
  places: JobModalPublicationPlace[]
  additionalPlaces?: JobModalPublicationPlace[]
}
