import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { AdvertisementWidget } from './AdvertisementWidget'
import { allPortals, mixedEndedPortal, portal, runningDifferent, runningSame } from './fixtures'
import type { JobAdvertisement } from './types'

/**
 * Publication List není samostatná komponenta: je to výpis portálů uvnitř `AdvertisementWidget`.
 * Tyto stories ukazují jen jeho chování (layout row/column, limit 5 portálů, rozbalení).
 */

const fivePortals: JobAdvertisement = {
  id: 'ad-five-portals',
  publications: allPortals.publications?.slice(0, 5),
}

const manyPortalsDifferentPeriods: JobAdvertisement = {
  id: 'ad-many-different',
  publications: [
    portal({ id: 'jobs', channel: 'Jobs.cz', startDate: '1. 9. 2026', endDate: '30. 11. 2026', viewCount: 1840 }),
    portal({ id: 'prace', channel: 'Prace.cz', startDate: '5. 9. 2026', endDate: '5. 12. 2026', viewCount: 920 }),
    portal({ id: 'career', channel: 'Kariérní stránky', startDate: '1. 9. 2026', endDate: '15. 12. 2026', viewCount: 410 }),
    portal({ id: 'intranet', channel: 'Intranet', startDate: '10. 9. 2026', endDate: '10. 12. 2026', viewCount: 340 }),
    portal({ id: 'jobote', channel: 'Jobote', startDate: '1. 10. 2026', endDate: '1. 1. 2027', viewCount: 95 }),
    portal({ id: 'atmoskop', channel: 'Atmoskop.cz', startDate: '1. 10. 2026', endDate: '15. 1. 2027', viewCount: 210 }),
    portal({ id: 'nearby', channel: 'Práce za rohem', startDate: '1. 10. 2026', endDate: '31. 1. 2027', viewCount: 70 }),
  ],
}

const meta = {
  title: 'Jobs/Job Card/Subkomponenty/PublicationList',
  component: AdvertisementWidget,
  tags: ['!autodocs'],
  args: {
    advertisement: runningSame,
    onExtendAndRepublish: fn(),
    onAdvertisementPreviewClick: fn(),
    onHighlightAdvertisement: fn(),
    onCreateAdvertisement: fn(),
  },
  decorators: [
    (Story) => (
      <div className="tm-w-[450px] tm-bg-cover-light tm-px-4 tm-py-6">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AdvertisementWidget>

export default meta
type Story = StoryObj<typeof meta>

export const LayoutRow: Story = {
  name: 'Layout row (stejné období)',
  args: { advertisement: runningSame },
}

export const LayoutColumn: Story = {
  name: 'Layout column (různá období)',
  args: { advertisement: runningDifferent },
}

export const WithEndedPortal: Story = {
  name: 'Ukončený portál řazený na konec',
  args: { advertisement: mixedEndedPortal },
}

export const ExactlyFivePortals: Story = {
  name: 'Přesně 5 portálů (bez sbalení)',
  args: { advertisement: fivePortals },
}

export const CollapsedRow: Story = {
  name: 'Více než 5 portálů, row (sbaleno)',
  args: { advertisement: allPortals },
}

export const CollapsedColumn: Story = {
  name: 'Více než 5 portálů, column (sbaleno)',
  args: { advertisement: manyPortalsDifferentPeriods },
}

export const Expanded: Story = {
  name: 'Rozbaleno (Zobrazit méně)',
  args: { advertisement: allPortals },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const toggle = await canvas.findByTestId('job-card-publications-more')
    await userEvent.click(toggle)
    await expect(toggle).toHaveTextContent('Zobrazit méně')
  },
}

export const CustomLimit: Story = {
  name: 'Vlastní limit (maxVisiblePublications = 3)',
  args: { advertisement: allPortals, maxVisiblePublications: 3 },
}
