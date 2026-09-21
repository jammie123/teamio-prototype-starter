import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { JobCardAdvertisementBatch } from './JobCardAdvertisementBatch'
import type { JobAdvertisement } from '../JobCardSynteza/types'

const advertisements: JobAdvertisement[] = [
  {
    id: 'ad-1',
    title: 'Hlavní inzerát',
    publications: [
      { id: 'jobs', channel: 'Jobs.cz', startDate: '12. 7. 2026', endDate: '30. 9. 2026' },
    ],
  },
  {
    id: 'ad-2',
    title: 'Inzerát pro brigádníky',
    publications: [
      { id: 'prace', channel: 'Prace.cz', startDate: '12. 7. 2026', endDate: '30. 9. 2026' },
    ],
  },
  {
    id: 'ad-3',
    publications: [
      { id: 'career', channel: 'Kariérní stránky', startDate: '12. 7. 2026', endDate: '30. 9. 2026' },
    ],
  },
]

describe('JobCardAdvertisementBatch', () => {
  it('renders a clickable card per advertisement with a Běží badge', () => {
    render(<JobCardAdvertisementBatch advertisements={advertisements} onSelect={vi.fn()} />)

    const list = screen.getByTestId('job-card-advertisement-batch')
    const items = screen.getAllByTestId('job-card-advertisement-batch-item')
    expect(items).toHaveLength(3)
    expect(items[0]).toHaveTextContent('Hlavní inzerát')
    expect(items[1]).toHaveTextContent('Inzerát pro brigádníky')
    expect(items[2]).toHaveTextContent('Inzerát 3')
    expect(list).not.toHaveTextContent('Jobs.cz')
    expect(list).not.toHaveTextContent('Prace.cz')

    for (const item of items) {
      expect(item.tagName).toBe('BUTTON')
      expect(item).toHaveClass(
        'tm-rounded',
        'tm-border',
        'tm-border-secondary',
        'tm-bg-basic',
        'tm-p-3',
      )
      const badge = item.querySelector('[data-testid="job-card-advertisement-batch-status"]')
      expect(badge).toHaveTextContent('Běží')
      expect(badge).toHaveClass('tm-text-emotion-success-emphasis', 'tm-bg-emotion-success-background')
      expect(item.querySelector('[data-icon-name="chevron-right"]')).toBeInTheDocument()
    }
  })

  it('reports the selected advertisement when a card is clicked', () => {
    const onSelect = vi.fn()
    render(<JobCardAdvertisementBatch advertisements={advertisements} onSelect={onSelect} />)

    fireEvent.click(screen.getAllByTestId('job-card-advertisement-batch-item')[1])

    expect(onSelect).toHaveBeenCalledTimes(1)
    expect(onSelect).toHaveBeenCalledWith(advertisements[1])
  })
})
