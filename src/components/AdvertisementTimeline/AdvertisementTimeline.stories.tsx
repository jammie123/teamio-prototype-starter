import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'
import { Button } from '../Button'
import {
  Drawer,
  DrawerBody,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerTitle,
  DrawerTrigger,
} from '../Drawer'
import { AdvertisementTimeline } from './AdvertisementTimeline'
import {
  sampleAdvertisementTimelineCycles,
  sampleAdvertisementTimelineEvents,
} from './fixtures'

const meta = {
  title: 'Jobs/AdvertisementTimeline',
  component: AdvertisementTimeline,
  args: {
    events: sampleAdvertisementTimelineEvents,
    cycles: sampleAdvertisementTimelineCycles,
  },
} satisfies Meta<typeof AdvertisementTimeline>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const DefaultOpen: Story = {
  args: {
    defaultOpenEventId: 'evt-topped-jobs',
  },
}

export const Empty: Story = {
  args: {
    events: [],
    cycles: [],
  },
}

export const InDrawer: Story = {
  render: function TimelineInDrawer(args) {
    return (
      <Drawer>
        <DrawerTrigger asChild>
          <Button>Otevřít historii inzerce</Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerTitle>Historie inzerce</DrawerTitle>
          <DrawerClose aria-label="Zavřít panel" />
          <DrawerBody>
            <AdvertisementTimeline {...args} />
          </DrawerBody>
          <DrawerFooter>
            <DrawerClose asChild aria-label="Zavřít">
              <Button>Zavřít</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Otevřít historii inzerce' }))
    const drawer = await within(document.body).findByRole('dialog', { name: 'Historie inzerce' })
    await expect(drawer).toBeVisible()
    await userEvent.click(within(drawer).getByRole('button', { name: /Topování inzerátu/ }))
    const detail = await within(document.body).findByRole('dialog', {
      name: 'Životní cyklus inzerátu',
    })
    await expect(detail).toBeVisible()
    await expect(detail).toHaveTextContent('Vystavení inzerátu')
  },
}
