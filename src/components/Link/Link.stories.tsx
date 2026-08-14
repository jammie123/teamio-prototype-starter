import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { Link } from './Link'

const meta = {
  title: 'Components/Link',
  component: Link,
  args: {
    children: 'Přejít na Teamio',
  },
} satisfies Meta<typeof Link>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    href: 'https://www.teamio.com/',
    target: '_blank',
  },
}
export const Secondary: Story = {
  args: {
    href: 'https://www.teamio.com/',
    variant: 'secondary',
    children: 'Sekundární odkaz',
  },
}
export const AsButton: Story = {
  args: {
    onClick: fn(),
    children: 'Akce na stránce',
  },
}
export const NeverUnderlined: Story = {
  args: {
    href: '#kandidati',
    underlined: 'never',
    children: 'Bez podtržení',
  },
}
export const Disabled: Story = {
  args: {
    href: 'https://www.teamio.com/',
    isDisabled: true,
    children: 'Nedostupný odkaz',
  },
}
