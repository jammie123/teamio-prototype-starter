import { describe, expect, it } from 'vitest'
import type { JobAdvertisement, JobPublication } from '../JobCardSynteza/types'
import {
  buildSimplify14v2HeaderBadges,
  buildSimplify14v2Heading,
  buildSimplify14v2StripGroups,
  formatSimplify14v2SamePeriodRange,
  resolveJobCardSimplify14v2PanelMode,
  resolveSimplify14v2ChannelDateLabelTone,
  shouldShowPerChannelDateLabels,
  shouldShowSimplify14v2SamePeriodRange,
} from './jobCardSimplify14v2Presentation'

const NOW = new Date(2026, 9, 27)

function publication(
  partial: Partial<JobPublication> & Pick<JobPublication, 'id' | 'channel'>,
): JobPublication {
  return { startDate: '1. 10. 2026', ...partial }
}

function advertisement(publications: JobPublication[]): JobAdvertisement {
  return { id: 'ad', publications }
}

describe('resolveJobCardSimplify14v2PanelMode', () => {
  it('uses running when live portals share one period that is not ending soon', () => {
    expect(
      resolveJobCardSimplify14v2PanelMode(
        advertisement([
          publication({ id: 'jobs', channel: 'Jobs.cz', endDate: '14. 11. 2026' }),
          publication({ id: 'prace', channel: 'Prace.cz', endDate: '14. 11. 2026' }),
        ]),
        NOW,
      ),
    ).toBe('running')
  })

  it('uses mixedPeriods when live finite end dates differ', () => {
    expect(
      resolveJobCardSimplify14v2PanelMode(
        advertisement([
          publication({ id: 'jobs', channel: 'Jobs.cz', endDate: '14. 11. 2026' }),
          publication({ id: 'prace', channel: 'Prace.cz', endDate: '30. 11. 2026' }),
        ]),
        NOW,
      ),
    ).toBe('mixedPeriods')
  })

  it('uses ended when every publication is expired, including with no disabled channel', () => {
    expect(
      resolveJobCardSimplify14v2PanelMode(
        advertisement([
          publication({
            id: 'jobs',
            channel: 'Jobs.cz',
            status: 'expired',
            startDate: '1. 10. 2025',
            endDate: '1. 1. 2026',
          }),
          publication({
            id: 'prace',
            channel: 'Prace.cz',
            status: 'expired',
            startDate: '1. 10. 2025',
            endDate: '1. 1. 2026',
          }),
        ]),
        NOW,
      ),
    ).toBe('ended')
  })

  it('uses endingSoon when every live portal ends soon on the same day', () => {
    expect(
      resolveJobCardSimplify14v2PanelMode(
        advertisement([
          publication({ id: 'jobs', channel: 'Jobs.cz', endDate: '30. 10. 2026' }),
          publication({ id: 'prace', channel: 'Prace.cz', endDate: '30. 10. 2026' }),
        ]),
        NOW,
      ),
    ).toBe('endingSoon')
  })
})

