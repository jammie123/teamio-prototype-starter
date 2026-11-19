import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { AdvertisementHeader } from './AdvertisementHeader'

describe('AdvertisementHeader', () => {
  it('does not render the label of a running advertisement, only the date', () => {
    render(<AdvertisementHeader tone="success" dateInfo="1. 1. – 1. 2. 2026" />)

    const heading = screen.getByTestId('job-card-advertisement-heading')
    expect(within(heading).queryByTestId('job-card-advertisement-heading-label')).not.toBeInTheDocument()
    expect(heading).toHaveTextContent('1. 1. – 1. 2. 2026')
    expect(heading.className).toContain('tm-text-emotion-success-emphasis')
    expect(heading.className).not.toContain('md:tm-justify-between')
  })

  it('renders nothing when there is neither label nor date (running in different periods)', () => {
    const { container } = render(<AdvertisementHeader tone="success" />)

    expect(container).toBeEmptyDOMElement()
  })

  it('places the date next to the label on one line', () => {
    render(<AdvertisementHeader tone="warning" label="Končí za 3 dny" dateInfo="1. 9. – 30. 9. 2026" />)

    const heading = screen.getByTestId('job-card-advertisement-heading')
    const label = within(heading).getByTestId('job-card-advertisement-heading-label')
    const date = within(heading).getByTestId('job-card-advertisement-heading-date')

    expect(heading).toHaveTextContent('Končí za 3 dny 1. 9. – 30. 9. 2026')
    expect(heading.className).toContain('tm-flex-row')
    expect(heading.className).toContain('tm-w-full')
    expect(heading.className).toContain('md:tm-justify-between')
    expect(heading.className).toContain('md:tm-items-baseline')
    expect(heading.className).toContain('tm-text-emotion-warning-emphasis')
    expect(label.className).toContain('tm-font-semibold')
    expect(label.compareDocumentPosition(date) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(date.className).toContain('tm-font-normal')
    expect(date.className).toContain('tm-text-secondary-default')
  })

  it('adds 8px padding and the warning background to a highlighted heading', () => {
    render(
      <AdvertisementHeader
        highlighted
        tone="warning"
        label="Končí za 3 dny"
        dateInfo="1. 9. – 30. 9. 2026"
      />,
    )

    const heading = screen.getByTestId('job-card-advertisement-heading')
    expect(heading).toHaveAttribute('data-highlighted', 'true')
    expect(heading.className).toContain('tm-p-2')
    expect(heading.className).toContain('tm-bg-emotion-warning-background')
    expect(heading.className).toContain('tm-text-base')
    expect(within(heading).getByTestId('job-card-advertisement-heading-label').className).toContain(
      'tm-text-base',
    )
    expect(within(heading).getByTestId('job-card-advertisement-heading-date').className).toContain(
      'tm-text-base',
    )
    const icon = within(heading).getByTestId('job-card-advertisement-heading-icon')
    expect(icon).toHaveAttribute('data-icon-name', 'clock')
    expect(
      icon.compareDocumentPosition(
        within(heading).getByTestId('job-card-advertisement-heading-label'),
      ) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy()
  })

  it('has no padding or background without the highlight', () => {
    render(<AdvertisementHeader tone="warning" label="Expirováno před 20 dny" />)

    const heading = screen.getByTestId('job-card-advertisement-heading')
    expect(heading).not.toHaveAttribute('data-highlighted')
    expect(heading.className).not.toContain('tm-p-2')
    expect(heading.className).not.toMatch(/tm-bg-/)
    expect(heading.className).toContain('tm-text-sm')
    expect(heading.className).not.toContain('tm-text-base')
    expect(
      within(heading).queryByTestId('job-card-advertisement-heading-icon'),
    ).not.toBeInTheDocument()
  })

  it('shows the label of ended advertisements in the muted tone', () => {
    render(<AdvertisementHeader tone="ended" label="Expirováno" dateInfo="1. 8. – 15. 8. 2026" />)

    const heading = screen.getByTestId('job-card-advertisement-heading')
    expect(within(heading).getByTestId('job-card-advertisement-heading-label')).toHaveTextContent(
      'Expirováno',
    )
    expect(heading).toHaveTextContent('Expirováno 1. 8. – 15. 8. 2026')
    expect(heading.className).toContain('tm-text-secondary-default')
  })

  it('shows the label when there is no date', () => {
    render(<AdvertisementHeader tone="ended" label="Ukončené vystavování" />)

    const heading = screen.getByTestId('job-card-advertisement-heading')
    expect(within(heading).getByTestId('job-card-advertisement-heading-label')).toHaveTextContent(
      'Ukončené vystavování',
    )
    expect(
      within(heading).queryByTestId('job-card-advertisement-heading-date'),
    ).not.toBeInTheDocument()
  })

  it('mutes not-yet-published headers', () => {
    render(<AdvertisementHeader tone="neutral" label="Zatím nevystavený inzerát" />)

    const heading = screen.getByTestId('job-card-advertisement-heading')
    expect(heading).toHaveTextContent('Zatím nevystavený inzerát')
    expect(heading.className).toContain('tm-text-secondary-default')
  })
})
