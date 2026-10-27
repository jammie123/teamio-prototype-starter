import { describe, expect, it } from 'vitest'
import type { JobAdvertisement } from '../JobCardSynteza/types'
import { buildSimplify25StatusBadges } from './jobCardSimplify25Presentation'

const now = new Date(2026, 9, 23)

const running: JobAdvertisement = {
  id: 'running',
  publications: [
    { id: 'jobs', channel: 'Jobs.cz', startDate: '1. 10. 2026', endDate: '14. 11. 2026' },
    { id: 'prace', channel: 'Prace.cz', startDate: '1. 10. 2026', endDate: '14. 11. 2026' },
  ],
}

const runningWithCareer: JobAdvertisement = {
  id: 'running-career',
  publications: [
    { id: 'jobs', channel: 'Jobs.cz', startDate: '1. 10. 2026', endDate: '14. 11. 2026' },
    { id: 'prace', channel: 'Prace.cz', startDate: '1. 10. 2026', endDate: '14. 11. 2026' },
    { id: 'career', channel: 'Kariérní stránky', startDate: '1. 10. 2026' },
  ],
}

const fiveRunning: JobAdvertisement = {
  id: 'five-running',
  publications: [
    { id: 'prace', channel: 'Prace.cz', startDate: '1. 10. 2026', endDate: '14. 11. 2026' },
    { id: 'jobs', channel: 'Jobs.cz', startDate: '1. 10. 2026', endDate: '14. 11. 2026' },
    { id: 'career', channel: 'Kariérní stránky', startDate: '1. 10. 2026' },
    { id: 'atmoskop', channel: 'Atmoskop', startDate: '1. 10. 2026', endDate: '14. 11. 2026' },
    { id: 'rohem', channel: 'Práce za rohem', startDate: '1. 10. 2026', endDate: '14. 11. 2026' },
  ],
}

const partial: JobAdvertisement = {
  id: 'partial',
  publications: [
    { id: 'jobs', channel: 'Jobs.cz', startDate: '12. 7. 2026', endDate: '14. 11. 2026' },
    {
      id: 'prace',
      channel: 'Prace.cz',
      status: 'expired',
      startDate: '12. 6. 2026',
      endDate: '20. 10. 2026',
    },
  ],
}

const endingSoonAndRunning: JobAdvertisement = {
  id: 'ending-soon-running',
  publications: [
    { id: 'jobs', channel: 'Jobs.cz', startDate: '12. 7. 2026', endDate: '27. 10. 2026' },
    { id: 'prace', channel: 'Prace.cz', startDate: '12. 7. 2026', endDate: '14. 11. 2026' },
  ],
}

const runningEndingSoonAndEnded: JobAdvertisement = {
  id: 'all-three',
  publications: [
    { id: 'jobs', channel: 'Jobs.cz', startDate: '12. 7. 2026', endDate: '27. 10. 2026' },
    { id: 'prace', channel: 'Prace.cz', startDate: '12. 7. 2026', endDate: '14. 11. 2026' },
    {
      id: 'atmoskop',
      channel: 'Atmoskop',
      status: 'expired',
      startDate: '12. 6. 2026',
      endDate: '20. 10. 2026',
    },
  ],
}

const ended: JobAdvertisement = {
  id: 'ended',
  publications: [
    {
      id: 'jobs',
      channel: 'Jobs.cz',
      status: 'expired',
      startDate: '1. 6. 2026',
      endDate: '10. 10. 2026',
    },
    {
      id: 'prace',
      channel: 'Prace.cz',
      status: 'expired',
      startDate: '1. 6. 2026',
      endDate: '10. 10. 2026',
    },
    {
      id: 'career',
      channel: 'Kariérní stránky',
      status: 'expired',
      startDate: '1. 6. 2026',
      endDate: '10. 10. 2026',
    },
  ],
}

describe('buildSimplify25StatusBadges', () => {
  it('returns a success running badge for fully running ads', () => {
    expect(buildSimplify25StatusBadges(running, now)).toEqual([
      {
        kind: 'running',
        label: '2 portály běží',
        color: 'success',
        testId: 'job-card-simplify25-running-badge',
      },
    ])
  })

  it('counts career web as a running portal', () => {
    expect(buildSimplify25StatusBadges(runningWithCareer, now)).toEqual([
      {
        kind: 'running',
        label: '3 portály běží',
        color: 'success',
        testId: 'job-card-simplify25-running-badge',
      },
    ])
  })

  it('uses the 5+ running plural', () => {
    expect(buildSimplify25StatusBadges(fiveRunning, now)[0]).toMatchObject({
      kind: 'running',
      label: '5 portálů běží',
    })
  })

  it('uses the 1 running singular', () => {
    expect(
      buildSimplify25StatusBadges(
        {
          id: 'one',
          publications: [
            { id: 'jobs', channel: 'Jobs.cz', startDate: '1. 10. 2026', endDate: '14. 11. 2026' },
          ],
        },
        now,
      ),
    ).toEqual([
      {
        kind: 'running',
        label: '1 portál běží',
        color: 'success',
        testId: 'job-card-simplify25-running-badge',
      },
    ])
  })

  it('combines running and ended badges', () => {
    expect(buildSimplify25StatusBadges(partial, now)).toEqual([
      {
        kind: 'running',
        label: '1 portál běží',
        color: 'success',
        testId: 'job-card-simplify25-running-badge',
      },
      {
        kind: 'ended',
        label: '1 portál ukončen',
        color: 'neutral',
        testId: 'job-card-simplify25-ended-badge',
      },
    ])
  })

  it('combines running and ending-soon badges', () => {
    expect(buildSimplify25StatusBadges(endingSoonAndRunning, now)).toEqual([
      {
        kind: 'running',
        label: '1 portál běží',
        color: 'success',
        testId: 'job-card-simplify25-running-badge',
      },
      {
        kind: 'endingSoon',
        label: '1 brzy skončí',
        color: 'warning',
        testId: 'job-card-simplify25-ending-soon-badge',
      },
    ])
  })

  it('combines running, ending-soon and ended badges in that order', () => {
    expect(buildSimplify25StatusBadges(runningEndingSoonAndEnded, now)).toEqual([
      {
        kind: 'running',
        label: '1 portál běží',
        color: 'success',
        testId: 'job-card-simplify25-running-badge',
      },
      {
        kind: 'endingSoon',
        label: '1 brzy skončí',
        color: 'warning',
        testId: 'job-card-simplify25-ending-soon-badge',
      },
      {
        kind: 'ended',
        label: '1 portál ukončen',
        color: 'neutral',
        testId: 'job-card-simplify25-ended-badge',
      },
    ])
  })

  it('returns only the existing ended label when every paid portal ended', () => {
    expect(buildSimplify25StatusBadges(ended, now)).toEqual([
      {
        kind: 'ended',
        label: '2 portály ukončeny',
        color: 'neutral',
        testId: 'job-card-simplify25-ended-badge',
      },
    ])
  })

  it('returns no badges when there are no publications', () => {
    expect(buildSimplify25StatusBadges({ id: 'empty', publications: [] }, now)).toEqual([])
  })
})
