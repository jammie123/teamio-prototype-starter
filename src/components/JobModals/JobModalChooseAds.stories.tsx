import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { expect, fn, userEvent, within } from 'storybook/test'
import { Button } from '../Button'
import { JobModalChooseAds } from './JobModalChooseAds'
import { JobModalProlong } from './JobModalProlong'
import { JobModalUnpublish } from './JobModalUnpublish'
import { placesByAdvertisementId, sampleAdvertisements } from './fixtures'
import type { JobModalAdvertisementSection } from './types'

function sectionsForAds(advertisementIds: string[]): JobModalAdvertisementSection[] {
  return advertisementIds.flatMap((advertisementId) => {
    const advertisement = sampleAdvertisements.find((item) => item.id === advertisementId)
    if (!advertisement) {
      return []
    }

    return [
      {
        advertisement,
        places: placesByAdvertisementId[advertisementId] ?? [],
      },
    ]
  })
}

const meta = {
  id: 'jobs-jobmodals-chooseads',
  title: 'Jobs/JobModals/ChooseAds',
  component: JobModalChooseAds,
  args: {
    advertisements: sampleAdvertisements,
    onConfirm: fn(),
  },
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof JobModalChooseAds>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    trigger: <Button>Vyberte inzerát</Button>,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Vyberte inzerát' }))
    const dialog = await within(document.body).findByRole('dialog')
    await expect(dialog).toHaveAccessibleName('Vyberte inzerát')
  },
}

export const DefaultOpen: Story = {
  args: {
    defaultOpen: true,
  },
}

export const ThenUnpublish: Story = {
  render: function ChooseThenUnpublish() {
    const [chooseOpen, setChooseOpen] = useState(true)
    const [unpublishOpen, setUnpublishOpen] = useState(false)
    const [selectedAdIds, setSelectedAdIds] = useState<string[]>([])

    return (
      <>
        <JobModalChooseAds
          open={chooseOpen}
          onOpenChange={setChooseOpen}
          advertisements={sampleAdvertisements}
          onConfirm={(advertisementIds) => {
            setSelectedAdIds(advertisementIds)
            setChooseOpen(false)
            setUnpublishOpen(true)
          }}
        />
        <JobModalUnpublish
          open={unpublishOpen}
          onOpenChange={setUnpublishOpen}
          advertisementSections={sectionsForAds(selectedAdIds)}
        />
      </>
    )
  },
}

export const ThenProlong: Story = {
  render: function ChooseThenProlong() {
    const [chooseOpen, setChooseOpen] = useState(true)
    const [prolongOpen, setProlongOpen] = useState(false)
    const [selectedAdIds, setSelectedAdIds] = useState<string[]>([])

    return (
      <>
        <JobModalChooseAds
          open={chooseOpen}
          onOpenChange={setChooseOpen}
          advertisements={sampleAdvertisements}
          onConfirm={(advertisementIds) => {
            setSelectedAdIds(advertisementIds)
            setChooseOpen(false)
            setProlongOpen(true)
          }}
        />
        <JobModalProlong
          open={prolongOpen}
          onOpenChange={setProlongOpen}
          advertisementSections={sectionsForAds(selectedAdIds)}
        />
      </>
    )
  },
}
