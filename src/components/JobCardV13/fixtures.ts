import type { JobAdvertisement, JobCardNote, JobPublication } from './types'

/** Shared story data for the JobCardV13 family. */

export const recruitmentNote: JobCardNote = {
  author: 'Petra Nováková',
  text: 'Čekáme na schválení rozpočtu, start až od října',
  addedAt: '12. 9. 2026',
}

export function daysFromNow(days: number) {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return `${date.getDate()}. ${date.getMonth() + 1}. ${date.getFullYear()}`
}

export function portal(
  partial: Partial<JobPublication> & Pick<JobPublication, 'id' | 'channel'>,
): JobPublication {
  return { startDate: '1. 1. 2026', viewCount: 1000, ...partial }
}

export const runningSame: JobAdvertisement = {
  id: 'ad-running-same',
  publications: [
    portal({ id: 'jobs', channel: 'Jobs.cz', endDate: '1. 2. 2026', viewCount: 1840 }),
    portal({ id: 'prace', channel: 'Prace.cz', endDate: '1. 2. 2026', viewCount: 920 }),
    portal({ id: 'career', channel: 'Kariérní stránky', endDate: '1. 2. 2026', viewCount: 410 }),
  ],
}

export const runningDifferent: JobAdvertisement = {
  id: 'ad-running-diff',
  publications: [
    portal({
      id: 'jobs',
      channel: 'Jobs.cz',
      startDate: '1. 9. 2026',
      endDate: '30. 9. 2026',
      viewCount: 1840,
    }),
    portal({
      id: 'prace',
      channel: 'Prace.cz',
      startDate: '15. 9. 2026',
      endDate: '15. 10. 2026',
      viewCount: 920,
    }),
    portal({
      id: 'career',
      channel: 'Kariérní stránky',
      startDate: '',
      endDate: '1. 11. 2026',
      viewCount: 410,
    }),
  ],
}

export const mixedEndedPortal: JobAdvertisement = {
  id: 'ad-mixed',
  publications: [
    portal({
      id: 'jobs',
      channel: 'Jobs.cz',
      startDate: '1. 9. 2026',
      endDate: '30. 9. 2026',
      viewCount: 1840,
    }),
    portal({
      id: 'prace',
      channel: 'Prace.cz',
      status: 'expired',
      startDate: '1. 8. 2026',
      endDate: '15. 8. 2026',
      viewCount: 920,
    }),
    portal({
      id: 'career',
      channel: 'Kariérní stránky',
      startDate: '1. 9. 2026',
      endDate: '30. 9. 2026',
      viewCount: 410,
    }),
  ],
}

export const endedSame: JobAdvertisement = {
  id: 'ad-ended',
  publications: [
    portal({
      id: 'jobs',
      channel: 'Jobs.cz',
      status: 'expired',
      endDate: '1. 1. 2026',
      viewCount: 1840,
    }),
    portal({
      id: 'prace',
      channel: 'Prace.cz',
      status: 'expired',
      endDate: '1. 1. 2026',
      viewCount: 920,
    }),
    portal({
      id: 'career',
      channel: 'Kariérní stránky',
      status: 'expired',
      endDate: '1. 1. 2026',
      viewCount: 410,
    }),
  ],
}

export const endingSoonSame: JobAdvertisement = {
  id: 'ad-ending-soon',
  publications: [
    portal({
      id: 'jobs',
      channel: 'Jobs.cz',
      startDate: '1. 9. 2026',
      endDate: daysFromNow(3),
      viewCount: 1840,
    }),
    portal({
      id: 'prace',
      channel: 'Prace.cz',
      startDate: '1. 9. 2026',
      endDate: daysFromNow(3),
      viewCount: 920,
    }),
    portal({
      id: 'career',
      channel: 'Kariérní stránky',
      startDate: '1. 9. 2026',
      endDate: daysFromNow(3),
      viewCount: 410,
    }),
  ],
}

export const notPublished: JobAdvertisement = {
  id: 'ad-not-published',
  publications: [],
}

export const withHighlights: JobAdvertisement = {
  id: 'ad-highlights',
  publications: [
    {
      id: 'jobs',
      channel: 'Jobs.cz',
      startDate: '1. 1. 2026',
      endDate: '1. 2. 2026',
      viewCount: 1840,
      reactionCount: 34,
      highlights: [
        {
          id: 'jobs-jobstip',
          name: 'Jobstip',
          startDate: '8. 6.',
          endDate: '30. 9. 2026',
          viewCount: 699,
          reactionCount: 13,
        },
        {
          id: 'jobs-top',
          name: 'Topováno',
          startDate: '22. 6.',
          endDate: '30. 9. 2026',
          viewCount: 331,
          reactionCount: 6,
        },
      ],
    },
    portal({
      id: 'prace',
      channel: 'Prace.cz',
      endDate: '1. 2. 2026',
      viewCount: 920,
      reactionCount: 15,
    }),
    portal({
      id: 'career',
      channel: 'Kariérní stránky',
      endDate: '1. 2. 2026',
      viewCount: 410,
      reactionCount: 8,
    }),
  ],
}
