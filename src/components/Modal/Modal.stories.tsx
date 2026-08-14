import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { expect, userEvent, within } from 'storybook/test'
import { Button } from '../Button'
import {
  Modal,
  ModalBody,
  ModalClose,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalTitle,
  ModalTrigger,
} from './Modal'

const meta = {
  title: 'Components/Modal',
  component: Modal,
} satisfies Meta<typeof Modal>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: function DefaultModal() {
    return (
      <Modal>
        <ModalTrigger asChild>
          <Button>Otevřít dialog</Button>
        </ModalTrigger>
        <ModalContent>
          <ModalTitle>Potvrzení změny</ModalTitle>
          <ModalClose aria-label="Zavřít dialog" />
          <ModalDescription>Opravdu chcete uložit změny u uchazeče?</ModalDescription>
          <ModalBody>Po potvrzení se stav kandidáta aktualizuje v náboru.</ModalBody>
          <ModalFooter>
            <Button>Potvrdit</Button>
            <ModalClose asChild aria-label="Zrušit">
              <Button variant="secondary">Zrušit</Button>
            </ModalClose>
          </ModalFooter>
        </ModalContent>
      </Modal>
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Otevřít dialog' }))
    const dialog = await within(document.body).findByRole('dialog')
    await expect(dialog).toBeVisible()
    await expect(dialog).toHaveAccessibleName('Potvrzení změny')
    await userEvent.click(within(dialog).getByRole('button', { name: 'Zavřít dialog' }))
    await expect(within(document.body).queryByRole('dialog')).not.toBeInTheDocument()
  },
}

export const Wide: Story = {
  render: function WideModal() {
    return (
      <Modal>
        <ModalTrigger asChild>
          <Button>Otevřít široký dialog</Button>
        </ModalTrigger>
        <ModalContent size="wide">
          <ModalTitle>Detail pozice</ModalTitle>
          <ModalClose aria-label="Zavřít dialog" />
          <ModalBody>Širší dialog pro více obsahu náboru a poznámek.</ModalBody>
          <ModalFooter>
            <Button>Uložit</Button>
            <ModalClose asChild aria-label="Zrušit">
              <Button variant="secondary">Zrušit</Button>
            </ModalClose>
          </ModalFooter>
        </ModalContent>
      </Modal>
    )
  },
}

export const Full: Story = {
  render: function FullModal() {
    return (
      <Modal>
        <ModalTrigger asChild>
          <Button>Otevřít plný dialog</Button>
        </ModalTrigger>
        <ModalContent size="full">
          <ModalTitle>Přehled kandidátů</ModalTitle>
          <ModalClose aria-label="Zavřít dialog" />
          <ModalBody>Nejširší dialog pro rozsáhlý obsah a tabulky.</ModalBody>
          <ModalFooter>
            <Button>Hotovo</Button>
            <ModalClose asChild aria-label="Zavřít">
              <Button variant="secondary">Zavřít</Button>
            </ModalClose>
          </ModalFooter>
        </ModalContent>
      </Modal>
    )
  },
}

export const Scrollable: Story = {
  render: function ScrollableModal() {
    return (
      <Modal>
        <ModalTrigger asChild>
          <Button>Otevřít scrollovatelný dialog</Button>
        </ModalTrigger>
        <ModalContent>
          <ModalTitle>Dlouhý popis pozice</ModalTitle>
          <ModalClose aria-label="Zavřít dialog" />
          <ModalBody>
            {Array.from({ length: 12 }, (_, index) => (
              <p key={index} className="tm-mb-3">
                Odstavec {index + 1}: Teamio pomáhá recruiterům spravovat nábor, komunikaci s
                uchazeči a stav výběrového řízení na jednom místě.
              </p>
            ))}
          </ModalBody>
          <ModalFooter>
            <Button>Rozumím</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    )
  },
}

export const Controlled: Story = {
  render: function ControlledModal() {
    const [open, setOpen] = useState(false)
    return (
      <Modal open={open} onOpenChange={setOpen}>
        <Button onClick={() => setOpen(true)}>Otevřít řízený dialog</Button>
        <ModalContent>
          <ModalTitle>Řízený dialog</ModalTitle>
          <ModalClose aria-label="Zavřít dialog" />
          <ModalBody>Stav otevření je řízen zvenku přes open/onOpenChange.</ModalBody>
          <ModalFooter>
            <Button onClick={() => setOpen(false)}>Zavřít</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    )
  },
}
