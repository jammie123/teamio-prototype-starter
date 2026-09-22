import { describe, expect, it } from 'vitest'
import { countRunningAdvertisements, formatRunningAdsLabel } from './formatRunningAdsLabel'
import type { JobAdvertisement } from '../JobCardSynteza/types'

const running: JobAdvertisement = {
  id: 'ad-running',
  publications: [
    { id: 'jobs', channel: 'Jobs.cz', startDate: '12. 7. 2026', endDate: '30. 9. 2026' },
  ],
}

const ended: JobAdvertisement = {
  id: 'ad-ended',
  publications: [
    {
      id: 'jobs',
      channel: 'Jobs.cz',
      status: 'expired',
      startDate: '12. 6. 2026',
      endDate: '1. 9. 2026',
    },
  ],
}

describe('formatRunningAdsLabel', () => {
  it('returns null when no advertisements are running', () => {
    expect(formatRunningAdsLabel(0)).toBeNull()
  })

  it('uses Czech plural forms for the running-ad count', () => {
    expect(formatRunningAdsLabel(1)).toBe('1 běžící inzerát')
    expect(formatRunningAdsLabel(2)).toBe('2 běžící inzeráty')
    expect(formatRunningAdsLabel(4)).toBe('4 běžící inzeráty')
    expect(formatRunningAdsLabel(5)).toBe('5 běžících inzerátů')
  })
})

describe('countRunningAdvertisements', () => {
  it('counts only advertisements with an active publication', () => {
    expect(countRunningAdvertisements([running, running, ended])).toBe(2)
    expect(countRunningAdvertisements([ended])).toBe(0)
    expect(countRunningAdvertisements([])).toBe(0)
  })
})
