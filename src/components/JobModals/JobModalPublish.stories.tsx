import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { Button } from '../Button'
import { JobModalPublish } from './JobModalPublish'
import { samplePlaces, singlePlace } from './fixtures'

const meta = {
  id: 'jobs-jobmodals-publish',
  title: 'Jobs/JobModals/Publish',
  component: JobModalPublish,
  args: {
    places: samplePlaces,
    onConfirm: fn(),
  },
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof JobModalPublish>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    trigger: <Button>Zveřejnit inzerát</Button>,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Zveřejnit inzerát' }))
    const dialog = await within(document.body).findByRole('dialog')
    await expect(dialog).toHaveAccessibleName('Zveřejnit inzerát')
  },
}

export const DefaultOpen: Story = {
  args: {
    defaultOpen: true,
  },
}

export const SinglePlace: Story = {
  args: {
    defaultOpen: true,
    places: singlePlace,
  },
}
