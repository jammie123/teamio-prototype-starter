import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { Note } from './Note'

const meta = {
  title: 'Components/Note',
  component: Note,
  args: {
    author: 'Jan Fuxa',
    text: 'Nástup ideálně od 1. 9. 2026, možné se domluvit i na pozdější termín.',
    addedAt: '9. 9. 2026',
    showDate: true,
    onExpand: fn(),
  },
} satisfies Meta<typeof Note>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const LongText: Story = {
  args: {
    text: 'Náhrada za Martina Šimka, který odchází na konci září. Hledáme někoho se zkušeností s vedením směn a ochotou pracovat o víkendech. Nástup ideálně co nejdříve, plat dle dohody.',
  },
}

export const WithoutExpandHandler: Story = {
  args: {
    onExpand: undefined,
  },
}

export const WithoutDate: Story = {
  args: {
    showDate: false,
  },
}
