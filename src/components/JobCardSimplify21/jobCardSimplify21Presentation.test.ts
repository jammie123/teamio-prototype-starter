import { describe, expect, it } from 'vitest'
import type { JobAdvertisement } from '../JobCardSynteza/types'
import {
  buildSimplify21StatusHeading,
  resolveSimplify21EndedPortalLabel,
} from './jobCardSimplify21Presentation'

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

describe('jobCardSimplify21Presentation', () => {
  it('uses simplify21 test ids', () => {
    expect(buildSimplify21StatusHeading(running, now)?.testId).toBe(
      'job-card-simplify21-running-heading',
    )
  })

  it('has no ended-portal label for fully running ads', () => {
    const heading = buildSimplify21StatusHeading(running, now)!
    expect(resolveSimplify21EndedPortalLabel(running, heading, now)).toBeUndefined()
  })

  it('labels ended portals for partially running ads', () => {
    const heading = buildSimplify21StatusHeading(partial, now)!
    expect(heading.kind).toBe('partial')
    expect(resolveSimplify21EndedPortalLabel(partial, heading, now)).toBe('1 portál ukončen')
  })

  it('labels ended portals when ending soon', () => {
    const heading = buildSimplify21StatusHeading(endingSoonWithEnded, now)!
    expect(heading.kind).toBe('endingSoon')
    expect(resolveSimplify21EndedPortalLabel(endingSoonWithEnded, heading, now)).toBe(
      '1 portál ukončen',
    )
  })
})
