import type { AdvertisementTimelineCycle, AdvertisementTimelineEvent } from './types'

export const sampleAdvertisementTimelineCycles: AdvertisementTimelineCycle[] = [
  {
    id: 'cycle-jobs-running',
    portalName: 'Jobs.cz',
    logoType: 'jobs-cz',
    publishedAt: '2026-06-01T08:00:00.000Z',
    tops: ['2026-06-22T12:32:00.000Z'],
  },
  {
    id: 'cycle-prace-ended',
    portalName: 'Prace.cz',
    logoType: 'prace-cz',
    publishedAt: '2026-03-01T08:00:00.000Z',
    endedAt: '2026-04-28T15:00:00.000Z',
    endedReason: 'manual',
  },
  {
    id: 'cycle-jobs-expired',
    portalName: 'Jobs.cz',
    logoType: 'jobs-cz',
    publishedAt: '2026-01-10T08:00:00.000Z',
    endedAt: '2026-02-28T22:59:00.000Z',
    endedReason: 'expired',
  },
]

export const sampleAdvertisementTimelineEvents: AdvertisementTimelineEvent[] = [
  {
    id: 'evt-topped-jobs',
    type: 'topped',
    occurredAt: '2026-06-22T12:32:00.000Z',
    cycleId: 'cycle-jobs-running',
  },
  {
    id: 'evt-published-jobs',
    type: 'published',
    occurredAt: '2026-06-01T08:00:00.000Z',
    cycleId: 'cycle-jobs-running',
  },
  {
    id: 'evt-ended-prace',
    type: 'ended',
    occurredAt: '2026-04-28T15:00:00.000Z',
    cycleId: 'cycle-prace-ended',
  },
  {
    id: 'evt-published-prace',
    type: 'published',
    occurredAt: '2026-03-01T08:00:00.000Z',
    cycleId: 'cycle-prace-ended',
  },
  {
    id: 'evt-expired-jobs',
    type: 'expired',
    occurredAt: '2026-02-28T22:59:00.000Z',
    cycleId: 'cycle-jobs-expired',
  },
  {
    id: 'evt-published-expired',
    type: 'published',
    occurredAt: '2026-01-10T08:00:00.000Z',
    cycleId: 'cycle-jobs-expired',
  },
]
