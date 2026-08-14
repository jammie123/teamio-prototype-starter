import type { Meta, StoryObj } from '@storybook/react-vite'
import { Icon } from './Icon'

const meta = {
  title: 'Components/Icon',
  component: Icon,
  args: {
    name: 'plus',
    className: 'tm-text-2xl',
    title: 'Přidat',
  },
} satisfies Meta<typeof Icon>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Small: Story = {
  args: {
    name: 'search',
    className: 'tm-text-base',
    title: 'Hledat',
  },
}
export const Large: Story = {
  args: {
    name: 'check',
    className: 'tm-text-4xl',
    title: 'Hotovo',
  },
}
export const Fallback: Story = {
  args: {
    name: 'unknown-teamio-glyph',
    title: 'Neznámá ikona',
  },
}
