import type { Meta, StoryObj } from '@storybook/react-vite'
import { ButtonLink } from './ButtonLink'

const meta = {
  title: 'Components/ButtonLink',
  component: ButtonLink,
  args: {
    children: 'Otevřít pozici',
    href: 'https://www.teamio.com/',
    target: '_blank',
  },
} satisfies Meta<typeof ButtonLink>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Secondary: Story = { args: { variant: 'secondary' } }
export const Tertiary: Story = { args: { variant: 'tertiary' } }
export const Danger: Story = { args: { variant: 'danger', children: 'Odstranit odkaz' } }
export const Small: Story = { args: { size: 'small' } }
export const Large: Story = { args: { size: 'large' } }
export const Disabled: Story = { args: { isDisabled: true, children: 'Nedostupný odkaz' } }
