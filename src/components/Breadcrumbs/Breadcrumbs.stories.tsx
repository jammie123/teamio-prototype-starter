import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { Breadcrumbs } from './Breadcrumbs'

const meta = {
  title: 'Components/Breadcrumbs',
  component: Breadcrumbs,
  args: {
    items: [{ label: 'Nábory', href: '#nabory' }, { label: 'Product Manager' }],
  },
} satisfies Meta<typeof Breadcrumbs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

/** Items handled in the app (client-side navigation) use `onClick` instead of `href`. */
export const WithOnClick: Story = {
  args: {
    items: [{ label: 'Nábory', onClick: fn() }, { label: 'Product Manager' }],
  },
}

export const MultipleLevels: Story = {
  args: {
    items: [
      { label: 'Nábory', href: '#nabory' },
      { label: 'Product Manager', href: '#nabor' },
      { label: 'Uchazeči' },
    ],
  },
}
