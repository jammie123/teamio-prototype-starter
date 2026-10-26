import { describe, expect, it } from 'vitest'
import type { JobAdvertisement } from '../JobCardSynteza/types'
import {
  buildSimplify22StatusHeading,
  daysSinceAdvertisementEnded,
  resolveSimplify22EndedPortalLabel,
  SIMPLIFY_22_ENDED_OLD_CLASS,
  SIMPLIFY_22_ENDED_RECENT_CLASS,
} from './jobCardSimplify22Presentation'

const now = new Date(2026, 9, 23)

const running: JobAdvertisement = {
  id: 'running',
  publications: [
    { id: 'jobs', channel: 'Jobs.cz', startDate: '1. 10. 2026', endDate: '14. 11. 2026' },
    { id: 'prace', channel: 'Prace.cz', startDate: '1. 10. 2026', endDate: '14. 11. 2026' },
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

const endingSoonWithEnded: JobAdvertisement = {
  id: 'ending-soon',
  publications: [
    { id: 'jobs', channel: 'Jobs.cz', startDate: '12. 7. 2026', endDate: '27. 10. 2026' },
    {
      id: 'prace',
      channel: 'Prace.cz',
      status: 'expired',
      startDate: '12. 6. 2026',
      endDate: '20. 10. 2026',
    },
  ],
}

function endedOn(endDate: string, extraEndDate?: string): JobAdvertisement {
  return {
    id: `ended-${endDate}`,
    publications: [
      { id: 'jobs', channel: 'Jobs.cz', status: 'expired', startDate: '1. 6. 2026', endDate },
      ...(extraEndDate
        ? [
            {
              id: 'prace',
              channel: 'Prace.cz',
              status: 'expired' as const,
              startDate: '1. 6. 2026',
              endDate: extraEndDate,
            },
          ]
        : []),
    ],
  }
}

describe('jobCardSimplify22Presentation', () => {
  it('uses simplify22 test ids', () => {
    expect(buildSimplify22StatusHeading(running, now)?.testId).toBe(
      'job-card-simplify22-running-heading',
    )
  })

  it('uses the success token for the partially running heading', () => {
    const heading = buildSimplify22StatusHeading(partial, now)!
    expect(heading.kind).toBe('partial')
    expect(heading.className).toBe('tm-text-emotion-success-emphasis')
  })

  it('has no ended-portal label for fully running ads', () => {
    const heading = buildSimplify22StatusHeading(running, now)!
    expect(resolveSimplify22EndedPortalLabel(running, heading, now)).toBeUndefined()
  })

  it('labels ended portals for partially running ads', () => {
    const heading = buildSimplify22StatusHeading(partial, now)!
    expect(heading.kind).toBe('partial')
    expect(resolveSimplify22EndedPortalLabel(partial, heading, now)).toBe('1 portál ukončen')
  })

  it('labels ended portals when ending soon', () => {
    const heading = buildSimplify22StatusHeading(endingSoonWithEnded, now)!
    expect(heading.kind).toBe('endingSoon')
    expect(resolveSimplify22EndedPortalLabel(endingSoonWithEnded, heading, now)).toBe(
      '1 portál ukončen',
    )
  })

  describe('ended heading tone', () => {
    it('counts days since the latest ended portal', () => {
      expect(daysSinceAdvertisementEnded(endedOn('10. 10. 2026', '20. 10. 2026'), now)).toBe(3)
      expect(daysSinceAdvertisementEnded(running, now)).toBeUndefined()
    })

    it('is red when ended today or up to 5 days ago', () => {
      expect(buildSimplify22StatusHeading(endedOn('23. 10. 2026'), now)?.className).toBe(
        SIMPLIFY_22_ENDED_RECENT_CLASS,
      )
      expect(buildSimplify22StatusHeading(endedOn('18. 10. 2026'), now)?.className).toBe(
        SIMPLIFY_22_ENDED_RECENT_CLASS,
      )
    })

    it('is gray when ended more than 5 days ago', () => {
      expect(buildSimplify22StatusHeading(endedOn('17. 10. 2026'), now)?.className).toBe(
        SIMPLIFY_22_ENDED_OLD_CLASS,
      )
    })

    it('uses the most recently ended portal', () => {
      const heading = buildSimplify22StatusHeading(endedOn('1. 10. 2026', '21. 10. 2026'), now)
      expect(heading?.className).toBe(SIMPLIFY_22_ENDED_RECENT_CLASS)
    })

    it('leaves non-ended headings untouched', () => {
      expect(buildSimplify22StatusHeading(running, now)?.className).toBe(
        'tm-text-emotion-success-emphasis',
      )
    })
  })
})
