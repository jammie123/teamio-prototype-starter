import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { JobCardSynteza } from './JobCardSynteza'
import type { JobAdvertisement } from './types'

const advertisement: JobAdvertisement = {
  id: 'ad-1',
  title: 'Aktuální inzerát',
  publications: [
    { id: 'jobs', channel: 'Jobs.cz', startDate: '12. 7.', endDate: '15. 9. 2026', viewCount: 842 },
    { id: 'prace', channel: 'Prace.cz', startDate: '12. 7.', endDate: '30. 9. 2026', viewCount: 312 },
    { id: 'career', channel: 'Kariérní stránky', startDate: '12. 7.', endDate: '12. 8. 2026', viewCount: 130 },
  ],
}

function renderJobCardSynteza(props: Partial<Parameters<typeof JobCardSynteza>[0]> = {}) {
  return render(
    <JobCardSynteza
      title="Řidič/ka sk. C ČB PO–PÁ"
      owner="Petra Nováková"
      candidates={{ new: 5, unassessed: 14, preselected: 8, opalcovani: 3, invited: 5, hired: 2 }}
      advertisements={[advertisement]}
      {...props}
    />,
  )
}

describe('JobCardSynteza', () => {
  it('renders the title row with people, the activity bell and no status pill', () => {
    renderJobCardSynteza({ onEditJob: vi.fn() })

    const titleRow = screen.getByTestId('job-card-title-row')
    const people = screen.getByTestId('job-card-people')
    const activity = screen.getByTestId('job-card-activity-toggle')
    const actions = screen.getByTestId('job-card-actions-toggle')

    expect(screen.getByRole('heading', { name: 'Řidič/ka sk. C ČB PO–PÁ' })).toBeInTheDocument()
    expect(titleRow).toContainElement(people)
    expect(titleRow).toContainElement(activity)
    expect(titleRow).toContainElement(actions)
    expect(people.compareDocumentPosition(activity) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(activity.compareDocumentPosition(actions) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    const iconButtons = screen.getByTestId('job-card-icon-buttons')
    expect(iconButtons).toHaveClass('tm-gap-0')
    expect(iconButtons).toContainElement(activity)
    expect(iconButtons).toContainElement(actions)
    expect(iconButtons.parentElement).toHaveClass('tm-gap-2')
    expect(activity.querySelector('[data-icon-name="notification"]')).toBeInTheDocument()
    expect(activity).toHaveClass('!tm-text-teamio-blue')
    expect(actions).toHaveClass('!tm-text-teamio-blue')
    expect(actions.querySelector('[data-icon-name="more-vertical"]')).toBeInTheDocument()
    expect(screen.queryByTestId('job-card-status')).not.toBeInTheDocument()
    expect(screen.queryByText('Zveřejněný')).not.toBeInTheDocument()
    expect(screen.queryByText('Nezveřejněný')).not.toBeInTheDocument()
  })

  it('shows an unread dot when a hiring manager has unread activity', () => {
    renderJobCardSynteza({
      activities: [
        {
          id: 'rating-1',
          type: 'rating',
          actor: 'Lukáš Procházka',
          candidateName: 'Jana Malá',
          occurredAt: 'dnes 9:14',
          unread: true,
        },
      ],
    })

    expect(screen.getAllByTestId('job-card-activity-dot')).toHaveLength(1)
  })

  it('hides the unread dot when there are no unread activities', () => {
    renderJobCardSynteza({ activities: [] })

    expect(screen.getByTestId('job-card-activity-toggle')).toBeInTheDocument()
    expect(screen.queryByTestId('job-card-activity-dot')).not.toBeInTheDocument()
  })

  it('renders the six-column pipeline with Nový in the pink token', () => {
    renderJobCardSynteza({ onCandidatesClick: vi.fn() })

    const stats = screen.getByTestId('job-card-stats')
    expect(stats).toHaveTextContent('5Nový')
    expect(stats).toHaveTextContent('14Neposouzený')
    expect(stats).toHaveTextContent('8Předvýbraný')
    expect(stats).toHaveTextContent('3Opalcovaný')
    expect(stats).toHaveTextContent('5Pozvaný')
    expect(stats).toHaveTextContent('2Přijatý')
    expect(stats).not.toHaveTextContent('Ve hře')
    expect(stats).not.toHaveTextContent('Celkem')
    expect(stats).not.toHaveTextContent('Pozvaní na pohovor')

    const newStat = screen.getByTestId('job-card-stat-new')
    expect(newStat.children[0]).toHaveClass('tm-text-teamio-pink')
    expect(newStat.children[1]).toHaveTextContent('Nový')
    expect(screen.getByTestId('job-card-stat-opalcovani').children[1]).toHaveTextContent(
      'Opalcovaný',
    )
    expect(screen.getByTestId('job-card-candidates')).toHaveClass('tm-w-full')
    expect(newStat).toHaveClass('tm-px-6', 'tm-py-2', 'tm-flex-1')
    expect(screen.getByTestId('job-card-stat-hired')).toHaveClass('tm-px-6', 'tm-py-2', 'tm-flex-1')
    expect(screen.getByTestId('job-card-stat-unassessed')).toHaveClass(
      'tm-border-l',
      'tm-border-secondary',
      'tm-px-6',
    )
  })

  it('makes the new pipeline stats clickable', async () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 })
    const onCandidatesClick = vi.fn()
    renderJobCardSynteza({ onCandidatesClick })

    await user.click(screen.getByTestId('job-card-stat-new'), { skipHover: true })
    expect(onCandidatesClick).toHaveBeenCalledWith('new')
    await user.click(screen.getByTestId('job-card-stat-unassessed'), { skipHover: true })
    expect(onCandidatesClick).toHaveBeenCalledWith('unassessed')
    await user.click(screen.getByTestId('job-card-stat-hired'), { skipHover: true })
    expect(onCandidatesClick).toHaveBeenLastCalledWith('hired')
  })

  it('keeps advertisements running and does not show the more-statistics link', () => {
    renderJobCardSynteza()

    expect(screen.getByTestId('job-card-advertisement-running-heading')).toHaveTextContent('Běží')
    expect(screen.getByTestId('job-card-advertisement-aggregate-views')).toHaveTextContent(/1\s284 zhlédnutí/)
    expect(screen.getByTestId('job-card-advertisement-stats-toggle')).toBeInTheDocument()
    expect(screen.queryByTestId('job-card-advertisement-more-stats')).not.toBeInTheDocument()
    expect(screen.queryByText('Zobrazit více statistik')).not.toBeInTheDocument()
    expect(screen.getAllByTestId('job-card-publication')).toHaveLength(3)
  })

  it('uses column padding and stretches the advertisement border the full card height', () => {
    renderJobCardSynteza()

    expect(screen.getByTestId('job-card')).toHaveClass('!tm-p-0')
    expect(screen.getByTestId('job-card-layout')).toHaveClass('md:tm-items-stretch', 'md:tm-gap-0')
    expect(screen.getByTestId('job-card-recruitment')).toHaveClass('tm-p-4')
    expect(screen.getByTestId('job-card-advertisements')).toHaveClass(
      'tm-p-6',
      'md:tm-self-stretch',
      'md:tm-border-l',
    )
  })

  it('renders a note in the recruitment column', () => {
    renderJobCardSynteza({
      note: {
        author: 'Petra Nováková',
        text: 'Nástup ideálně od 1. 9. 2026.',
        addedAt: '9. 9. 2026',
      },
    })

    const note = screen.getByTestId('job-card-note')
    expect(screen.getByTestId('job-card-recruitment')).toContainElement(note)
    expect(note).toHaveTextContent('Nástup ideálně od 1. 9. 2026.')
  })

  it('forwards the ref to the card element', () => {
    const ref = { current: null as HTMLElement | null }
    render(<JobCardSynteza ref={ref} title="Nábor" />)

    expect(ref.current).toBe(screen.getByTestId('job-card'))
  })
})
