import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Pill } from './Pill'

const meta = {
  title: 'Components/Pill',
  component: Pill,
  args: {
    children: 3,
  },
} satisfies Meta<typeof Pill>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Secondary: Story = { args: { color: 'secondary', children: 12 } }
export const Tertiary: Story = { args: { color: 'tertiary', children: 5 } }
export const Informative: Story = { args: { color: 'informative', children: 8 } }
export const Success: Story = { args: { color: 'success', children: 2 } }
export const Warning: Story = { args: { color: 'warning', children: 1 } }
export const Danger: Story = { args: { color: 'danger', children: 9 } }
export const Pink: Story = { args: { color: 'pink', children: 5 } }

export const Dismissible: Story = {
  render: function DismissiblePill() {
    const [open, setOpen] = useState(true)
    if (!open) {
      return (
        <button type="button" onClick={() => setOpen(true)}>
          Zobrazit pill
        </button>
      )
    }
    return (
      <Pill onDismiss={() => setOpen(false)} dismissLabel="Odebrat počet">
        9
      </Pill>
    )
  },
}
