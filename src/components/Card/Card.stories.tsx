import type { Meta, StoryObj } from '@storybook/react-vite'
import { Card } from './Card'
import { Typography } from '../Typography'
import { Button } from '../Button'

const meta = {
  title: 'Components/Card',
  component: Card,
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: 'Jednoduchá karta s obsahem náboru.',
  },
}

export const Article: Story = {
  render: () => (
    <Card as="article">
      <Typography as="h3" variant="h4">
        Produktový manažer
      </Typography>
      <Typography>Praha · Full-time · Publikováno dnes</Typography>
    </Card>
  ),
}

export const WithActions: Story = {
  render: () => (
    <Card>
      <Typography as="h3" variant="h4">
        Anna Nováková
      </Typography>
      <Typography className="tm-mb-4">Frontend vývojář · Nový uchazeč</Typography>
      <div className="tm-flex tm-gap-2">
        <Button size="small">Pozvat</Button>
        <Button size="small" variant="secondary">
          Detail
        </Button>
      </div>
    </Card>
  ),
}
