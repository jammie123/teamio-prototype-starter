import { describe, expect, it } from 'vitest'
import type { JobAdvertisement } from '../JobCardSynteza/types'
import {
  buildSimplify11PanelSubline,
  resolveJobCardSimplify11PanelMode,
  resolveSimplify11ChannelVisualState,
} from './jobCardSimplify11Presentation'

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

describe('resolveJobCardSimplify11PanelMode', () => {
  it('returns partial for combination D', () => {
    expect(resolveJobCardSimplify11PanelMode(combinationD, now)).toBe('partial')
  })

  it('returns running for combination E', () => {
    const advertisement: JobAdvertisement = {
      id: 'ad-e',
      publications: [
        { id: 'jobs', channel: 'Jobs.cz', startDate: '12. 7. 2026', endDate: '14. 11. 2026' },
        { id: 'prace', channel: 'Prace.cz', startDate: '12. 7. 2026', endDate: '14. 11. 2026' },
        {
          id: 'career',
          channel: 'Kariérní stránky',
          status: 'disabled',
          startDate: '12. 7. 2026',
        },
      ],
    }

    expect(resolveJobCardSimplify11PanelMode(advertisement, now)).toBe('running')
  })

  it('returns ended for combination F when a channel is disabled', () => {
    const advertisement: JobAdvertisement = {
      id: 'ad-f',
      publications: [
        {
          id: 'jobs',
          channel: 'Jobs.cz',
          status: 'expired',
          startDate: '12. 6. 2026',
          endDate: '20. 10. 2026',
        },
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

    expect(resolveJobCardSimplify11PanelMode(advertisement, now)).toBe('ended')
  })

  it('keeps expiredUnexpected when everything expired and nothing disabled', () => {
    const advertisement: JobAdvertisement = {
      id: 'ad-expired',
      publications: [
        {
          id: 'jobs',
          channel: 'Jobs.cz',
          status: 'expired',
          startDate: '1. 6.',
          endDate: '20. 10. 2026',
        },
        {
          id: 'prace',
          channel: 'Prace.cz',
          status: 'expired',
          startDate: '1. 6.',
          endDate: '20. 10. 2026',
        },
      ],
    }

    expect(resolveJobCardSimplify11PanelMode(advertisement, now)).toBe('expiredUnexpected')
  })

  it('returns mixedPeriods when active portals have different end dates', () => {
    const advertisement: JobAdvertisement = {
      id: 'ad-mixed',
      publications: [
        { id: 'jobs', channel: 'Jobs.cz', startDate: '12. 7. 2026', endDate: '30. 9. 2026' },
        { id: 'prace', channel: 'Prace.cz', startDate: '12. 7. 2026', endDate: '14. 11. 2026' },
      ],
    }

    expect(resolveJobCardSimplify11PanelMode(advertisement, now)).toBe('mixedPeriods')
  })

  it('returns allDisabled when every channel is disabled', () => {
    const advertisement: JobAdvertisement = {
      id: 'ad-off',
      publications: [
        {
          id: 'career',
          channel: 'Kariérní stránky',
          status: 'disabled',
          startDate: '12. 7. 2026',
        },
      ],
    }

    expect(resolveJobCardSimplify11PanelMode(advertisement, now)).toBe('allDisabled')
  })
})

describe('buildSimplify11PanelSubline', () => {
  it('builds subline for combination D', () => {
    expect(buildSimplify11PanelSubline(combinationD, 'partial', now)).toBe(
      'Prace.cz skončila · 1 vypnutý',
    )
  })
})

describe('resolveSimplify11ChannelVisualState', () => {
  it('maps publication statuses to visual states', () => {
    expect(
      resolveSimplify11ChannelVisualState(
        { id: '1', channel: 'Jobs.cz', startDate: '1. 1.', endDate: '14. 11. 2026' },
        now,
      ),
    ).toBe('running')

    expect(
      resolveSimplify11ChannelVisualState(
        {
          id: '2',
          channel: 'Prace.cz',
          status: 'expired',
          startDate: '1. 1.',
          endDate: '20. 10. 2026',
        },
        now,
      ),
    ).toBe('expired')

    expect(
      resolveSimplify11ChannelVisualState(
        {
          id: '3',
          channel: 'Kariérní stránky',
          status: 'disabled',
          startDate: '1. 1.',
        },
        now,
      ),
    ).toBe('disabled')
  })
})
