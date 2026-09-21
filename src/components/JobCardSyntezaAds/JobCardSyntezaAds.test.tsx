import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { formatCount } from '../JobCardSynteza/formatCount'
import type { JobAdvertisement } from '../JobCardSynteza/types'
import { JobCardSyntezaAds } from './JobCardSyntezaAds'

const advertisement: JobAdvertisement = {
  id: 'ad-1',
  title: 'Aktuální inzerát',
  publications: [
    { id: 'jobs', channel: 'Jobs.cz', startDate: '12. 7.', endDate: '15. 9. 2026', viewCount: 842 },
    { id: 'prace', channel: 'Prace.cz', startDate: '12. 7.', endDate: '30. 9. 2026', viewCount: 312 },
    { id: 'career', channel: 'Kariérní stránky', startDate: '12. 7.', endDate: '12. 8. 2026', viewCount: 130 },
  ],
}

function renderAds(props: Partial<Parameters<typeof JobCardSyntezaAds>[0]> = {}) {
  return render(
    <JobCardSyntezaAds
      title="Řidič/ka sk. C ČB PO–PÁ"
      owner="Petra Nováková"
      candidates={{ new: 5, unassessed: 14, preselected: 8, opalcovani: 3, invited: 5, hired: 2 }}
      advertisements={[advertisement]}
      {...props}
    />,
  )
}

