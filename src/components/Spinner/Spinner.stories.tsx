import type { Meta, StoryObj } from '@storybook/react-vite'
import { Spinner } from './Spinner'

const meta = {
  title: 'Components/Spinner',
  component: Spinner,
} satisfies Meta<typeof Spinner>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: 'Načítání',
    className: 'tm-text-2xl tm-text-action-primary-default',
  },
}

export const Small: Story = {
  args: {
    label: 'Načítání',
    className: 'tm-text-base tm-text-action-primary-default',
  },
}

export const Large: Story = {
  args: {
    label: 'Načítání seznamu uchazečů',
    className: 'tm-text-4xl tm-text-action-primary-default',
  },
}

export const OnDark: Story = {
  args: {
    label: 'Načítání',
    className: 'tm-text-2xl tm-text-primary-inverted-default',
  },
  decorators: [
    (Story) => (
      <div className="tm-bg-inverted tm-p-6 tm-inline-flex tm-rounded">
        <Story />
      </div>
    ),
  ],
}
