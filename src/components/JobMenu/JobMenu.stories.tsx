import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { JobMenu } from './JobMenu'
import type { JobAdvertisement } from '../JobCardSynteza/types'

const advertisements: JobAdvertisement[] = [
  { id: 'ad-1', title: 'Hlavní inzerát' },
  { id: 'ad-2', title: 'Inzerát pro brigádníky' },
]

const meta = {
  id: 'jobs-jobmenu',
  title: 'Jobs/JobMenu',
  component: JobMenu,
  args: {
    advertisements,
    onEditAdvertisement: fn(),
    onExtendAndRepublish: fn(),
    onEndPublication: fn(),
    onTopAdvertisement: fn(),
    onCreateAdvertisement: fn(),
    onEditJob: fn(),
    onDuplicateJob: fn(),
    onInviteColleagues: fn(),
    onTransferJob: fn(),
    onArchiveJob: fn(),
  },
  parameters: {
    layout: 'padded',
  },
  decorators: [
    (Story) => (
      <div className="tm-flex tm-justify-end tm-mb-[280px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof JobMenu>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByTestId('job-menu-toggle'))
    await expect(canvas.getByRole('option', { name: 'Prodloužit a znovu vystavit' })).toBeVisible()
    await expect(canvas.getByRole('option', { name: 'Ukončit vystavení' })).toBeVisible()
    await expect(canvas.getByRole('option', { name: 'Topovat' })).toBeVisible()
  },
}

export const NoAdvertisements: Story = {
  args: {
    advertisements: [],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByTestId('job-menu-toggle'))
    await expect(canvas.getByRole('option', { name: 'Přidat inzerát' })).toBeVisible()
    await expect(canvas.queryByRole('option', { name: 'Topovat' })).not.toBeInTheDocument()
  },
}
