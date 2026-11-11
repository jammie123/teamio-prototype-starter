import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { AdvertisementHeader } from './AdvertisementHeader'

describe('AdvertisementHeader', () => {
  it('hides the label by default when a date is present', () => {
    render(<AdvertisementHeader tone="success" label="Běží" dateInfo="1. 1. – 1. 2. 2026" />)

    const heading = screen.getByTestId('job-card-advertisement-heading')
    expect(within(heading).queryByTestId('job-card-advertisement-heading-label')).not.toBeInTheDocument()
    expect(heading).toHaveTextContent('1. 1. – 1. 2. 2026')
    expect(heading.className).not.toContain('tm-justify-between')
  })

  it('places the date next to the label on one line when the label is shown', () => {
    render(
      <AdvertisementHeader
        tone="success"
        label="Běží"
        dateInfo="1. 1. – 1. 2. 2026"
        showLabel
      />,
    )

    const heading = screen.getByTestId('job-card-advertisement-heading')
    const label = within(heading).getByTestId('job-card-advertisement-heading-label')
    const date = within(heading).getByTestId('job-card-advertisement-heading-date')

    expect(heading).toHaveTextContent('Běží 1. 1. – 1. 2. 2026')
    expect(heading.className).toContain('tm-flex-row')
    expect(heading.className).toContain('tm-w-full')
    expect(heading.className).toContain('tm-justify-start')
    expect(heading.className).toContain('tm-items-start')
    expect(heading.className).toContain('tm-gap-8')
    expect(heading.className).toContain('md:tm-justify-between')
    expect(heading.className).toContain('md:tm-items-baseline')
    expect(heading.className).toContain('md:tm-gap-0')
    expect(heading.className).not.toContain('tm-gap-5')
    expect(heading.className).toContain('tm-text-emotion-success-emphasis')
    expect(label).toHaveTextContent('Běží')
    expect(label.className).toContain('tm-text-sm')
    expect(label.className).toContain('tm-font-medium')
    expect(label.className).not.toContain('tm-font-semibold')
    expect(date).toHaveTextContent('1. 1. – 1. 2. 2026')
    expect(label.compareDocumentPosition(date) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(date.className).toContain('tm-text-sm')
    expect(date.className).toContain('tm-font-normal')
    expect(date.className).toContain('tm-text-secondary-default')
  })

  it('always shows the label for ended tone', () => {
    render(<AdvertisementHeader tone="ended" label="Ukončeno" dateInfo="1. 8. – 15. 8. 2026" />)

    const heading = screen.getByTestId('job-card-advertisement-heading')
    expect(within(heading).getByTestId('job-card-advertisement-heading-label')).toHaveTextContent(
      'Ukončeno',
    )
    expect(heading).toHaveTextContent('Ukončeno 1. 8. – 15. 8. 2026')
  })

  it('always shows the label for warning tone', () => {
    render(
      <AdvertisementHeader tone="warning" label="Končí za 3 dny" dateInfo="1. 9. – 30. 9. 2026" />,
    )

    const heading = screen.getByTestId('job-card-advertisement-heading')
    expect(heading.className).toContain('tm-text-emotion-warning-emphasis')
    expect(within(heading).getByTestId('job-card-advertisement-heading-label')).toHaveTextContent(
      'Končí za 3 dny',
    )
  })

  it('shows the label when there is no date', () => {
    render(<AdvertisementHeader tone="success" label="Běží v různých obdobích" />)

    expect(screen.getByTestId('job-card-advertisement-heading-label')).toHaveTextContent(
      'Běží v různých obdobích',
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
