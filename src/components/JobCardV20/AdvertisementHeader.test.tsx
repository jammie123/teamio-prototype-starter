import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { AdvertisementHeader } from './AdvertisementHeader'

describe('AdvertisementHeader', () => {
  it('places the date next to the label on one line', () => {
    render(<AdvertisementHeader tone="success" label="Běží" dateInfo="1. 1. – 1. 2. 2026" />)

    const heading = screen.getByTestId('job-card-advertisement-heading')
    const label = within(heading).getByTestId('job-card-advertisement-heading-label')
    const date = within(heading).getByTestId('job-card-advertisement-heading-date')

    expect(heading).toHaveTextContent('Běží 1. 1. – 1. 2. 2026')
    expect(heading.className).toContain('tm-flex-row')
    expect(heading.className).toContain('tm-w-full')
    expect(heading.className).toContain('tm-justify-between')
    expect(heading.className).toContain('tm-items-baseline')
    expect(heading.className).not.toContain('tm-gap-5')
    expect(heading.className).toContain('tm-text-emotion-success-emphasis')
    expect(label).toHaveTextContent('Běží')
    expect(label.className).toContain('tm-text-base')
    expect(date).toHaveTextContent('1. 1. – 1. 2. 2026')
    expect(label.compareDocumentPosition(date) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(date.className).toContain('tm-font-normal')
    expect(date.className).toContain('tm-text-secondary-default')
  })

  it('uses the warning color when ending soon', () => {
    render(<AdvertisementHeader tone="warning" label="Končí za 3 dny" dateInfo="30. 9." />)

    expect(screen.getByTestId('job-card-advertisement-heading').className).toContain(
      'tm-text-emotion-warning-emphasis',
    )
  })

  it('mutes ended and not-yet-published headers', () => {
    const { rerender } = render(
      <AdvertisementHeader tone="ended" label="Ukončeno" dateInfo="1. 8. – 15. 8. 2026" />,
    )
    expect(screen.getByTestId('job-card-advertisement-heading').className).toContain(
      'tm-text-secondary-default',
    )

    rerender(<AdvertisementHeader tone="neutral" label="Zatím nevystavený inzerát" />)
    const heading = screen.getByTestId('job-card-advertisement-heading')
    expect(heading).toHaveTextContent('Zatím nevystavený inzerát')
    expect(
      within(heading).queryByTestId('job-card-advertisement-heading-date'),
    ).not.toBeInTheDocument()
  })
})
