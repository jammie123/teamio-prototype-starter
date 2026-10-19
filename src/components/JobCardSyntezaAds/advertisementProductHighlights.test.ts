import { describe, expect, it } from 'vitest'
import type { JobPublication } from '../JobCardSynteza/types'
import {
  collectProductHighlights,
  isProductHighlight,
  JOB_CARD_PRODUCT_HIGHLIGHTS_HEADING,
} from './advertisementProductHighlights'

describe('advertisementProductHighlights', () => {
  it('exports the product section heading', () => {
    expect(JOB_CARD_PRODUCT_HIGHLIGHTS_HEADING).toBe('Zvýraznění inzerátu')
  })

  it('detects product highlights by kind or legacy name', () => {
    expect(isProductHighlight({ id: 'a', name: 'Jobstip', kind: 'jobstip', startDate: '1. 1.' })).toBe(
      true,
    )
    expect(
      isProductHighlight({ id: 'b', name: 'Supermax', kind: 'supermax', startDate: '1. 1.' }),
    ).toBe(true)
    expect(isProductHighlight({ id: 'c', name: 'Jobstip', startDate: '1. 1.' })).toBe(true)
    expect(isProductHighlight({ id: 'd', name: 'Topováno', kind: 'top', startDate: '1. 1.' })).toBe(
      false,
    )
  })

  it('collects visible Jobstip and Supermax from active publications', () => {
    const publications: JobPublication[] = [
      {
        id: 'jobs',
        channel: 'Jobs.cz',
        startDate: '12. 7. 2026',
        endDate: '30. 10. 2026',
        highlights: [
          { id: 'jobstip', name: 'Jobstip', kind: 'jobstip', startDate: '8. 6. 2026', endDate: '30. 10. 2026' },
          { id: 'top', name: 'Top', kind: 'top', startDate: '8. 6. 2026', endDate: '30. 10. 2026' },
        ],
      },
      {
        id: 'prace',
        channel: 'Prace.cz',
        status: 'expired',
        startDate: '12. 7. 2026',
        endDate: '1. 9. 2026',
        highlights: [
          { id: 'supermax', name: 'Supermax', kind: 'supermax', startDate: '8. 6. 2026', endDate: '30. 10. 2026' },
        ],
      },
    ]

    const entries = collectProductHighlights(publications)
    expect(entries).toHaveLength(1)
    expect(entries[0].highlight.name).toBe('Jobstip')
  })
})
