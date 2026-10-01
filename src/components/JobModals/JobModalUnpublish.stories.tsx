import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { Button } from '../Button'
import { JobModalUnpublish } from './JobModalUnpublish'
import { placesByAdvertisementId, sampleAdvertisements, samplePlaces } from './fixtures'

const meta = {
  id: 'jobs-jobmodals-unpublish',
  title: 'Jobs/JobModals/Unpublish',
  component: JobModalUnpublish,
  args: {
    places: samplePlaces,
    onConfirm: fn(),
  },
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof JobModalUnpublish>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    trigger: <Button>Ukončit vystavení</Button>,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Ukončit vystavení' }))
    const dialog = await within(document.body).findByRole('dialog')
    await expect(dialog).toHaveAccessibleName('Ukončit vystavení')
  },
}

export const DefaultOpen: Story = {
  args: {
    defaultOpen: true,
  },
}

export const NoSelection: Story = {
  args: {
    defaultOpen: true,
    selectedPlaceIds: [],
  },
}

export const MultipleAdvertisements: Story = {
  args: {
    defaultOpen: true,
    advertisementSections: [
      {
        advertisement: sampleAdvertisements[0],
        places: placesByAdvertisementId['ad-1'],
      },
      {
        advertisement: sampleAdvertisements[1],
        places: placesByAdvertisementId['ad-2'],
      },
    ],
  },
}
