import { describe, expect, it } from 'vitest'
import { buildAdvertiseDisappearanceNotice } from './jobCardV3Presentation'
import type { JobAdvertisement, JobPublication } from './types'

const now = new Date(2026, 8, 27)

function portal(
  partial: Partial<JobPublication> & Pick<JobPublication, 'id' | 'channel'>,
): JobPublication {
  return { startDate: '1. 9. 2026', viewCount: 100, ...partial }
}

function advertisement(publications: JobPublication[]): JobAdvertisement {
  return { id: 'ad', publications }
}

describe('buildAdvertiseDisappearanceNotice', () => {
  it('describes the shared end date and every live channel', () => {
    const notice = buildAdvertiseDisappearanceNotice(
      advertisement([
        portal({ id: 'jobs', channel: 'Jobs.cz', endDate: '30. 9. 2026' }),
        portal({ id: 'prace', channel: 'Prace.cz', endDate: '30. 9. 2026' }),
        portal({ id: 'career', channel: 'Kariérní stránky', endDate: '30. 9. 2026' }),
      ]),
      now,
    )

    expect(notice?.message).toBe('Po 30. 9. zmizí inzerát ze všech tří kanálů.')
  })

  it('counts only channels that are still live', () => {
    const notice = buildAdvertiseDisappearanceNotice(
      advertisement([
        portal({ id: 'jobs', channel: 'Jobs.cz', endDate: '30. 9. 2026' }),
        portal({
          id: 'prace',
          channel: 'Prace.cz',
          status: 'expired',
          endDate: '15. 8. 2026',
        }),
      ]),
      now,
    )

    expect(notice?.message).toBe('Po 30. 9. zmizí inzerát z jediného kanálu.')
  })

  it('stays hidden while the advertisement is still running', () => {
    expect(
      buildAdvertiseDisappearanceNotice(
        advertisement([
          portal({ id: 'jobs', channel: 'Jobs.cz', endDate: '1. 2. 2026' }),
          portal({ id: 'prace', channel: 'Prace.cz', endDate: '1. 2. 2026' }),
        ]),
        now,
      ),
    ).toBeUndefined()
  })
})
