import type { Meta, StoryObj } from '@storybook/react-vite'
import { Typography } from './Typography'

const meta = {
  title: 'Components/Typography',
  component: Typography,
  args: {
    children: 'Ukázkový text pro nábor',
  },
} satisfies Meta<typeof Typography>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Heading1: Story = {
  args: { variant: 'h1', children: 'Nadpis stránky náboru' },
}
export const Heading2: Story = {
  args: { variant: 'h2', children: 'Sekce kandidátů' },
}
export const Heading3: Story = {
  args: { variant: 'h3', children: 'Detail pozice' },
}
export const HeadingSemanticMismatch: Story = {
  args: {
    as: 'h2',
    variant: 'h1',
    children: 'H2 s vizuálem H1',
  },
}
export const Caption: Story = {
  args: {
    variant: 'caption',
    children: 'Pomocný popis pod polem',
  },
}
