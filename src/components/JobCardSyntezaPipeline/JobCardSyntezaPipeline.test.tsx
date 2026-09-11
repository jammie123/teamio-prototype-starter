import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { formatCount } from '../JobCardSynteza/formatCount'
import type { JobAdvertisement } from '../JobCardSynteza/types'
import { JobCardSyntezaPipeline } from './JobCardSyntezaPipeline'

const advertisement: JobAdvertisement = {
  id: 'ad-1',
  title: 'Aktuální inzerát',
  publications: [
    { id: 'jobs', channel: 'Jobs.cz', startDate: '12. 7.', endDate: '15. 9. 2026', viewCount: 842 },
    { id: 'prace', channel: 'Prace.cz', startDate: '12. 7.', endDate: '30. 9. 2026', viewCount: 312 },
    { id: 'career', channel: 'Kariérní stránky', startDate: '12. 7.', endDate: '12. 8. 2026', viewCount: 130 },
  ],
}

function renderPipeline(props: Partial<Parameters<typeof JobCardSyntezaPipeline>[0]> = {}) {
  return render(
    <JobCardSyntezaPipeline
      title="Řidič/ka sk. C ČB PO–PÁ"
      owner="Petra Nováková"
      candidates={{ new: 5, unassessed: 14, preselected: 8, opalcovani: 3, invited: 5, hired: 2 }}
      advertisements={[advertisement]}
      {...props}
    />,
  )
}

describe('JobCardSyntezaPipeline', () => {
  it('renders the five-column pipeline with a pink new-candidate pill on Neposouzení', () => {
    renderPipeline({ onCandidatesClick: vi.fn() })

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
    const { unmount } = renderPipeline({
      candidates: { unassessed: 14, preselected: 8, opalcovani: 3, invited: 5, hired: 2 },
    })
    expect(screen.queryByTestId('job-card-new-candidates')).not.toBeInTheDocument()

    unmount()
    renderPipeline({
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
    renderPipeline({ onCandidatesClick })

    expect(screen.queryByTestId('job-card-stat-new')).not.toBeInTheDocument()
    await user.click(screen.getByTestId('job-card-stat-unassessed'), { skipHover: true })
    expect(onCandidatesClick).toHaveBeenCalledWith('unassessed')
    expect(onCandidatesClick).not.toHaveBeenCalledWith('new')
    await user.click(screen.getByTestId('job-card-stat-hired'), { skipHover: true })
    expect(onCandidatesClick).toHaveBeenLastCalledWith('hired')
  })

  it('forwards the ref to the card element', () => {
    const ref = { current: null as HTMLElement | null }
    render(<JobCardSyntezaPipeline ref={ref} title="Nábor" />)

    expect(ref.current).toBe(screen.getByTestId('job-card'))
  })

  it('opens advertisement preview from the action next to the statistics', () => {
    const onPreviewAdvertisement = vi.fn()
    renderPipeline({ onPreviewAdvertisement })

    const preview = screen.getByTestId('job-card-advertisement-preview')
    expect(preview).toHaveTextContent('Zobrazit náhled')
    expect(preview.querySelector('[data-icon-name="search"]')).toBeInTheDocument()
    fireEvent.click(preview)
    expect(onPreviewAdvertisement).toHaveBeenCalledTimes(1)
  })
})
