import type { JobPortalLogoType } from '../JobPortalLogo'

export interface JobModalPublicationPlace {
  id: string
  name: string
  description?: string
  startDate: string
  endDate?: string
  priceLabel?: string
  credits?: number
  logoType?: JobPortalLogoType
}

export interface JobModalAdvertisement {
  id: string
  title: string
  createdAt: string
}
