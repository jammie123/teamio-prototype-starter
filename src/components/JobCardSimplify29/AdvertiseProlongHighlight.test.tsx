import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { AdvertiseProlongHighlight } from './AdvertiseProlongHighlight'

describe('AdvertiseProlongHighlight', () => {
  it('renders logos, title, perex and a primary Prodloužit action', () => {
    const onProlong = vi.fn()

    render(
      <AdvertiseProlongHighlight
        channels={['Jobs.cz', 'Prace.cz']}
        title="Inzerce ukončena na 2 portálech"
        perex="Ukončeno 1. 1. a 15. 2."
        onProlong={onProlong}
      />,
    )

    const banner = screen.getByTestId('advertise-prolong-highlight')
    expect(banner).toHaveTextContent('Inzerce ukončena na 2 portálech')
    expect(banner).toHaveTextContent('Ukončeno 1. 1. a 15. 2.')
    expect(screen.getAllByTestId('job-portal-logo')).toHaveLength(2)
    expect(screen.queryByRole('button', { name: /zatím ne/i })).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Prodloužit' }))
    expect(onProlong).toHaveBeenCalledTimes(1)
  })

  it('uses a single portal name as the title', () => {
    render(
      <AdvertiseProlongHighlight
        channels={['Jobs.cz']}
        title="Jobs.cz"
        perex="Ukončeno 1. 1."
      />,
    )

    expect(screen.getByTestId('advertise-prolong-highlight')).toHaveTextContent('Jobs.cz')
    expect(screen.getAllByTestId('job-portal-logo')).toHaveLength(1)
    expect(screen.queryByRole('button', { name: 'Prodloužit' })).not.toBeInTheDocument()
  })
})
