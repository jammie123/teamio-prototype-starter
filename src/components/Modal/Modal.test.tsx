import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { Button } from '../Button'
import {
  Modal,
  ModalClose,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalTitle,
  ModalTrigger,
} from './Modal'

describe('Modal', () => {
  it('opens from trigger and exposes required accessible title', async () => {
    const user = userEvent.setup()
    render(
      <Modal>
        <ModalTrigger asChild>
          <Button>Otevřít</Button>
        </ModalTrigger>
        <ModalContent>
          <ModalTitle>Potvrzení</ModalTitle>
          <ModalDescription>Opravdu chcete pokračovat?</ModalDescription>
          <ModalFooter>
            <Button>Ano</Button>
          </ModalFooter>
          <ModalClose aria-label="Zavřít dialog" />
        </ModalContent>
      </Modal>,
    )

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Otevřít' }))

    const dialog = await screen.findByRole('dialog')
    expect(dialog).toHaveAccessibleName('Potvrzení')
    expect(dialog).toHaveAccessibleDescription('Opravdu chcete pokračovat?')
    expect(within(dialog).getByRole('button', { name: 'Zavřít dialog' })).toBeInTheDocument()
  })

  it('supports controlled open state and closes on Escape', async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()

    function Controlled() {
      const [open, setOpen] = useState(true)
      return (
        <Modal
          open={open}
          onOpenChange={(next) => {
            onOpenChange(next)
            setOpen(next)
          }}
        >
          <ModalContent>
            <ModalTitle>Řízený modal</ModalTitle>
            <ModalClose aria-label="Zavřít" />
          </ModalContent>
        </Modal>
      )
    }

    render(<Controlled />)
    expect(await screen.findByRole('dialog')).toHaveAccessibleName('Řízený modal')

    await user.keyboard('{Escape}')
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it('traps focus inside the dialog and restores it to the trigger', async () => {
    const user = userEvent.setup()
    render(
      <Modal>
        <ModalTrigger asChild>
          <Button>Spustit</Button>
        </ModalTrigger>
        <ModalContent>
          <ModalTitle>Fokus</ModalTitle>
          <Button>Akce</Button>
          <ModalClose aria-label="Zavřít fokus" />
        </ModalContent>
      </Modal>,
    )

    const trigger = screen.getByRole('button', { name: 'Spustit' })
    await user.click(trigger)

    const dialog = await screen.findByRole('dialog')
    const close = within(dialog).getByRole('button', { name: 'Zavřít fokus' })
    const action = within(dialog).getByRole('button', { name: 'Akce' })

    expect(dialog.contains(document.activeElement)).toBe(true)

    await user.tab()
    expect([close, action, dialog].some((el) => el === document.activeElement || el.contains(document.activeElement))).toBe(
      true,
    )

    await user.click(close)
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
    expect(trigger).toHaveFocus()
  })

  it('applies size variants on the dialog content', async () => {
    render(
      <Modal open onOpenChange={() => undefined}>
        <ModalContent size="wide">
          <ModalTitle>Široký</ModalTitle>
        </ModalContent>
      </Modal>,
    )

    const dialog = await screen.findByRole('dialog')
    expect(dialog).toHaveClass('tm-max-w-[900px]')
  })

  it('forwards overlayClassName onto the overlay', async () => {
    render(
      <Modal open onOpenChange={() => undefined}>
        <ModalContent overlayClassName="tm-z-[60]">
          <ModalTitle>Overlay</ModalTitle>
        </ModalContent>
      </Modal>,
    )

    await screen.findByRole('dialog')
    const overlay = document.querySelector('.tm-bg-inverted\\/20')
    expect(overlay).toHaveClass('tm-z-[60]')
  })

  it('applies the default size constraint when no size is given', async () => {
    render(
      <Modal open onOpenChange={() => undefined}>
        <ModalContent>
          <ModalTitle>Výchozí</ModalTitle>
        </ModalContent>
      </Modal>,
    )

    const dialog = await screen.findByRole('dialog')
    expect(dialog).toHaveClass('tm-max-w-[600px]')
    expect(dialog).not.toHaveClass('tm-max-w-[900px]', 'tm-max-w-[1600px]')
  })

  it('applies responsive width classes for the full size', async () => {
    render(
      <Modal open onOpenChange={() => undefined}>
        <ModalContent size="full">
          <ModalTitle>Plný</ModalTitle>
        </ModalContent>
      </Modal>,
    )

    const dialog = await screen.findByRole('dialog')
    expect(dialog).toHaveClass('tm-max-w-[1600px]', 'md:tm-w-[90%]', 'lg:tm-w-[80%]')
    expect(dialog).not.toHaveClass('tm-max-w-[600px]', 'tm-max-w-[900px]')
  })

  it('positions the dialog content as fixed without a conflicting relative class', async () => {
    render(
      <Modal open onOpenChange={() => undefined}>
        <ModalContent>
          <ModalTitle>Pozicování</ModalTitle>
        </ModalContent>
      </Modal>,
    )

    const dialog = await screen.findByRole('dialog')
    expect(dialog).toHaveClass('tm-fixed')
    expect(dialog).not.toHaveClass('tm-relative')
  })

  it('styles the title with source-faithful header spacing and typography', async () => {
    render(
      <Modal open onOpenChange={() => undefined}>
        <ModalContent>
          <ModalTitle>Nadpis</ModalTitle>
          <ModalClose aria-label="Zavřít" />
        </ModalContent>
      </Modal>,
    )

    const title = await screen.findByRole('heading', { name: 'Nadpis' })
    expect(title).toHaveClass('tm-m-0', 'tm-font-inherit', 'tm-font-semibold')
    expect(title).not.toHaveClass('tm-text-xl')

    const header = title.parentElement as HTMLElement
    expect(header).toHaveClass('tm-p-6', 'tm-pr-14')
    expect(header).not.toHaveClass('tm-flex', 'tm-justify-between', 'tm-items-start', 'tm-gap-4')
  })

  it('keeps absolute icon chrome on the default close button', async () => {
    render(
      <Modal open onOpenChange={() => undefined}>
        <ModalContent>
          <ModalTitle>Chrome</ModalTitle>
          <ModalClose aria-label="Zavřít dialog" />
        </ModalContent>
      </Modal>,
    )

    const dialog = await screen.findByRole('dialog')
    const close = within(dialog).getByRole('button', { name: 'Zavřít dialog' })
    expect(close).toHaveClass(
      'tm-absolute',
      'tm-right-4',
      'tm-top-4',
      'tm-p-2',
      'tm-bg-transparent',
      'tm-rounded',
      'tm-border-0',
    )
  })

  it('does not merge icon chrome onto asChild close children in the footer', async () => {
    render(
      <Modal open onOpenChange={() => undefined}>
        <ModalContent>
          <ModalTitle>Footer</ModalTitle>
          <ModalClose aria-label="Zavřít dialog" />
          <ModalFooter>
            <Button>Potvrdit</Button>
            <ModalClose asChild aria-label="Zrušit">
              <Button variant="secondary">Zrušit</Button>
            </ModalClose>
          </ModalFooter>
        </ModalContent>
      </Modal>,
    )

    const dialog = await screen.findByRole('dialog')
    const footerClose = within(dialog).getByRole('button', { name: 'Zrušit' })

    expect(footerClose).not.toHaveClass('tm-absolute')
    expect(footerClose).not.toHaveClass('tm-right-4')
    expect(footerClose).not.toHaveClass('tm-top-4')
    expect(footerClose).not.toHaveClass('tm-p-2')
    expect(footerClose).not.toHaveClass('tm-bg-transparent')
    expect(footerClose).not.toHaveClass('tm-border-0')
    expect(footerClose).not.toHaveClass('tm-text-xl')
    expect(footerClose).toHaveClass('tm-rounded-full', 'tm-px-4', 'tm-bg-basic')
  })

  it('closes the dialog from an asChild close child and keeps its accessible label', async () => {
    const user = userEvent.setup()
    render(
      <Modal defaultOpen>
        <ModalContent>
          <ModalTitle>Zrušení</ModalTitle>
          <ModalFooter>
            <ModalClose asChild aria-label="Zrušit">
              <Button variant="secondary">Zrušit</Button>
            </ModalClose>
          </ModalFooter>
        </ModalContent>
      </Modal>,
    )

    const dialog = await screen.findByRole('dialog')
    const footerClose = within(dialog).getByRole('button', { name: 'Zrušit' })
    expect(footerClose).toHaveAccessibleName('Zrušit')

    await user.click(footerClose)
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
  })

  it('keeps a custom className on both default and asChild close buttons', async () => {
    render(
      <Modal open onOpenChange={() => undefined}>
        <ModalContent>
          <ModalTitle>Class</ModalTitle>
          <ModalClose aria-label="Zavřít dialog" className="tm-mt-2" />
          <ModalFooter>
            <ModalClose asChild aria-label="Zrušit" className="tm-ml-auto">
              <Button variant="secondary">Zrušit</Button>
            </ModalClose>
          </ModalFooter>
        </ModalContent>
      </Modal>,
    )

    const dialog = await screen.findByRole('dialog')
    expect(within(dialog).getByRole('button', { name: 'Zavřít dialog' })).toHaveClass('tm-mt-2')
    expect(within(dialog).getByRole('button', { name: 'Zrušit' })).toHaveClass('tm-ml-auto')
  })
})
