import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { PublicationHoverCard } from './PublicationHoverCard'
import { PublicationHighlights, PublicationItem } from './PublicationItem'
import type { JobPublication, JobPublicationHighlight } from './types'

const jobsCz: JobPublication = {
  id: 'jobs',
  channel: 'Jobs.cz',
  startDate: '1. 9. 2026',
  endDate: '30. 9. 2026',
  viewCount: 1840,
  reactionCount: 34,
}

const jobstip: JobPublicationHighlight = {
  id: 'jobstip',
  name: 'Jobstip',
  startDate: '8. 9.',
  endDate: '30. 9. 2026',
  viewCount: 699,
  reactionCount: 13,
}

const meta = {
  title: 'Jobs/JobPublicationDropdown',
  component: PublicationHoverCard,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Hover karta portálu (`PublicationHoverCard`) – zobrazí se po najetí na název portálu nebo zvýraznění. Každý příběh ji otevře automaticky přes `play`.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="tm-min-h-80 tm-bg-cover-light tm-p-6">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof PublicationHoverCard>

export default meta
type Story = StoryObj<typeof meta>

const onViewAdvertisement = fn()
const onProlong = fn()
const onHighlight = fn()
const onRepublish = fn()

async function openDropdown(canvasElement: HTMLElement, triggerTestId: string, dropdownTestId: string) {
  const canvas = within(canvasElement)
  await userEvent.hover(canvas.getByTestId(triggerTestId))
  return canvas.findByTestId(dropdownTestId)
}

/** Běžící portál bez doplňkových akcí – jen detail a tlačítko pro zobrazení inzerátu. */
export const RunningPortal: Story = {
  name: 'Běžící portál',
  render: () => (
    <PublicationItem
      publication={jobsCz}
      status="active"
      dateLabel="do 30. 9."
      showHighlight={false}
      onViewAdvertisement={onViewAdvertisement}
    />
  ),
  play: async ({ canvasElement }) => {
    const dropdown = await openDropdown(
      canvasElement,
      'job-card-publication-channel',
      'job-card-publication-dropdown',
    )
    await expect(dropdown).toBeVisible()
    await expect(within(dropdown).getByTestId('job-card-publication-stats')).toBeVisible()
    await expect(within(dropdown).queryByTestId('job-card-publication-actions')).toBeNull()
  },
}

/** Portál s běžícím zvýrazněním (Jobstip) – karta zvýraznění ukazuje detail portálu i vlastní statistiky. */
export const RunningPortalWithRunningHighlight: Story = {
  name: 'Běžící portál s běžícím zvýrazněním',
  render: () => (
    <span className="tm-inline-flex tm-flex-wrap tm-items-center tm-gap-1">
      <PublicationItem
        publication={jobsCz}
        status="active"
        dateLabel="do 30. 9."
        showHighlight={false}
        onViewAdvertisement={onViewAdvertisement}
      />
      <PublicationHighlights
        publication={jobsCz}
        highlights={[jobstip]}
        showHighlight={false}
        onViewAdvertisement={onViewAdvertisement}
      />
    </span>
  ),
  play: async ({ canvasElement }) => {
    const dropdown = await openDropdown(
      canvasElement,
      'job-card-publication-highlight-name',
      'job-card-publication-highlight-dropdown',
    )
    await expect(dropdown).toBeVisible()
    await expect(within(dropdown).getByTestId('job-card-publication-highlight-stats')).toBeVisible()
    await expect(within(dropdown).getByTestId('job-card-publication-highlight-period')).toBeVisible()
  },
}

/** Ukončený portál – období a statistiky za celou dobu běhu. Karta nabízí Znovuvystavit inzerát. */
export const EndedPortal: Story = {
  name: 'Ukončený portál',
  render: () => (
    <PublicationItem
      publication={{ ...jobsCz, startDate: '1. 8. 2026', endDate: '15. 8. 2026' }}
      status="expired"
      dateLabel="ukončeno 15. 8."
      showHighlight={false}
      onViewAdvertisement={onViewAdvertisement}
      onRepublish={onRepublish}
    />
  ),
  play: async ({ canvasElement }) => {
    const dropdown = await openDropdown(
      canvasElement,
      'job-card-publication-channel',
      'job-card-publication-dropdown',
    )
    await expect(dropdown).toBeVisible()
    await expect(within(dropdown).getByTestId('job-card-publication-dropdown-period')).toHaveTextContent(
      '15. 8. 2026',
    )
    await expect(within(dropdown).getByRole('button', { name: 'Znovuvystavit inzerát' })).toBeVisible()
  },
}

/** Blíží se konec inzerce – karta nabízí Prodloužit. */
export const EndingSoon: Story = {
  name: 'Blíží se konec inzerce',
  render: () => (
    <PublicationItem
      publication={jobsCz}
      status="endingSoon"
      dateLabel="do 30. 9."
      showHighlight={false}
      showProlong
      onViewAdvertisement={onViewAdvertisement}
      onProlong={onProlong}
    />
  ),
  play: async ({ canvasElement }) => {
    const dropdown = await openDropdown(
      canvasElement,
      'job-card-publication-channel',
      'job-card-publication-dropdown',
    )
    const actions = within(dropdown).getByTestId('job-card-publication-actions')
    await expect(within(actions).getByRole('button', { name: 'Prodloužit' })).toBeVisible()
    await expect(within(actions).queryByRole('button', { name: 'Zvýraznit' })).toBeNull()
  },
}

/** Běžící portál, který lze zvýraznit (Jobs.cz, Prace.cz, Atmoskop) – karta nabízí tlačítko Zvýraznit. */
export const RunningPortalWithHighlightButton: Story = {
  name: 'Běžící portál se zvýrazněním (tlačítko)',
  render: () => (
    <PublicationItem
      publication={jobsCz}
      status="active"
      dateLabel="do 30. 9."
      showHighlight
      onViewAdvertisement={onViewAdvertisement}
      onHighlight={onHighlight}
    />
  ),
  play: async ({ canvasElement }) => {
    const dropdown = await openDropdown(
      canvasElement,
      'job-card-publication-channel',
      'job-card-publication-dropdown',
    )
    const actions = within(dropdown).getByTestId('job-card-publication-actions')
    await expect(within(actions).getByRole('button', { name: 'Zvýraznit' })).toBeVisible()
    await expect(within(actions).queryByRole('button', { name: 'Prodloužit' })).toBeNull()
  },
}
