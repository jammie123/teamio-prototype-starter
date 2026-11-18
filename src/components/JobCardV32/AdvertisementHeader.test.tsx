import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { AdvertisementHeader } from './AdvertisementHeader'

describe('AdvertisementHeader', () => {
  it('hides the label by default when a date is present', () => {
    render(<AdvertisementHeader tone="success" label="Běží" dateInfo="1. 1. – 1. 2. 2026" />)

    const heading = screen.getByTestId('job-card-advertisement-heading')
    expect(within(heading).queryByTestId('job-card-advertisement-heading-label')).not.toBeInTheDocument()
    expect(heading).toHaveTextContent('1. 1. – 1. 2. 2026')
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
    expect(heading.className).toContain('tm-items-baseline')
    expect(heading.className).toContain('tm-gap-2')
    expect(heading.className).toContain('tm-text-emotion-success-emphasis')
    expect(heading.className).not.toContain('tm-rounded-full')
    expect(heading.className).not.toContain('tm-w-full')
    expect(heading.className).not.toMatch(/tm-bg-/)
    expect(label).toHaveTextContent('Běží')
    expect(label.className).toContain('tm-text-sm')
    expect(label.className).toContain('tm-font-medium')
    expect(label.className).not.toContain('tm-font-semibold')
    expect(label.className).not.toContain('tm-font-bold')
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

  it('always shows the warning label in bold', () => {
    render(
      <AdvertisementHeader tone="warning" label="Brzy končí" dateInfo="1. 9. – 30. 9. 2026" />,
    )

    const heading = screen.getByTestId('job-card-advertisement-heading')
    const label = within(heading).getByTestId('job-card-advertisement-heading-label')
    expect(heading.className).toContain('tm-text-emotion-warning-emphasis')
    expect(label).toHaveTextContent('Brzy končí')
    expect(label.className).toContain('tm-font-bold')
    expect(heading).toHaveTextContent('Brzy končí 1. 9. – 30. 9. 2026')
  })

  it('shows the label when there is no date', () => {
    render(<AdvertisementHeader tone="success" label="Běží v různých obdobích" />)

    expect(screen.getByTestId('job-card-advertisement-heading-label')).toHaveTextContent(
      'Běží v různých obdobích',
    )
  })

  it('does not tint or pill the heading background', () => {
    const { rerender } = render(<AdvertisementHeader tone="success" label="Běží" />)
    const heading = () => screen.getByTestId('job-card-advertisement-heading')

    expect(heading().className).not.toContain('tm-rounded-full')
    expect(heading().className).not.toContain('tm-px-3')
    expect(heading().className).not.toMatch(/tm-bg-/)

    rerender(<AdvertisementHeader tone="warning" label="Brzy končí" />)
    expect(heading().className).not.toContain('tm-rounded-full')
    expect(heading().className).not.toMatch(/tm-bg-/)

    rerender(<AdvertisementHeader tone="ended" label="Ukončeno" />)
    expect(heading().className).not.toContain('tm-rounded-full')
    expect(heading().className).not.toMatch(/tm-bg-/)

    rerender(<AdvertisementHeader tone="neutral" label="Zatím nevystavený inzerát" />)
    expect(heading().className).not.toMatch(/tm-bg-/)
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
