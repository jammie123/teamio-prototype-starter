import { describe, expect, it } from 'vitest'
import { isAdvertisementRunning } from './advertisementBatch'
import type { JobAdvertisement } from '../JobCardSynteza/types'

const running: JobAdvertisement = {
  id: 'ad-running',
  title: 'Hlavní inzerát',
  publications: [
    { id: 'jobs', channel: 'Jobs.cz', startDate: '12. 7. 2026', endDate: '30. 9. 2026' },
  ],
}

const mixed: JobAdvertisement = {
  id: 'ad-mixed',
  title: 'Inzerát pro brigádníky',
  publications: [
    { id: 'jobs', channel: 'Jobs.cz', startDate: '12. 7. 2026', endDate: '30. 9. 2026' },
    {
      id: 'career',
      channel: 'Kariérní stránky',
      status: 'expired',
      startDate: '12. 7. 2026',
      endDate: '1. 9. 2026',
    },
  ],
}

const ended: JobAdvertisement = {
  id: 'ad-ended',
  title: 'Ukončený inzerát',
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

describe('isAdvertisementRunning', () => {
  it('is true when any publication is still active', () => {
    expect(isAdvertisementRunning(running)).toBe(true)
    expect(isAdvertisementRunning(mixed)).toBe(true)
  })

  it('is false when every publication has expired or there are none', () => {
    expect(isAdvertisementRunning(ended)).toBe(false)
    expect(isAdvertisementRunning({ id: 'empty', publications: [] })).toBe(false)
    expect(isAdvertisementRunning({ id: 'missing' })).toBe(false)
  })
})
