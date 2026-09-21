import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { Button } from '../Button'
import { JobModalBoost } from './JobModalBoost'
import { longPlaceList, samplePlaces } from './fixtures'

const meta = {
  id: 'jobs-jobmodals-boost',
  title: 'Jobs/JobModals/Boost',
  component: JobModalBoost,
  args: {
    places: samplePlaces,
    onConfirm: fn(),
  },
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof JobModalBoost>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    trigger: <Button>Zvýraznit inzerát</Button>,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Zvýraznit inzerát' }))
    const dialog = await within(document.body).findByRole('dialog')
    await expect(dialog).toHaveAccessibleName('Zvýraznit inzerát')
  },
}

export const DefaultOpen: Story = {
  args: {
    defaultOpen: true,
  },
}

export const LongList: Story = {
  args: {
    defaultOpen: true,
    places: longPlaceList,
  },
}
