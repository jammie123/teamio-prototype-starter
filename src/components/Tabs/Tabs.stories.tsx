import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { expect, userEvent, within } from 'storybook/test'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './Tabs'

const meta = {
  title: 'Components/Tabs',
  component: Tabs,
} satisfies Meta<typeof Tabs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Tabs defaultValue="prehled">
      <TabsList aria-label="Sekce kandidáta">
        <TabsTrigger value="prehled">Přehled</TabsTrigger>
        <TabsTrigger value="detaily">Detaily</TabsTrigger>
        <TabsTrigger value="historie">Historie</TabsTrigger>
      </TabsList>
      <TabsContent value="prehled">Základní informace o uchazeči a stavu náboru.</TabsContent>
      <TabsContent value="detaily">Kontaktní údaje, CV a poznámky recruitera.</TabsContent>
      <TabsContent value="historie">Chronologie změn a komunikace s kandidátem.</TabsContent>
    </Tabs>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const details = canvas.getByRole('tab', { name: 'Detaily' })
    await userEvent.click(details)
    await expect(details).toHaveAttribute('aria-selected', 'true')
    await expect(canvas.getByRole('tabpanel')).toHaveTextContent(
      'Kontaktní údaje, CV a poznámky recruitera.',
    )

    const historie = canvas.getByRole('tab', { name: 'Historie' })
    historie.focus()
    await userEvent.keyboard('{ArrowLeft}')
    await expect(details).toHaveFocus()
  },
}

export const WithDisabled: Story = {
  render: () => (
    <Tabs defaultValue="aktivni">
      <TabsList aria-label="Filtry náboru">
        <TabsTrigger value="aktivni">Aktivní</TabsTrigger>
        <TabsTrigger value="archiv" disabled>
          Archiv
        </TabsTrigger>
        <TabsTrigger value="navrhy">Návrhy</TabsTrigger>
      </TabsList>
      <TabsContent value="aktivni">Otevřené pozice.</TabsContent>
      <TabsContent value="archiv">Uzavřené pozice.</TabsContent>
      <TabsContent value="navrhy">Návrhy k publikaci.</TabsContent>
    </Tabs>
  ),
}

export const Controlled: Story = {
  render: function ControlledTabs() {
    const [value, setValue] = useState('jedna')
    return (
      <Tabs value={value} onValueChange={setValue}>
        <TabsList aria-label="Řízené záložky">
          <TabsTrigger value="jedna">První</TabsTrigger>
          <TabsTrigger value="druha">Druhá</TabsTrigger>
        </TabsList>
        <TabsContent value="jedna">Obsah první záložky.</TabsContent>
        <TabsContent value="druha">Obsah druhé záložky.</TabsContent>
      </Tabs>
    )
  },
}
