import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { Button } from '../Button'
import {
  Drawer,
  DrawerBody,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerTitle,
  DrawerTrigger,
} from './Drawer'

describe('Drawer', () => {
  it('opens from trigger and exposes required accessible title', async () => {
    const user = userEvent.setup()
    render(
      <Drawer>
        <DrawerTrigger asChild>
          <Button>Otevřít</Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerTitle>Historie inzerce</DrawerTitle>
          <DrawerDescription>Přehled vystavení a topování.</DrawerDescription>
          <DrawerFooter>
            <Button>Potvrdit</Button>
          </DrawerFooter>
          <DrawerClose aria-label="Zavřít panel" />
        </DrawerContent>
      </Drawer>,
    )

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Otevřít' }))

    const dialog = await screen.findByRole('dialog')
    expect(dialog).toHaveAccessibleName('Historie inzerce')
    expect(dialog).toHaveAccessibleDescription('Přehled vystavení a topování.')
    expect(within(dialog).getByRole('button', { name: 'Zavřít panel' })).toBeInTheDocument()
  })

  it('supports controlled open state and closes on Escape', async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()

    function Controlled() {
      const [open, setOpen] = useState(true)
      return (
        <Drawer
          open={open}
          onOpenChange={(next) => {
            onOpenChange(next)
            setOpen(next)
          }}
        >
          <DrawerContent>
            <DrawerTitle>Řízený panel</DrawerTitle>
            <DrawerClose aria-label="Zavřít" />
          </DrawerContent>
        </Drawer>
      )
    }

    render(<Controlled />)
    expect(await screen.findByRole('dialog')).toHaveAccessibleName('Řízený panel')

    await user.keyboard('{Escape}')
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it('closes when the overlay is clicked', async () => {
    const user = userEvent.setup()
    render(
      <Drawer defaultOpen>
        <DrawerContent>
          <DrawerTitle>Overlay</DrawerTitle>
          <DrawerClose aria-label="Zavřít" />
        </DrawerContent>
      </Drawer>,
    )

    expect(await screen.findByRole('dialog')).toBeInTheDocument()

    const overlay = document.querySelector('[data-drawer-overlay]')
    expect(overlay).toBeTruthy()
    await user.click(overlay as Element)

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
  })

  it('positions the panel as a full-height right drawer', async () => {
    render(
      <Drawer open onOpenChange={() => undefined}>
        <DrawerContent>
          <DrawerTitle>Pozice</DrawerTitle>
        </DrawerContent>
      </Drawer>,
    )

    const dialog = await screen.findByRole('dialog')
    expect(dialog).toHaveClass(
      'tm-fixed',
      'tm-inset-y-0',
      'tm-right-0',
      'tm-z-50',
      'tm-flex',
      'tm-h-full',
      'tm-w-full',
      'sm:tm-w-[480px]',
      'tm-flex-col',
      'tm-overflow-hidden',
      'tm-bg-basic',
      'tm-shadow-lg',
    )
    expect(dialog).not.toHaveClass('tm-left-1/2', 'tm-top-1/2')
  })

  it('keeps header and footer from scrolling while the body scrolls', async () => {
    render(
      <Drawer open onOpenChange={() => undefined}>
        <DrawerContent>
          <DrawerTitle>Sticky chrome</DrawerTitle>
          <DrawerClose aria-label="Zavřít" />
          <DrawerBody>Dlouhý obsah</DrawerBody>
          <DrawerFooter>
            <Button>Potvrdit</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>,
    )

    const title = await screen.findByRole('heading', { name: 'Sticky chrome' })
    const header = title.parentElement as HTMLElement
    expect(header).toHaveClass('tm-shrink-0', 'tm-p-6', 'tm-pr-14')

    const body = screen.getByText('Dlouhý obsah')
    expect(body).toHaveClass('tm-grow', 'tm-overflow-y-auto', 'tm-min-h-0')

    const footer = screen.getByRole('button', { name: 'Potvrdit' }).parentElement as HTMLElement
    expect(footer).toHaveClass('tm-shrink-0', 'tm-bg-basic')
    expect(footer).not.toHaveClass('tm-overflow-y-auto')
  })

  it('keeps absolute icon chrome on the default close button', async () => {
    render(
      <Drawer open onOpenChange={() => undefined}>
        <DrawerContent>
          <DrawerTitle>Chrome</DrawerTitle>
          <DrawerClose aria-label="Zavřít panel" />
        </DrawerContent>
      </Drawer>,
    )

    const dialog = await screen.findByRole('dialog')
    const close = within(dialog).getByRole('button', { name: 'Zavřít panel' })
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
      <Drawer open onOpenChange={() => undefined}>
        <DrawerContent>
          <DrawerTitle>Footer</DrawerTitle>
          <DrawerClose aria-label="Zavřít panel" />
          <DrawerFooter>
            <Button>Potvrdit</Button>
            <DrawerClose asChild aria-label="Zrušit">
              <Button variant="secondary">Zrušit</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>,
    )

    const dialog = await screen.findByRole('dialog')
    const footerClose = within(dialog).getByRole('button', { name: 'Zrušit' })

    expect(footerClose).not.toHaveClass('tm-absolute')
    expect(footerClose).not.toHaveClass('tm-right-4')
    expect(footerClose).toHaveClass('tm-rounded-full', 'tm-px-4', 'tm-bg-basic')
  })
})
