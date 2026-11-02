import { render, screen, within } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import type { JobAdvertisement, JobPublication } from '../JobCardSynteza/types'
import { JobCardSimplify14v2 } from './JobCardSimplify14v2'

function daysFromNow(days: number) {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return `${date.getDate()}. ${date.getMonth() + 1}. ${date.getFullYear()}`
}

function publication(
  partial: Partial<JobPublication> & Pick<JobPublication, 'id' | 'channel'>,
): JobPublication {
  return { startDate: '1. 10. 2026', ...partial }
}

function renderCard(
  advertisement: JobAdvertisement,
  extra?: Partial<Parameters<typeof JobCardSimplify14v2>[0]>,
) {
  return render(
    <JobCardSimplify14v2 title="Pozice" advertisements={[advertisement]} {...extra} />,
  )
}

const endedSameTwoExpired: JobAdvertisement = {
  id: 'ended-same',
  publications: [
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
  ],
}

describe('JobCardSimplify14v2', () => {
  it('renders 40px channel chips and Běží with od–do when live portals share one period', () => {
    const endDate = daysFromNow(40)
    renderCard({
      id: 'running-same',
      publications: [
        publication({ id: 'jobs', channel: 'Jobs.cz', endDate }),
        publication({ id: 'prace', channel: 'Prace.cz', endDate }),
      ],
    })

    expect(screen.getByTestId('job-card')).toHaveAttribute('data-variant', 'simplify-14v2')
    expect(screen.getByTestId('job-card-simplify14v2-running-heading')).toHaveTextContent(
      `Běží 1. 10. – ${endDate}`,
    )
    expect(screen.getByTestId('advertisement-header')).toContainElement(
      screen.getByTestId('job-card-simplify14v2-running-heading'),
    )
    expect(screen.queryByTestId('job-card-simplify14v2-subline')).not.toBeInTheDocument()
    expect(screen.queryByTestId('job-card-simplify14v2-channel-date')).not.toBeInTheDocument()

    const list = screen.getByTestId('advertisement-list')
    expect(list).toHaveAttribute('data-layout', 'row')
    const chips = within(list).getAllByTestId('job-card-simplify11-channel-chip')
    expect(chips).toHaveLength(2)
    expect(chips[0].className).toContain('tm-size-[40px]')
    expect(within(chips[0]).getByTestId('job-portal-logo').className).toContain('tm-size-[40px]')
  })

  it('shows Běží v různá období and a date under every live logo', () => {
    renderCard({
      id: 'running-mixed',
      publications: [
        publication({ id: 'jobs', channel: 'Jobs.cz', endDate: daysFromNow(40) }),
        publication({ id: 'prace', channel: 'Prace.cz', endDate: daysFromNow(60) }),
      ],
    })

    expect(screen.getByTestId('job-card-simplify14v2-mixed-periods-heading')).toHaveTextContent(
      'Běží v různá období',
    )
    expect(screen.queryByTestId('job-card-simplify14v2-subline')).not.toBeInTheDocument()
    const dates = screen.getAllByTestId('job-card-simplify14v2-channel-date')
    expect(dates).toHaveLength(2)
  })

  it('shows Ukončeno with od–do when ended portals share one period', () => {
    renderCard({
      id: 'ended-same',
      publications: [
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
      ],
    })

    const heading = screen.getByTestId('job-card-simplify14v2-ended-heading')
    expect(heading).toHaveTextContent('Ukončeno 1. 10. 2025 – 1. 1. 2026')
    expect(heading.className).toContain('tm-text-secondary-default')
    expect(screen.queryByTestId('job-card-simplify14v2-subline')).not.toBeInTheDocument()
    expect(screen.queryByTestId('job-card-simplify14v2-channel-date')).not.toBeInTheDocument()
    const dots = screen.getAllByTestId('job-card-simplify11-channel-status-dot')
    expect(dots.every((dot) => dot.className.includes('tm-bg-[#C2C8CE]'))).toBe(true)
  })

  it('shows Ukončeno without a subline and per-logo dates when ended periods differ', () => {
    renderCard({
      id: 'ended-mixed',
      publications: [
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
      ],
    })

    const heading = screen.getByTestId('job-card-simplify14v2-ended-heading')
    expect(heading).toHaveTextContent('Ukončeno')
    expect(heading.className).toContain('tm-text-secondary-default')
    expect(screen.queryByTestId('job-card-simplify14v2-subline')).not.toBeInTheDocument()
    const dates = screen.getAllByTestId('job-card-simplify14v2-channel-date')
    expect(dates.map((label) => label.textContent)).toEqual(['1. 1.', '15. 2.'])
    expect(dates.every((label) => label.className.includes('tm-text-secondary-default'))).toBe(true)
    const dots = screen.getAllByTestId('job-card-simplify11-channel-status-dot')
    expect(dots.every((dot) => dot.className.includes('tm-bg-[#C2C8CE]'))).toBe(true)
  })

  it('shows Brzy končí with od–do when every live portal is ending soon on the same day', () => {
    const endDate = daysFromNow(3)
    renderCard({
      id: 'ending-soon',
      publications: [
        publication({ id: 'jobs', channel: 'Jobs.cz', endDate }),
        publication({ id: 'prace', channel: 'Prace.cz', endDate }),
      ],
    })

    expect(screen.getByTestId('job-card-simplify14v2-ending-soon-heading')).toHaveTextContent(
      `Brzy končí 1. 10. – ${endDate}`,
    )
    expect(screen.queryByTestId('job-card-simplify14v2-subline')).not.toBeInTheDocument()
    expect(screen.queryByTestId('job-card-simplify14v2-channel-date')).not.toBeInTheDocument()
  })

  it('shows Běží od–do, the ended badge, and a divider when 3 portals run and 2 have ended', () => {
    const endDate = daysFromNow(40)
    renderCard({
      id: 'running-and-ended',
      publications: [
        publication({ id: 'jobs', channel: 'Jobs.cz', endDate }),
        publication({ id: 'prace', channel: 'Prace.cz', endDate }),
        publication({ id: 'career', channel: 'Kariérní stránky' }),
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
      ],
    })

    expect(screen.getByTestId('job-card-simplify14v2-running-heading')).toHaveTextContent(
      `Běží 1. 10. – ${endDate}`,
    )
    expect(screen.queryByTestId('job-card-simplify14v2-partial-heading')).not.toBeInTheDocument()
    expect(
      screen.getAllByTestId('advertisement-header-badge').map((badge) => badge.textContent),
    ).toEqual(['2 ukončené'])
    expect(screen.getByTestId('advertisement-list-divider')).toBeInTheDocument()
    expect(screen.getAllByTestId('job-board-item')).toHaveLength(5)
  })

  it('keeps the extend button in the job-board row instead of a full-width block', () => {
    renderCard(endedSameTwoExpired, { onExtendPublication: vi.fn() })

    const list = screen.getByTestId('advertisement-list')
    const cta = screen.getByTestId('job-card-simplify14v2-panel-cta')
    expect(list).toContainElement(cta)
    expect(cta.className).not.toContain('tm-w-full')
    expect(list.className).toContain('tm-flex-wrap')
  })

  it('sizes the restore-advertising button to the 40px job-portal icons', () => {
    renderCard(endedSameTwoExpired, { onExtendPublication: vi.fn() })

    const chip = within(screen.getByTestId('advertisement-list')).getAllByTestId(
      'job-card-simplify11-channel-chip',
    )[0]
    const cta = screen.getByTestId('job-card-simplify14v2-panel-cta')

    expect(chip.className).toContain('tm-size-[40px]')
    expect(cta.className).toContain('tm-h-[40px]')
    expect(cta.className).toContain('tm-min-h-[40px]')
  })

  it('aligns the restore-advertising button to the top-right of the job-portal row', () => {
    renderCard(endedSameTwoExpired, { onExtendPublication: vi.fn() })

    const list = screen.getByTestId('advertisement-list')
    const cta = screen.getByTestId('job-card-simplify14v2-panel-cta')

    expect(list.className).toContain('tm-items-start')
    expect(list.className).not.toContain('tm-items-center')
    expect(cta.className).toContain('tm-self-start')
    expect(cta.className).toContain('tm-ml-auto')
    expect(cta.className).not.toContain('tm-self-center')
  })
})
