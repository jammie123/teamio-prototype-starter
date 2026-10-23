import { describe, expect, it } from 'vitest'
import type { JobAdvertisement, JobPublication } from '../JobCardSynteza/types'
import {
  formatSimplify14ChannelDateLabel,
  formatSimplify14SamePeriodRange,
  resolveSimplify14ChannelDateLabelTone,
  shouldShowPerChannelDateLabels,
  shouldShowSimplify14SamePeriodRange,
} from './jobCardSimplify14Presentation'

const now = new Date('2026-10-22T12:00:00')

const combinationD: JobAdvertisement = {
  id: 'ad-d',
  publications: [
    { id: 'jobs', channel: 'Jobs.cz', startDate: '12. 7. 2026', endDate: '14. 11. 2026' },
    {
      id: 'prace',
      channel: 'Prace.cz',
      status: 'expired',
      startDate: '12. 6. 2026',
      endDate: '20. 10. 2026',
    },
    {
      id: 'career',
      channel: 'Kariérní stránky',
      status: 'disabled',
      startDate: '12. 7. 2026',
    },
  ],
}

describe('shouldShowPerChannelDateLabels', () => {
  it('returns true for partial (combination D)', () => {
    expect(
      shouldShowPerChannelDateLabels('partial', combinationD.publications ?? [], now),
    ).toBe(true)
  })

  it('returns false for running with same end date (combination E)', () => {
    const publications: JobPublication[] = [
      { id: 'jobs', channel: 'Jobs.cz', startDate: '12. 7. 2026', endDate: '14. 11. 2026' },
      { id: 'prace', channel: 'Prace.cz', startDate: '12. 7. 2026', endDate: '14. 11. 2026' },
      {
        id: 'career',
        channel: 'Kariérní stránky',
        status: 'disabled',
        startDate: '12. 7. 2026',
      },
    ]

    expect(shouldShowPerChannelDateLabels('running', publications, now)).toBe(false)
  })

  it('returns true for mixedPeriods', () => {
    const publications: JobPublication[] = [
      { id: 'jobs', channel: 'Jobs.cz', startDate: '12. 7. 2026', endDate: '30. 9. 2026' },
      { id: 'prace', channel: 'Prace.cz', startDate: '12. 7. 2026', endDate: '14. 11. 2026' },
    ]

    expect(shouldShowPerChannelDateLabels('mixedPeriods', publications, now)).toBe(true)
  })

  it('returns false for ended mode', () => {
    expect(
      shouldShowPerChannelDateLabels('ended', combinationD.publications ?? [], now),
    ).toBe(false)
  })
})

describe('formatSimplify14SamePeriodRange', () => {
  it('returns full range when active channels share start and end (combination E)', () => {
    const publications: JobPublication[] = [
      { id: 'jobs', channel: 'Jobs.cz', startDate: '12. 7. 2026', endDate: '14. 11. 2026' },
      { id: 'prace', channel: 'Prace.cz', startDate: '12. 7. 2026', endDate: '14. 11. 2026' },
      {
        id: 'career',
        channel: 'Kariérní stránky',
        status: 'disabled',
        startDate: '12. 7. 2026',
      },
    ]

    expect(formatSimplify14SamePeriodRange(publications, now)).toBe('12. 7. – 14. 11. 2026')
    expect(shouldShowSimplify14SamePeriodRange('running', publications, now)).toBe(true)
  })

  it('does not show same-period range in partial mode even when one channel runs', () => {
    expect(
      shouldShowSimplify14SamePeriodRange('partial', combinationD.publications ?? [], now),
    ).toBe(false)
  })

  it('returns undefined when active channels end on different days', () => {
    const publications: JobPublication[] = [
      { id: 'jobs', channel: 'Jobs.cz', startDate: '12. 7. 2026', endDate: '30. 9. 2026' },
      { id: 'prace', channel: 'Prace.cz', startDate: '12. 7. 2026', endDate: '14. 11. 2026' },
    ]

    expect(formatSimplify14SamePeriodRange(publications, now)).toBeUndefined()
  })
})

describe('formatSimplify14ChannelDateLabel', () => {
  it('formats disabled channel as vypnuto', () => {
    const publication: JobPublication = {
      id: 'career',
      channel: 'Kariérní stránky',
      status: 'disabled',
      startDate: '12. 7. 2026',
    }

    expect(formatSimplify14ChannelDateLabel(publication, now)).toBe('vypnuto')
    expect(resolveSimplify14ChannelDateLabelTone(publication, now)).toBe('muted')
  })

  it('formats unlimited active channel as bez limitu', () => {
    const publication: JobPublication = {
      id: 'career',
      channel: 'Kariérní stránky',
      startDate: '12. 7. 2026',
    }

    expect(formatSimplify14ChannelDateLabel(publication, now)).toBe('bez limitu')
    expect(resolveSimplify14ChannelDateLabelTone(publication, now)).toBe('muted')
  })

  it('formats expired channel end date without year', () => {
    const publication: JobPublication = {
      id: 'prace',
      channel: 'Prace.cz',
      status: 'expired',
      startDate: '12. 6. 2026',
      endDate: '20. 10. 2026',
    }

    expect(formatSimplify14ChannelDateLabel(publication, now)).toBe('20. 10.')
    expect(resolveSimplify14ChannelDateLabelTone(publication, now)).toBe('danger')
  })

  it('formats ending soon channel with warning tone', () => {
    const publication: JobPublication = {
      id: 'jobs',
      channel: 'Jobs.cz',
      startDate: '12. 7. 2026',
      endDate: '27. 10. 2026',
    }

    expect(formatSimplify14ChannelDateLabel(publication, now)).toBe('27. 10.')
    expect(resolveSimplify14ChannelDateLabelTone(publication, now)).toBe('warning')
  })
})
