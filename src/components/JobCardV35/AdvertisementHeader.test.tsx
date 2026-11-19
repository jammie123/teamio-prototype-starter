import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { AdvertisementHeader } from './AdvertisementHeader'

describe('AdvertisementHeader', () => {
  it('stacks the date under the label in a column', () => {
    render(<AdvertisementHeader tone="success" label="Běží" dateInfo="1. 1. – 1. 2. 2026" />)

    const heading = screen.getByTestId('job-card-advertisement-heading')
    const label = within(heading).getByTestId('job-card-advertisement-heading-label')
    const date = within(heading).getByTestId('job-card-advertisement-heading-date')

    expect(heading).toHaveTextContent('Běží 1. 1. – 1. 2. 2026')
    expect(heading.className).toContain('tm-flex-col')
    expect(heading.className).not.toContain('tm-flex-row')
    expect(heading.className).toContain('tm-text-emotion-success-emphasis')
    expect(label).toHaveTextContent('Běží')
    expect(label.className).toContain('tm-text-base')
    expect(label.className).toContain('tm-font-normal')
    expect(label.className).not.toContain('tm-font-medium')
    expect(label.className).not.toContain('tm-font-semibold')
    expect(date).toHaveTextContent('1. 1. – 1. 2. 2026')
    expect(date.className).toContain('tm-text-sm')
    expect(date.className).not.toContain('tm-text-base')
    expect(label.compareDocumentPosition(date) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(date.className).toContain('tm-font-normal')
    expect(date.className).toContain('tm-text-secondary-default')
  })

  it('uses semibold 1rem type on the ending-soon label', () => {
    render(<AdvertisementHeader tone="warning" label="Končí za 3 dny" dateInfo="1. 9. – 30. 9. 2026" />)

    const label = screen.getByTestId('job-card-advertisement-heading-label')
    const date = screen.getByTestId('job-card-advertisement-heading-date')

    expect(label.className).toContain('tm-font-semibold')
    expect(label.className).not.toContain('tm-font-medium')
    expect(label.className).not.toContain('tm-font-normal')
    expect(label.className).toContain('tm-text-base')
    expect(date.className).toContain('tm-text-sm')
    expect(date.className).toContain('tm-font-normal')
    expect(date.className).not.toContain('tm-text-base')
  })

  it('keeps the date in secondary color for every tone', () => {
    const { rerender } = render(
      <AdvertisementHeader tone="warning" label="Končí za 3 dny" dateInfo="30. 9." />,
    )
    expect(screen.getByTestId('job-card-advertisement-heading').className).toContain(
      'tm-text-emotion-warning-emphasis',
    )
    expect(screen.getByTestId('job-card-advertisement-heading-date').className).toContain(
      'tm-text-secondary-default',
    )

    rerender(<AdvertisementHeader tone="ended" label="Ukončeno" dateInfo="1. 8. – 15. 8. 2026" />)
    expect(screen.getByTestId('job-card-advertisement-heading').className).toContain(
      'tm-text-secondary-default',
    )
    expect(screen.getByTestId('job-card-advertisement-heading-date').className).toContain(
      'tm-text-secondary-default',
    )
  })

  it('does not render Prodloužit itself (it lives in the advertisement actions)', () => {
    render(<AdvertisementHeader tone="ended" label="Ukončeno" dateInfo="1. 8. – 15. 8. 2026" />)

    const heading = screen.getByTestId('job-card-advertisement-heading')
    expect(heading).toHaveAttribute('data-tone', 'ended')
    expect(within(heading).queryByRole('button')).not.toBeInTheDocument()
  })

  it('shows no date element for a not-yet-published advertisement', () => {
    render(<AdvertisementHeader tone="neutral" label="Zatím nevystavený inzerát" />)

    const heading = screen.getByTestId('job-card-advertisement-heading')
    expect(heading).toHaveTextContent('Zatím nevystavený inzerát')
    expect(
      within(heading).queryByTestId('job-card-advertisement-heading-date'),
    ).not.toBeInTheDocument()
  })
})
