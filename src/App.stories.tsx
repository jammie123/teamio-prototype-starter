import type { Meta, StoryObj } from '@storybook/react-vite'
import App from './App.tsx'

const meta = {
  title: 'App/Smoke',
  component: App,
} satisfies Meta<typeof App>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
