import type { Meta, StoryObj } from '@storybook/react-vite'
import { Skeleton } from './Skeleton'

const meta = {
  title: 'Components/Skeleton',
  component: Skeleton,
} satisfies Meta<typeof Skeleton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    width: 240,
    height: 18,
  },
}

export const Dark: Story = {
  args: {
    width: 240,
    height: 18,
    variant: 'dark',
  },
}

export const Circle: Story = {
  args: {
    width: 48,
    height: 48,
    isCircle: true,
    variant: 'dark',
  },
}

export const Multiple: Story = {
  args: {
    width: '100%',
    height: 14,
    count: 3,
    className: 'tm-mb-2',
  },
}

export const CardPlaceholder: Story = {
  render: () => (
    <div className="tm-flex tm-gap-4 tm-items-center tm-max-w-md">
      <Skeleton width={48} height={48} isCircle />
      <div className="tm-grow">
        <Skeleton width="60%" height={16} className="tm-mb-2" />
        <Skeleton width="90%" height={12} count={2} className="tm-mb-1" />
      </div>
    </div>
  ),
}
