import { describe, expect, it } from 'vitest'
import type { JobAdvertisement } from '../JobCardSynteza/types'
import { resolveJobCardSimplify10PanelMode } from './jobCardSimplify10Presentation'

const now = new Date('2026-10-22T12:00:00')

describe('resolveJobCardSimplify10PanelMode', () => {
  it('returns notAdvertising when advertisement status is notAdvertising', () => {
    const advertisement: JobAdvertisement = {
      id: 'ad-1',
      status: 'notAdvertising',
      publications: [{ id: 'jobs', channel: 'Jobs.cz', status: 'expired', startDate: '1. 1.', endDate: '1. 9. 2026' }],
    }

    expect(resolveJobCardSimplify10PanelMode(advertisement, now)).toBe('notAdvertising')
  })

  it('returns expiredUnexpected when every portal expired', () => {
    const advertisement: JobAdvertisement = {
      id: 'ad-1',
      publications: [
        { id: 'jobs', channel: 'Jobs.cz', status: 'expired', startDate: '1. 6.', endDate: '20. 10. 2026' },
        { id: 'prace', channel: 'Prace.cz', status: 'expired', startDate: '1. 6.', endDate: '20. 10. 2026' },
      ],
    }

    expect(resolveJobCardSimplify10PanelMode(advertisement, now)).toBe('expiredUnexpected')
  })

  it('returns endingSoon when all active portals share an ending-soon date', () => {
    const advertisement: JobAdvertisement = {
      id: 'ad-1',
      publications: [
        { id: 'jobs', channel: 'Jobs.cz', startDate: '12. 7. 2026', endDate: '27. 10. 2026' },
        { id: 'prace', channel: 'Prace.cz', startDate: '12. 7. 2026', endDate: '27. 10. 2026' },
      ],
    }

    expect(resolveJobCardSimplify10PanelMode(advertisement, now)).toBe('endingSoon')
  })

  it('returns fallback for mixed running and expired portals', () => {
    const advertisement: JobAdvertisement = {
      id: 'ad-1',
      publications: [
        { id: 'jobs', channel: 'Jobs.cz', startDate: '12. 7. 2026', endDate: '30. 9. 2026' },
        { id: 'prace', channel: 'Prace.cz', status: 'expired', startDate: '12. 6.', endDate: '1. 9. 2026' },
      ],
    }

    expect(resolveJobCardSimplify10PanelMode(advertisement, now)).toBe('fallback')
  })
})
