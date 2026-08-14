import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Tag } from './Tag'

const meta = {
  title: 'Components/Tag',
  component: Tag,
  args: {
    children: 'Praha',
  },
} satisfies Meta<typeof Tag>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const DefaultSubtle: Story = { args: { isSubtle: true, children: 'Brno' } }
export const Informative: Story = { args: { color: 'informative', children: 'Nový' } }
export const InformativeSubtle: Story = {
  args: { color: 'informative', isSubtle: true, children: 'Nový' },
}
export const Success: Story = { args: { color: 'success', children: 'Přijat' } }
export const SuccessSubtle: Story = {
  args: { color: 'success', isSubtle: true, children: 'Přijat' },
}
export const Warning: Story = { args: { color: 'warning', children: 'Čeká' } }
export const WarningSubtle: Story = {
  args: { color: 'warning', isSubtle: true, children: 'Čeká' },
}
export const Danger: Story = { args: { color: 'danger', children: 'Zamítnut' } }
export const DangerSubtle: Story = {
  args: { color: 'danger', isSubtle: true, children: 'Zamítnut' },
}

export const Dismissible: Story = {
  render: function DismissibleTag() {
    const [open, setOpen] = useState(true)
    if (!open) {
      return (
        <button type="button" onClick={() => setOpen(true)}>
          Zobrazit štítek
        </button>
      )
    }
    return (
      <Tag onDismiss={() => setOpen(false)} dismissLabel="Odebrat štítek">
        Remote
      </Tag>
    )
  },
}