describe('buildSimplify14v2Heading', () => {
  it('uses Běží for running', () => {
    expect(buildSimplify14v2Heading('running')).toMatchObject({
      icon: 'circle-check',
      className: 'tm-text-emotion-success-emphasis',
      testId: 'job-card-simplify14v2-running-heading',
      label: 'Běží',
    })
  })

  it('puts the od–do range into the running heading', () => {
    expect(buildSimplify14v2Heading('running', '1. 10. – 14. 11. 2026')).toMatchObject({
      label: 'Běží 1. 10. – 14. 11. 2026',
    })
  })

  it('uses Běží od–do for partial instead of a running-portals badge title', () => {
    expect(buildSimplify14v2Heading('partial', '1. 10. – 14. 11. 2026')).toMatchObject({
      icon: 'circle-check',
      className: 'tm-text-emotion-success-emphasis',
      testId: 'job-card-simplify14v2-running-heading',
      label: 'Běží 1. 10. – 14. 11. 2026',
    })
  })

  it('uses Běží v různá období for mixedPeriods', () => {
    expect(buildSimplify14v2Heading('mixedPeriods')).toMatchObject({
      icon: 'circle-check',
      className: 'tm-text-emotion-success-emphasis',
      testId: 'job-card-simplify14v2-mixed-periods-heading',
      label: 'Běží v různá období',
    })
  })

  it('uses gray Ukončeno for ended', () => {
    expect(buildSimplify14v2Heading('ended')).toMatchObject({
      icon: 'warning',
      className: 'tm-text-secondary-default',
      testId: 'job-card-simplify14v2-ended-heading',
      label: 'Ukončeno',
    })
  })

  it('puts the od–do range into the ended heading', () => {
    expect(buildSimplify14v2Heading('ended', '1. 10. 2025 – 1. 1. 2026')).toMatchObject({
      label: 'Ukončeno 1. 10. 2025 – 1. 1. 2026',
      className: 'tm-text-secondary-default',
    })
  })

  it('uses Brzy končí for endingSoon', () => {
    expect(buildSimplify14v2Heading('endingSoon')).toMatchObject({
      icon: 'alert-triangle-outline',
      className: 'tm-text-emotion-warning-emphasis',
      testId: 'job-card-simplify14v2-ending-soon-heading',
      label: 'Brzy končí',
    })
  })

  it('puts the od–do range into the endingSoon heading', () => {
    expect(buildSimplify14v2Heading('endingSoon', '1. 10. – 30. 10. 2026')).toMatchObject({
      label: 'Brzy končí 1. 10. – 30. 10. 2026',
    })
  })
})

describe('resolveSimplify14v2ChannelDateLabelTone', () => {
  it('uses muted gray for expired portals', () => {
    expect(
      resolveSimplify14v2ChannelDateLabelTone(
        publication({
          id: 'jobs',
          channel: 'Jobs.cz',
          status: 'expired',
          endDate: '1. 1. 2026',
        }),
        NOW,
      ),
    ).toBe('muted')
  })
})

describe('same-period range and per-channel dates', () => {
  it('shows an od–do heading range and hides logo dates when live portals share one period', () => {
    const publications = [
      publication({ id: 'jobs', channel: 'Jobs.cz', endDate: '14. 11. 2026' }),
      publication({ id: 'prace', channel: 'Prace.cz', endDate: '14. 11. 2026' }),
      publication({ id: 'export', channel: 'Export' }),
    ]

    expect(shouldShowSimplify14v2SamePeriodRange('running', publications, NOW)).toBe(true)
    expect(formatSimplify14v2SamePeriodRange('running', publications, NOW)).toBe(
      '1. 10. – 14. 11. 2026',
    )
    expect(shouldShowPerChannelDateLabels('running', publications, NOW)).toBe(false)
  })

  it('shows per-logo dates and hides the heading range when live periods differ', () => {
    const publications = [
      publication({ id: 'jobs', channel: 'Jobs.cz', endDate: '14. 11. 2026' }),
      publication({ id: 'prace', channel: 'Prace.cz', endDate: '30. 11. 2026' }),
    ]

    expect(shouldShowSimplify14v2SamePeriodRange('mixedPeriods', publications, NOW)).toBe(false)
    expect(shouldShowPerChannelDateLabels('mixedPeriods', publications, NOW)).toBe(true)
  })

  it('shows an od–do heading range and hides logo dates when ended portals share one period', () => {
    const publications = [
      publication({
        id: 'jobs',
        channel: 'Jobs.cz',
        status: 'expired',
        startDate: '1. 10. 2025',
        endDate: '1. 1. 2026',
      }),
      publication({
        id: 'prace',
        channel: 'Prace.cz',
        status: 'expired',
        startDate: '1. 10. 2025',
        endDate: '1. 1. 2026',
      }),
    ]

    expect(shouldShowSimplify14v2SamePeriodRange('ended', publications, NOW)).toBe(true)
    expect(formatSimplify14v2SamePeriodRange('ended', publications, NOW)).toBe(
      '1. 10. 2025 – 1. 1. 2026',
    )
    expect(shouldShowPerChannelDateLabels('ended', publications, NOW)).toBe(false)
  })

  it('shows per-logo dates and hides the heading range when ended periods differ', () => {
    const publications = [
      publication({
        id: 'jobs',
        channel: 'Jobs.cz',
        status: 'expired',
        startDate: '1. 10. 2025',
        endDate: '1. 1. 2026',
      }),
      publication({
        id: 'prace',
        channel: 'Prace.cz',
        status: 'expired',
        startDate: '1. 10. 2025',
        endDate: '15. 2. 2026',
      }),
    ]

    expect(shouldShowSimplify14v2SamePeriodRange('ended', publications, NOW)).toBe(false)
    expect(shouldShowPerChannelDateLabels('ended', publications, NOW)).toBe(true)
  })

  it('shows an od–do heading range for live portals when some portals have already ended', () => {
    expect(shouldShowSimplify14v2SamePeriodRange('partial', mixedLiveAndEnded, NOW)).toBe(true)
    expect(formatSimplify14v2SamePeriodRange('partial', mixedLiveAndEnded, NOW)).toBe(
      '1. 10. – 14. 11. 2026',
    )
    expect(shouldShowPerChannelDateLabels('partial', mixedLiveAndEnded, NOW)).toBe(false)
  })

  it('shows an od–do heading range and hides logo dates when ending-soon portals share one period', () => {
    const publications = [
      publication({ id: 'jobs', channel: 'Jobs.cz', endDate: '30. 10. 2026' }),
      publication({ id: 'prace', channel: 'Prace.cz', endDate: '30. 10. 2026' }),
    ]

    expect(shouldShowSimplify14v2SamePeriodRange('endingSoon', publications, NOW)).toBe(true)
    expect(formatSimplify14v2SamePeriodRange('endingSoon', publications, NOW)).toBe(
      '1. 10. – 30. 10. 2026',
    )
    expect(shouldShowPerChannelDateLabels('endingSoon', publications, NOW)).toBe(false)
  })
})

