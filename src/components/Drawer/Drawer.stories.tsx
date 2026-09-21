import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { expect, userEvent, within } from 'storybook/test'
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

const meta = {
  title: 'Complex components/Drawer',
  component: Drawer,
} satisfies Meta<typeof Drawer>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: function DefaultDrawer() {
    return (
      <Drawer>
        <DrawerTrigger asChild>
          <Button>Otevřít panel</Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerTitle>Historie inzerce</DrawerTitle>
          <DrawerClose aria-label="Zavřít panel" />
          <DrawerDescription>Přehled vystavení a topování na portálech.</DrawerDescription>
          <DrawerBody>Ukázkový obsah pravého panelu.</DrawerBody>
          <DrawerFooter>
            <Button>Potvrdit</Button>
            <DrawerClose asChild aria-label="Zrušit">
              <Button variant="secondary">Zrušit</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Otevřít panel' }))
    const dialog = await within(document.body).findByRole('dialog')
    await expect(dialog).toBeVisible()
    await expect(dialog).toHaveAccessibleName('Historie inzerce')
    await userEvent.click(within(dialog).getByRole('button', { name: 'Zavřít panel' }))
    await expect(within(document.body).queryByRole('dialog')).not.toBeInTheDocument()
  },
}

export const Scrollable: Story = {
  render: function ScrollableDrawer() {
    return (
      <Drawer>
        <DrawerTrigger asChild>
          <Button>Otevřít scrollovatelný panel</Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerTitle>Dlouhý obsah</DrawerTitle>
          <DrawerClose aria-label="Zavřít panel" />
          <DrawerBody>
            {Array.from({ length: 20 }, (_, index) => (
              <p key={index} className="tm-mb-3">
                Odstavec {index + 1}: při scrollování zůstane nadpis i patička na místě.
              </p>
            ))}
          </DrawerBody>
          <DrawerFooter>
            <Button>Rozumím</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    )
  },
}

export const NoFooter: Story = {
  render: function NoFooterDrawer() {
    return (
      <Drawer>
        <DrawerTrigger asChild>
          <Button>Otevřít panel bez patičky</Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerTitle>Jen náhled</DrawerTitle>
          <DrawerClose aria-label="Zavřít panel" />
          <DrawerBody>Patička se vynechá, když nejsou primární akce.</DrawerBody>
        </DrawerContent>
      </Drawer>
    )
  },
}

export const Controlled: Story = {
  render: function ControlledDrawer() {
    const [open, setOpen] = useState(false)
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <Button onClick={() => setOpen(true)}>Otevřít řízený panel</Button>
        <DrawerContent>
          <DrawerTitle>Řízený panel</DrawerTitle>
          <DrawerClose aria-label="Zavřít panel" />
          <DrawerBody>Stav otevření je řízen zvenku přes open/onOpenChange.</DrawerBody>
          <DrawerFooter>
            <Button onClick={() => setOpen(false)}>Zavřít</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    )
  },
}
