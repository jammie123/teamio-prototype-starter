import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import type { JobAdvertisement } from '../JobCardSynteza/types'
import { JobCardRunningAdsBatch } from './JobCardRunningAdsBatch'

const running: JobAdvertisement = {
  id: 'ad-running',
  title: 'Hlavní inzerát',
  publications: [
    { id: 'jobs', channel: 'Jobs.cz', startDate: '12. 7. 2026', endDate: '30. 9. 2026' },
  ],
}

const secondRunning: JobAdvertisement = {
  id: 'ad-running-2',
  title: 'Inzerát pro brigádníky',
  publications: [
    { id: 'prace', channel: 'Prace.cz', startDate: '20. 8. 2026', endDate: '31. 10. 2026' },
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

function renderBatch(
  advertisements: JobAdvertisement[],
  props: Partial<Parameters<typeof JobCardRunningAdsBatch>[0]> = {},
) {
  return render(
    <JobCardRunningAdsBatch
      advertisements={advertisements}
      title={advertisements[0]?.title ?? 'Inzerát'}
      index={0}
      total={advertisements.length}
      onPrev={vi.fn()}
      onNext={vi.fn()}
      {...props}
    />,
  )
}

describe('JobCardRunningAdsBatch', () => {
  it('puts the title, running-ad badge and switcher on one card row', () => {
    renderBatch([running, secondRunning])

    const batch = screen.getByTestId('job-card-running-ads-batch')
    const title = screen.getByTestId('job-card-advertisement-title')
    const badge = screen.getByTestId('job-card-running-ads-count')
    const switcher = screen.getByTestId('job-card-advertisement-switcher')

    expect(batch).toHaveClass('tm-flex-row', 'tm-items-center', 'tm-rounded', 'tm-border-secondary')
    expect(batch).not.toHaveClass('tm-flex-col')
    expect(badge).toHaveTextContent('2 běžící inzeráty')
    expect(title).toHaveTextContent('Hlavní inzerát')
    expect(screen.getByTestId('job-card-advertisement-switcher-index')).toHaveTextContent('1/2')
    expect(batch).toContainElement(title)
    expect(batch).toContainElement(badge)
    expect(batch).toContainElement(switcher)
    expect(title.compareDocumentPosition(badge) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(badge.compareDocumentPosition(switcher) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  })

  it('counts only running advertisements when one has already ended', () => {
    renderBatch([running, ended])

    expect(screen.getByTestId('job-card-running-ads-count')).toHaveTextContent('1 běžící inzerát')
    expect(screen.getByTestId('job-card-advertisement-switcher-index')).toHaveTextContent('1/2')
  })

  it('keeps the switcher and hides the count when no advertisement is running', () => {
    const onNext = vi.fn()
    renderBatch([ended, { ...ended, id: 'ad-ended-2' }], { onNext })

    expect(screen.queryByTestId('job-card-running-ads-count')).not.toBeInTheDocument()
    expect(screen.getByTestId('job-card-advertisement-switcher')).toBeInTheDocument()
    fireEvent.click(screen.getByTestId('job-card-advertisement-switcher-next'))
    expect(onNext).toHaveBeenCalledTimes(1)
  })
})
