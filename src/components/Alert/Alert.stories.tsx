import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Alert } from './Alert'

const meta = {
  title: 'Components/Alert',
  component: Alert,
} satisfies Meta<typeof Alert>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: 'Informativní zpráva pro uživatele náboru.',
  },
}

export const Success: Story = {
  args: {
    variant: 'success',
    children: 'Uchazeč byl úspěšně pozván na pohovor.',
  },
}

export const Warning: Story = {
  args: {
    variant: 'warning',
    children: 'Zkontrolujte povinné údaje u pozice.',
  },
}

export const Error: Story = {
  args: {
    variant: 'error',
    children: 'Nepodařilo se uložit změny kandidáta.',
  },
}

export const Dismissible: Story = {
  render: function DismissibleAlert() {
    const [open, setOpen] = useState(true)
    if (!open) {
      return (
        <button type="button" onClick={() => setOpen(true)}>
          Zobrazit alert
        </button>
      )
    }
    return (
      <Alert onDismiss={() => setOpen(false)} dismissLabel="Zavřít upozornění">
        Tuto zprávu lze zavřít.
      </Alert>
    )
  },
}
