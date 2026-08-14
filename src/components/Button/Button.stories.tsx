import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { Icon } from '../Icon'
import { Button } from './Button'

const meta = {
  title: 'Components/Button',
  component: Button,
  args: {
    children: 'Uložit',
    onClick: fn(),
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Secondary: Story = { args: { variant: 'secondary' } }
export const Tertiary: Story = { args: { variant: 'tertiary' } }
export const Danger: Story = { args: { variant: 'danger', children: 'Smazat' } }
export const Small: Story = { args: { size: 'small', children: 'Malé' } }
export const Large: Story = { args: { size: 'large', children: 'Velké' } }
export const Block: Story = { args: { isBlock: true, children: 'Na celou šířku' } }
export const Circle: Story = {
  args: {
    isCircle: true,
    'aria-label': 'Přidat',
    children: <Icon name="plus" title="Přidat" />,
  },
}
export const WithIcon: Story = {
  args: {
    children: (
      <>
        <Icon name="search" className="tm-text-lg" />
        Hledat uchazeče
      </>
    ),
  },
}
export const Loading: Story = { args: { isLoading: true, children: 'Načítám' } }
export const Disabled: Story = { args: { isDisabled: true, children: 'Nedostupné' } }
