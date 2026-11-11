import { fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { PublicationDetails, PublicationHoverCard } from './PublicationHoverCard'
import type { JobPublication } from './types'

const publication: JobPublication = {
  id: 'jobs',
  channel: 'Jobs.cz',
  startDate: '1. 9. 2026',
  endDate: '30. 9. 2026',
  viewCount: 100,
  reactionCount: 5,
}

describe('PublicationDetails', () => {
  it('renders a vertical divider and an external-link icon button beside the portal title', () => {
    const onViewAdvertisement = vi.fn()
    render(<PublicationDetails publication={publication} onViewAdvertisement={onViewAdvertisement} />)

    expect(screen.getByTestId('job-card-publication-stats')).toBeInTheDocument()
    expect(screen.getByText('Míra reakce')).toBeInTheDocument()
    expect(screen.queryByText('Konverze')).not.toBeInTheDocument()
    expect(screen.queryByText('Inzerát')).not.toBeInTheDocument()
    expect(screen.queryByTestId('job-card-advertisement-detail-link')).not.toBeInTheDocument()

    const divider = screen.getByTestId('job-card-publication-view-divider')
    expect(divider).toHaveAttribute('role', 'separator')
    expect(divider.className).toContain('tm-border-l')
    const button = screen.getByRole('button', { name: 'Zobrazit inzerát' })
    expect(button).toHaveClass('tm-size-8')
    expect(within(button).getByTestId('icon')).toHaveAttribute('data-icon-name', 'external-link')
    fireEvent.click(button)
    expect(onViewAdvertisement).toHaveBeenCalledOnce()
  })
})

describe('PublicationHoverCard', () => {
  async function openCard(
    props: Partial<Parameters<typeof PublicationHoverCard>[0]> = {},
  ) {
    const user = userEvent.setup()
    render(
      <PublicationHoverCard
        dropdownTestId="job-card-publication-dropdown"
        trigger={<span>Jobs.cz</span>}
        {...props}
      >
        <PublicationDetails publication={publication} onViewAdvertisement={props.onViewAdvertisement} />
      </PublicationHoverCard>,
    )
    await user.hover(screen.getByText('Jobs.cz'))
    return screen.findByTestId('job-card-publication-dropdown')
  }

  it('sets a fixed 300px width and shows Prodloužit and Zvýraznit in a row when requested', async () => {
    const onProlong = vi.fn()
    const onHighlight = vi.fn()
    const dropdown = await openCard({
      showProlong: true,
      showHighlight: true,
      onProlong,
      onHighlight,
    })

    // `max-w` alone is only a cap: the panel is `tm-w-max`, so width must be set explicitly.
    expect(dropdown).toHaveClass('!tm-w-[300px]')
    expect(dropdown.firstElementChild).toHaveClass('tm-w-full')

    const actions = screen.getByTestId('job-card-publication-actions')
    expect(actions).toHaveClass('tm-flex-row')
    expect(within(actions).queryByRole('button', { name: 'Zobrazit inzerát' })).not.toBeInTheDocument()

    const prolong = within(actions).getByRole('button', { name: 'Prodloužit' })
    const highlight = within(actions).getByRole('button', { name: 'Zvýraznit' })
    expect(prolong).toHaveClass('tm-min-h-8')
    expect(highlight).toHaveClass('tm-min-h-8')

    fireEvent.click(prolong)
    fireEvent.click(highlight)
    expect(onProlong).toHaveBeenCalledOnce()
    expect(onHighlight).toHaveBeenCalledOnce()
  })

  it('hides the action row when neither button is requested', async () => {
    await openCard()

    expect(screen.queryByTestId('job-card-publication-actions')).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Prodloužit' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Zvýraznit' })).not.toBeInTheDocument()
    expect(screen.getByTestId('job-card-publication-view-advertisement')).toBeInTheDocument()
  })

  it('shows Znovuvystavit inzerát only when requested for an ended publication', async () => {
    const onRepublish = vi.fn()
    await openCard({ showRepublish: true, onRepublish })

    const republish = screen.getByTestId('job-card-publication-republish')
    expect(republish).toHaveTextContent('Znovuvystavit inzerát')
    expect(screen.queryByRole('button', { name: 'Prodloužit' })).not.toBeInTheDocument()
    fireEvent.click(republish)
    expect(onRepublish).toHaveBeenCalledOnce()
  })

  it('can show only Zvýraznit', async () => {
    await openCard({ showHighlight: true, onHighlight: vi.fn() })

    const actions = screen.getByTestId('job-card-publication-actions')
    expect(within(actions).queryByRole('button', { name: 'Prodloužit' })).not.toBeInTheDocument()
    expect(within(actions).getByRole('button', { name: 'Zvýraznit' })).toBeInTheDocument()
  })
})