describe('JobCardSyntezaAds', () => {
  it('renders the five-column pipeline with a pink new-candidate pill on Neposouzení', () => {
    renderAds({ onCandidatesClick: vi.fn() })

    const stats = screen.getByTestId('job-card-stats')
    expect(stats).toHaveTextContent('8Předvýbraný')
    expect(stats).toHaveTextContent('3Opalcovaný')
    expect(stats).toHaveTextContent('5Pozvaný')
    expect(stats).toHaveTextContent('2Přijatý')
    expect(stats).not.toHaveTextContent('Nový')
    expect(stats).not.toHaveTextContent('Ve hře')
    expect(stats).not.toHaveTextContent('Celkem')
    expect(screen.queryByTestId('job-card-stat-new')).not.toBeInTheDocument()

    const pill = screen.getByTestId('job-card-new-candidates')
    expect(pill).toHaveTextContent(formatCount(5))
    expect(pill).toHaveAttribute('aria-label', `Noví kandidáti: ${formatCount(5)}`)
    expect(pill).toHaveClass(
      'tm-bg-teamio-pink',
      'tm-text-primary-inverted-default',
      'tm-h-6',
      'tm-min-w-6',
      'tm-px-2',
      'tm-text-sm',
      'tm-font-semibold',
    )
    expect(pill.parentElement).toHaveClass('tm-inline-flex', 'tm-items-center')

    const unassessed = screen.getByTestId('job-card-stat-unassessed')
    expect(unassessed).toHaveTextContent('14')
    expect(unassessed).toHaveTextContent('Neposouzení')
    expect(unassessed).toContainElement(pill)
    expect(unassessed).toHaveAttribute(
      'aria-label',
      `Neposouzení: ${formatCount(14)}, Noví kandidáti: ${formatCount(5)}`,
    )
    expect(unassessed).toHaveClass('tm-px-6', 'tm-py-2', 'tm-flex-1')
    expect(unassessed).not.toHaveClass('tm-border-l')
    expect(screen.getByTestId('job-card-stat-opalcovani').children[1]).toHaveTextContent(
      'Opalcovaný',
    )
    expect(screen.getByTestId('job-card-candidates')).toHaveClass('tm-w-full')
    expect(screen.getByTestId('job-card-stat-hired')).toHaveClass('tm-px-6', 'tm-py-2', 'tm-flex-1')
    expect(screen.getByTestId('job-card-stat-preselected')).toHaveClass(
      'tm-border-l',
      'tm-border-secondary',
      'tm-px-6',
    )
  })

  it('hides the new-candidates pill when new is omitted or zero', () => {
    const { unmount } = renderAds({
      candidates: { unassessed: 14, preselected: 8, opalcovani: 3, invited: 5, hired: 2 },
    })
    expect(screen.queryByTestId('job-card-new-candidates')).not.toBeInTheDocument()

    unmount()
    renderAds({
      candidates: { new: 0, unassessed: 14, preselected: 8, opalcovani: 3, invited: 5, hired: 2 },
      onCandidatesClick: vi.fn(),
    })
    expect(screen.queryByTestId('job-card-new-candidates')).not.toBeInTheDocument()
    expect(screen.getByTestId('job-card-stat-unassessed')).toHaveAttribute(
      'aria-label',
      `Neposouzení: ${formatCount(14)}`,
    )
  })

  it('makes the pipeline stats clickable without a separate new column', async () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 })
    const onCandidatesClick = vi.fn()
    renderAds({ onCandidatesClick })

    expect(screen.queryByTestId('job-card-stat-new')).not.toBeInTheDocument()
    await user.click(screen.getByTestId('job-card-stat-unassessed'), { skipHover: true })
    expect(onCandidatesClick).toHaveBeenCalledWith('unassessed')
    expect(onCandidatesClick).not.toHaveBeenCalledWith('new')
    await user.click(screen.getByTestId('job-card-stat-hired'), { skipHover: true })
    expect(onCandidatesClick).toHaveBeenLastCalledWith('hired')
  })

  it('forwards the ref to the card element', () => {
    const ref = { current: null as HTMLElement | null }
    render(<JobCardSyntezaAds ref={ref} title="Nábor" />)

    expect(ref.current).toBe(screen.getByTestId('job-card'))
  })

  it('opens advertisement preview from the action next to the statistics', () => {
    const onPreviewAdvertisement = vi.fn()
    renderAds({ onPreviewAdvertisement })

    const preview = screen.getByTestId('job-card-advertisement-preview')
    expect(preview).toHaveTextContent('Zobrazit náhled')
    expect(preview.querySelector('[data-icon-name="search"]')).toBeInTheDocument()
    fireEvent.click(preview)
    expect(onPreviewAdvertisement).toHaveBeenCalledTimes(1)
  })

  it('shows a draft card on an open recruitment without the advertisement switcher', () => {
    const draft = {
      id: 'ad-draft',
      title: 'Řidič/ka sk. C — druhý inzerát',
      status: 'draft' as const,
      publications: [],
    }
    const onCompleteAdvertisement = vi.fn()
    renderAds({ advertisements: [draft], onCompleteAdvertisement })

    expect(screen.getByTestId('job-card-candidates')).toBeInTheDocument()
    expect(screen.getByTestId('job-card-advertisement-draft')).toHaveTextContent(
      'Řidič/ka sk. C — druhý inzerát',
    )
    expect(screen.getByTestId('job-card-advertisement-draft-badge')).toHaveTextContent(
      'Rozpracovaný',
    )
    expect(screen.queryByTestId('job-card-advertisement-switcher')).not.toBeInTheDocument()
    expect(screen.queryByText('Inzerát není nikde vystavený.')).not.toBeInTheDocument()

    fireEvent.click(screen.getByTestId('job-card-advertisement-complete'))
    expect(onCompleteAdvertisement).toHaveBeenCalledWith(draft)
  })

  it('keeps published portals when a draft sits next to them in the switcher', () => {
    const draft = { id: 'ad-draft', status: 'draft' as const }
    renderAds({ advertisements: [advertisement, draft], onCompleteAdvertisement: vi.fn() })

    expect(screen.getByTestId('job-card-advertisement-switcher-index')).toHaveTextContent('1/2')
    expect(screen.getByTestId('job-card-advertisement-title')).toHaveTextContent('Aktuální inzerát')
    expect(screen.getByText('Jobs.cz')).toBeInTheDocument()
    expect(screen.queryByTestId('job-card-advertisement-draft')).not.toBeInTheDocument()
  })

  it('shows the draft follow-up card in the switcher when the unfinished ad is selected', () => {
    const draft = {
      id: 'ad-draft',
      title: 'Řidič/ka sk. C — druhý inzerát',
      status: 'draft' as const,
    }
    renderAds({ advertisements: [draft, advertisement], onCompleteAdvertisement: vi.fn() })

    expect(screen.getByTestId('job-card-advertisement-switcher-index')).toHaveTextContent('1/2')
    expect(screen.getByTestId('job-card-advertisement-title')).toHaveTextContent(
      'Řidič/ka sk. C — druhý inzerát',
    )
    expect(screen.getByTestId('job-card-advertisement-draft-badge')).toHaveTextContent(
      'Rozpracovaný',
    )
    expect(screen.queryByText('Jobs.cz')).not.toBeInTheDocument()
  })
})
