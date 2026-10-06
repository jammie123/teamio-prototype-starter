import type { JobPortalLogoType } from '../JobPortalLogo'
import type { JobPublicationStatus } from '../JobCardSynteza/types'

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
