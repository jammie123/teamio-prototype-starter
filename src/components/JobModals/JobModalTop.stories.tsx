import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { Button } from '../Button'
import { JobModalTop } from './JobModalTop'
import { longPlaceList, samplePlaces } from './fixtures'

const meta = {
  id: 'jobs-jobmodals-top',
  title: 'Jobs/JobModals/Top',
  component: JobModalTop,
  args: {
    places: samplePlaces,
    onConfirm: fn(),
  },
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof JobModalTop>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    trigger: <Button>Topovat</Button>,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Topovat' }))
    const dialog = await within(document.body).findByRole('dialog')
    await expect(dialog).toHaveAccessibleName('Topovat')
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
