import type { Meta, StoryObj } from '@storybook/react-vite'
import { Container } from './Container'

const meta = {
  title: 'Components/Container',
  component: Container,
  args: {
    children: 'Obsah kontejneru stránky náboru',
    isCentered: true,
    maxWidth: '40rem',
  },
} satisfies Meta<typeof Container>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Narrow: Story = {
  args: {
    maxWidth: '24rem',
    children: 'Úzký kontejner pro formulář',
  },
}
export const Wide: Story = {
  args: {
    maxWidth: '64rem',
    children: 'Široký kontejner pro přehled pozic',
  },
}
export const WithoutPadding: Story = {
  args: {
    hasPadding: false,
    children: 'Kontejner bez vnitřního paddingu',
  },
}
