import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { JobMenu } from './JobMenu'
import type { JobAdvertisement } from '../JobShared/types'

const runningAdvertisements: JobAdvertisement[] = [
  {
    id: 'ad-1',
    title: 'Hlavní inzerát',
    publications: [
      { id: 'p-1', channel: 'Jobs.cz', startDate: '1. 9. 2026', endDate: '30. 10. 2026' },
    ],
  },
  {
    id: 'ad-2',
    title: 'Inzerát pro brigádníky',
    publications: [
      { id: 'p-2', channel: 'Prace.cz', startDate: '1. 9. 2026', endDate: '30. 10. 2026' },
    ],
  },
]

const endedAdvertisements: JobAdvertisement[] = [
  {
    id: 'ad-1',
    title: 'Hlavní inzerát',
    publications: [
      {
        id: 'p-1',
        channel: 'Jobs.cz',
        status: 'expired',
        startDate: '1. 7. 2026',
        endDate: '31. 7. 2026',
      },
    ],
  },
]

const meta = {
  title: 'Jobs/Job Card/Subkomponenty/JobMenu',
  component: JobMenu,
  tags: ['!autodocs'],
  args: {
    advertisements: runningAdvertisements,
    onEditJob: fn(),
    onDuplicateJob: fn(),
    onEndPublication: fn(),
    onExtendAndRepublish: fn(),
    onHighlightAdvertisement: fn(),
    onTopAdvertisement: fn(),
    onAddNote: fn(),
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
  name: 'Běžící inzerce',
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
      'Přidat poznámku',
      'Zapojit kolegu',
      'Předat nábor',
      'Archivovat',
    ]) {
      await expect(canvas.getByRole('option', { name })).toBeVisible()
    }
  },
}

export const EndedAdvertising: Story = {
  name: 'Ukončená inzerce',
  args: {
    advertisements: endedAdvertisements,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByTestId('job-menu-toggle'))
    await expect(canvas.getByRole('option', { name: 'Ukončit vystavování' })).toBeVisible()
    await expect(canvas.getByRole('option', { name: 'Prodloužit a znovuvystavit' })).toBeVisible()
    await expect(canvas.queryByRole('option', { name: 'Zvýraznit' })).not.toBeInTheDocument()
    await expect(canvas.queryByRole('option', { name: 'Topovat' })).not.toBeInTheDocument()
  },
}

export const NoAdvertisements: Story = {
  name: 'Bez inzerce',
  args: {
    advertisements: [],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByTestId('job-menu-toggle'))
    await expect(canvas.getByRole('option', { name: 'Editovat nábor' })).toBeVisible()
    await expect(canvas.getByRole('option', { name: 'Prodloužit a znovuvystavit' })).toBeVisible()
    await expect(canvas.getByRole('option', { name: 'Přidat poznámku' })).toBeVisible()
    await expect(canvas.queryByRole('option', { name: 'Zvýraznit' })).not.toBeInTheDocument()
    await expect(canvas.queryByRole('option', { name: 'Topovat' })).not.toBeInTheDocument()
    await expect(
      canvas.queryByRole('option', { name: 'Ukončit vystavování' }),
    ).not.toBeInTheDocument()
  },
}
