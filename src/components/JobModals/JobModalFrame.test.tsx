import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Button } from '../Button'
import { JobModalFrame } from './JobModalFrame'

describe('JobModalFrame', () => {
  it('renders title, body, confirm and cancel in a default-size dialog', async () => {
    render(
      <JobModalFrame
        defaultOpen
        title="Ukončit vystavení"
        confirmLabel="Ukončit vystavení"
        onConfirm={() => undefined}
      >
        Tělo dialogu
      </JobModalFrame>,
    )

    const dialog = await screen.findByRole('dialog')
    expect(dialog).toHaveAccessibleName('Ukončit vystavení')
    expect(dialog).toHaveClass('tm-max-w-[600px]')
    expect(within(dialog).getByText('Tělo dialogu')).toBeInTheDocument()
    expect(within(dialog).getByText('Tělo dialogu')).toHaveClass(
      'tm-min-h-0',
      'tm-max-h-[calc(100vh-10rem)]',
      'tm-overflow-y-auto',
    )
    expect(within(dialog).getByRole('button', { name: 'Ukončit vystavení' })).toBeInTheDocument()
    expect(within(dialog).getByRole('button', { name: 'Zrušit' })).toBeInTheDocument()
    expect(within(dialog).getByRole('button', { name: 'Zavřít dialog' })).toBeInTheDocument()
  })

  it('renders optional footerEnd on the right of the footer', async () => {
    render(
      <JobModalFrame
        defaultOpen
        title="Ukončit vystavení"
        confirmLabel="Ukončit vystavení"
        footerEnd={<span data-testid="job-modal-footer-end">vystavení 2 · celkem 1 290 Kč</span>}
      >
        Tělo
      </JobModalFrame>,
    )

    const dialog = await screen.findByRole('dialog')
    const footerEnd = within(dialog).getByTestId('job-modal-footer-end')
    expect(footerEnd).toHaveTextContent('vystavení 2 · celkem 1 290 Kč')
    expect(footerEnd.parentElement).toHaveClass('tm-text-sm', 'tm-text-primary-default', 'tm-ml-auto')
  })

  it('disables confirm and does not call onConfirm when disabled', async () => {
    const user = userEvent.setup()
    const onConfirm = vi.fn()

    render(
      <JobModalFrame
        defaultOpen
        title="Ukončit vystavení"
        confirmLabel="Ukončit vystavení"
        confirmDisabled
        onConfirm={onConfirm}
      >
        Tělo
      </JobModalFrame>,
    )

    const confirm = await screen.findByRole('button', { name: 'Ukončit vystavení' })
    expect(confirm).toBeDisabled()
    await user.click(confirm)
    expect(onConfirm).not.toHaveBeenCalled()
  })

  it('calls onConfirm from the primary footer button', async () => {
    const user = userEvent.setup()
    const onConfirm = vi.fn()

    render(
      <JobModalFrame
        defaultOpen
        title="Ukončit vystavení"
        confirmLabel="Ukončit vystavení"
        onConfirm={onConfirm}
      >
        Tělo
      </JobModalFrame>,
    )

    await user.click(await screen.findByRole('button', { name: 'Ukončit vystavení' }))
    expect(onConfirm).toHaveBeenCalledTimes(1)
  })

  it('closes from Zrušit and from the header close button', async () => {
    const user = userEvent.setup()

    render(
      <JobModalFrame
        defaultOpen
        title="Ukončit vystavení"
        confirmLabel="Ukončit vystavení"
        trigger={<Button>Otevřít</Button>}
      >
        Tělo
      </JobModalFrame>,
    )

    await user.click(await screen.findByRole('button', { name: 'Zrušit' }))
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    await user.click(screen.getByRole('button', { name: 'Otevřít' }))
    const dialog = await screen.findByRole('dialog')
    await user.click(within(dialog).getByRole('button', { name: 'Zavřít dialog' }))
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
  })
})