const mixedLiveAndEnded = [
  publication({ id: 'jobs', channel: 'Jobs.cz', endDate: '14. 11. 2026' }),
  publication({ id: 'prace', channel: 'Prace.cz', endDate: '14. 11. 2026' }),
  publication({ id: 'career', channel: 'Kariérní stránky', startDate: '1. 10. 2026' }),
  publication({
    id: 'atmoskop',
    channel: 'Atmoskop',
    status: 'expired',
    startDate: '1. 10. 2025',
    endDate: '1. 1. 2026',
  }),
  publication({
    id: 'recommend',
    channel: 'Doporučení',
    status: 'expired',
    startDate: '1. 10. 2025',
    endDate: '1. 1. 2026',
  }),
]

describe('buildSimplify14v2HeaderBadges', () => {
  it('returns only the ended-portals badge when live and ended portals mix', () => {
    expect(buildSimplify14v2HeaderBadges(advertisement(mixedLiveAndEnded), NOW)).toEqual([
      { color: 'neutral', label: '2 ukončené' },
    ])
  })

  it('returns no badges when every portal is live', () => {
    expect(
      buildSimplify14v2HeaderBadges(
        advertisement([
          publication({ id: 'jobs', channel: 'Jobs.cz', endDate: '14. 11. 2026' }),
          publication({ id: 'prace', channel: 'Prace.cz', endDate: '14. 11. 2026' }),
        ]),
        NOW,
      ),
    ).toEqual([])
  })
})

describe('buildSimplify14v2StripGroups', () => {
  it('splits live and ended portals into two groups', () => {
    const groups = buildSimplify14v2StripGroups(mixedLiveAndEnded, NOW)

    expect(groups.map((group) => group.kind)).toEqual(['running', 'ended'])
    expect(groups[0].items.map((item) => item.channel)).toEqual([
      'Jobs.cz',
      'Prace.cz',
      'Kariérní stránky',
    ])
    expect(groups[1].items.map((item) => item.channel)).toEqual(['Atmoskop', 'Doporučení'])
  })
})
