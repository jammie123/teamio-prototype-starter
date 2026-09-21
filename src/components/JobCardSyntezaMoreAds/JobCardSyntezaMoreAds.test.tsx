import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { formatCount } from '../JobCardSynteza/formatCount'
import type { JobAdvertisement } from '../JobCardSynteza/types'
import { JobCardSyntezaMoreAds, type JobCardSyntezaMoreAdsProps } from './JobCardSyntezaMoreAds'

const runningAd: JobAdvertisement = {
  id: 'ad-1',
  title: 'Hlavní inzerát',
  publications: [
    { id: 'jobs', channel: 'Jobs.cz', startDate: '12. 7. 2026', endDate: '30. 9. 2026', viewCount: 1840 },
    { id: 'prace', channel: 'Prace.cz', startDate: '12. 7. 2026', endDate: '30. 9. 2026', viewCount: 920 },
  ],
}

const secondAd: JobAdvertisement = {
  id: 'ad-2',
  title: 'Inzerát pro brigádníky',
  publications: [
    { id: 'career', channel: 'Kariérní stránky', startDate: '20. 8. 2026', endDate: '31. 10. 2026', viewCount: 410 },
  ],
}

function renderMoreAds(props: Partial<JobCardSyntezaMoreAdsProps> = {}) {
  return render(
    <JobCardSyntezaMoreAds
      title="Řidič/ka sk. C ČB PO–PÁ"
      owner="Petra Nováková"
      candidates={{ new: 5, unassessed: 14, preselected: 8, opalcovani: 3, invited: 5, hired: 2 }}
      advertisements={[runningAd, secondAd]}
      {...props}
    />,
  )
}

describe('JobCardSyntezaMoreAds', () => {
  it('keeps the five-column pipeline on the left', () => {
    renderMoreAds({ onCandidatesClick: vi.fn() })

    const stats = screen.getByTestId('job-card-stats')
    expect(stats).toHaveTextContent('8Předvýbraný')
    expect(stats).toHaveTextContent('3Opalcovaný')
    expect(screen.queryByTestId('job-card-stat-new')).not.toBeInTheDocument()
    expect(screen.getByTestId('job-card-new-candidates')).toHaveTextContent(formatCount(5))
  })

  it('lists running advertisements instead of publication places', () => {
    renderMoreAds()

    expect(screen.getByTestId('job-card-advertisement-batch')).toBeInTheDocument()
    expect(screen.getByText('Hlavní inzerát')).toBeInTheDocument()
    expect(screen.getByText('Inzerát pro brigádníky')).toBeInTheDocument()
    expect(screen.getAllByTestId('job-card-advertisement-batch-status')).toHaveLength(2)
    expect(screen.queryByTestId('job-card-advertisement-active-publications')).not.toBeInTheDocument()
    expect(screen.queryByTestId('job-card-advertisement-switcher')).not.toBeInTheDocument()
    expect(screen.queryByText('Jobs.cz')).not.toBeInTheDocument()
    expect(screen.queryByTestId('job-card-advertisement-batch-back')).not.toBeInTheDocument()
  })

  it('opens the Ads publication detail and returns to the batch list', async () => {
    renderMoreAds()

    fireEvent.click(screen.getAllByTestId('job-card-advertisement-batch-item')[0])

    await waitFor(() => {
      expect(screen.queryByTestId('job-card-advertisement-batch')).not.toBeInTheDocument()
    })
    expect(screen.getByTestId('job-card-advertisement-active-publications')).toBeInTheDocument()
    expect(screen.getByText('Jobs.cz')).toBeInTheDocument()
    expect(screen.queryByText('Kariérní stránky')).not.toBeInTheDocument()

    const back = screen.getByTestId('job-card-advertisement-batch-back')
    expect(back).toHaveTextContent('Zpět na běžící inzerci')
    expect(back.querySelector('[data-icon-name="chevron-left"]')).toBeInTheDocument()

    fireEvent.click(back)

    await waitFor(() => {
      expect(screen.getByTestId('job-card-advertisement-batch')).toBeInTheDocument()
    })
    expect(screen.queryByTestId('job-card-advertisement-active-publications')).not.toBeInTheDocument()
    expect(screen.queryByText('Jobs.cz')).not.toBeInTheDocument()
  })

  it('opens a preselected advertisement without the batch list', () => {
    renderMoreAds({ defaultOpenedAdvertisementId: 'ad-2' })

    expect(screen.queryByTestId('job-card-advertisement-batch')).not.toBeInTheDocument()
    expect(screen.getByTestId('job-card-advertisement-batch-back')).toBeInTheDocument()
    expect(screen.getByText('Kariérní stránky')).toBeInTheDocument()
    expect(screen.queryByText('Jobs.cz')).not.toBeInTheDocument()
  })

  it('shows the Ads publication view for a single advertisement without back', () => {
    renderMoreAds({ advertisements: [runningAd] })

    expect(screen.queryByTestId('job-card-advertisement-batch')).not.toBeInTheDocument()
    expect(screen.queryByTestId('job-card-advertisement-batch-back')).not.toBeInTheDocument()
    expect(screen.getByTestId('job-card-advertisement-active-publications')).toBeInTheDocument()
    expect(screen.getByText('Jobs.cz')).toBeInTheDocument()
  })

  it('shows the empty advertisement state', () => {
    renderMoreAds({ advertisements: [], onCreateAdvertisement: vi.fn() })

    expect(screen.getByTestId('job-card-no-advertisement')).toHaveTextContent(
      'Nábor nemá žádný inzerát.',
    )
    expect(screen.getByText('Vytvořit inzerát')).toBeInTheDocument()
  })

  it('forwards completing a draft advertisement from the opened Ads panel', () => {
    const draft = { id: 'ad-draft', status: 'draft' as const }
    const onCompleteAdvertisement = vi.fn()
    renderMoreAds({
      advertisements: [draft],
      onCompleteAdvertisement,
    })

    expect(screen.getByTestId('job-card-advertisement-draft')).toBeInTheDocument()
    fireEvent.click(screen.getByTestId('job-card-advertisement-complete'))
    expect(onCompleteAdvertisement).toHaveBeenCalledWith(draft)
  })

  it('forwards the ref to the card element', () => {
    const ref = { current: null as HTMLElement | null }
    render(<JobCardSyntezaMoreAds ref={ref} title="Nábor" />)

    expect(ref.current).toBe(screen.getByTestId('job-card'))
  })
})
