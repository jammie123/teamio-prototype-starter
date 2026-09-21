import type { JobPortalLogoType } from '../JobPortalLogo'

export const ADVERTISEMENT_TIMELINE_EVENT_LABELS = {
  published: 'Vystavení inzerátu',
  topped: 'Topování inzerátu',
  ended: 'Ukončení vystavení',
  expired: 'Expirace inzerátu',
} as const

export const ADVERTISEMENT_TIMELINE_EMPTY_MESSAGE = 'Zatím tu není žádná historie inzerce.'
export const ADVERTISEMENT_TIMELINE_CYCLE_HEADING = 'Životní cyklus inzerátu'
export const ADVERTISEMENT_TIMELINE_ENDED_MANUAL_LABEL = 'Ukončeno mnou'
export const ADVERTISEMENT_TIMELINE_DETAIL_CLOSE_ARIA_LABEL = 'Zavřít detail'

export type AdvertisementTimelineEventType = keyof typeof ADVERTISEMENT_TIMELINE_EVENT_LABELS

export interface AdvertisementTimelineEvent {
  id: string
  type: AdvertisementTimelineEventType
  occurredAt: string
  cycleId: string
}

export type AdvertisementTimelineEndReason = 'manual' | 'expired'

export interface AdvertisementTimelineCycle {
  id: string
  portalName: string
  logoType: JobPortalLogoType
  publishedAt: string
  tops?: string[]
  endedAt?: string
  endedReason?: AdvertisementTimelineEndReason
}
