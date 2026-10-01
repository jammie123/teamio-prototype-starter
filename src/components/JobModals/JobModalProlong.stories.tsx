import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { Button } from '../Button'
import { JobModalProlong } from './JobModalProlong'
import {
  additionalPlaces,
  creditsOnlyPlaces,
  placesByAdvertisementId,
  sampleAdvertisements,
  samplePlaces,
} from './fixtures'

const meta = {
  id: 'jobs-jobmodals-prolong',
  title: 'Jobs/JobModals/Prolong',
  component: JobModalProlong,
  args: {
    places: samplePlaces,
    additionalPlaces,
    onConfirm: fn(),
  },
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof JobModalProlong>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    trigger: <Button>Prodloužit a znovu vystavit</Button>,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Prodloužit a znovu vystavit' }))
    const dialog = await within(document.body).findByRole('dialog')
    await expect(dialog).toHaveAccessibleName('Prodloužit a znovu vystavit')
  },
}

export const DefaultOpen: Story = {
  args: {
    defaultOpen: true,
  },
}

export const CreditsOnly: Story = {
  args: {
    defaultOpen: true,
    places: creditsOnlyPlaces,
    additionalPlaces,
  },
}

export const MultipleAdvertisements: Story = {
  args: {
    defaultOpen: true,
    advertisementSections: [
      {
        advertisement: sampleAdvertisements[0],
        places: placesByAdvertisementId['ad-1'],
        additionalPlaces,
      },
      {
        advertisement: sampleAdvertisements[1],
        places: placesByAdvertisementId['ad-2'],
      },
    ],
  },
}

export const AdditionalPlacesOpen: Story = {
  args: {
    defaultOpen: true,
    additionalPlaces,
  },
  play: async () => {
    const dialog = await within(document.body).findByRole('dialog')
    await userEvent.click(within(dialog).getByRole('button', { name: 'Zobrazit další portály' }))
    await expect(within(dialog).getByRole('button', { name: 'Skrýt tyto portály' })).toBeInTheDocument()
    await expect(within(dialog).getAllByTestId('job-modal-places-table')).toHaveLength(1)
    await expect(within(dialog).getByRole('checkbox', { name: 'Atmoskop' })).toBeInTheDocument()
  },
}
