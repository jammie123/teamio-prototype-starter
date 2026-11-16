import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { IconButton } from './IconButton'

describe('IconButton', () => {
  it('renders a circular tertiary icon button with an accessible name', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<IconButton icon="eye" aria-label="Náhled" onClick={onClick} />)

    const button = screen.getByRole('button', { name: 'Náhled' })
    expect(button).toHaveClass('tm-size-8', 'tm-rounded-full', 'tm-bg-transparent')
    expect(screen.getByTestId('icon')).toHaveAttribute('data-icon-name', 'eye')

    await user.click(button)
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('shows the tooltip on hover', async () => {
    const user = userEvent.setup()
    render(<IconButton icon="eye" aria-label="Náhled" tooltip="Náhled inzerátu" />)

    await user.hover(screen.getByRole('button', { name: 'Náhled' }))
    await waitFor(() => {
      expect(screen.getByRole('tooltip')).toHaveTextContent('Náhled inzerátu')
    })
  })

  it('renders no tooltip when none is given', async () => {
    const user = userEvent.setup()
    render(<IconButton icon="edit" aria-label="Editovat" />)

    await user.hover(screen.getByRole('button', { name: 'Editovat' }))
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
  })
})
