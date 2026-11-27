import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { JobMenu } from './JobMenu'
import type { JobAdvertisement } from '../JobShared/types'

const advertisements: JobAdvertisement[] = [
  { id: 'ad-1', title: 'Hlavní inzerát' },
  { id: 'ad-2', title: 'Inzerát pro brigádníky' },
]

const meta = {
  title: 'Jobs/Job Card/Subkomponenty/JobMenu',
  component: JobMenu,
  tags: ['!autodocs'],
  args: {
    advertisements,
    onEditJob: fn(),
    onDuplicateJob: fn(),
    onEndPublication: fn(),
    onExtendAndRepublish: fn(),
    onHighlightAdvertisement: fn(),
    onTopAdvertisement: fn(),
    onInviteColleagues: fn(),
    onTransferJob: fn(),
    onArchiveJob: fn(),
  },
  parameters: {
    layout: 'padded',
  },
  decorators: [
    (Story) => (
      <div className="tm-flex tm-justify-end tm-mb-[320px]">
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
    for (const name of [
      'Editovat nábor',
      'Duplikovat',
      'Ukončit vystavování',
      'Prodloužit a znovuvystavit',
      'Zvýraznit',
      'Topovat',
      'Zapojit kolegu',
      'Předat nábor',
      'Archivovat',
    ]) {
      await expect(canvas.getByRole('option', { name })).toBeVisible()
    }
  },
}

export const NoAdvertisements: Story = {
  args: {
    advertisements: [],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByTestId('job-menu-toggle'))
    await expect(canvas.getByRole('option', { name: 'Editovat nábor' })).toBeVisible()
    await expect(canvas.queryByRole('option', { name: 'Zvýraznit' })).not.toBeInTheDocument()
    await expect(canvas.queryByRole('option', { name: 'Topovat' })).not.toBeInTheDocument()
    await expect(
      canvas.queryByRole('option', { name: 'Ukončit vystavování' }),
    ).not.toBeInTheDocument()
  },
}
