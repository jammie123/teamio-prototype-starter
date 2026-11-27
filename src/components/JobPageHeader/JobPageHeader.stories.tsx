import type { Decorator, Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import type { LeftMenuItemData } from '../LeftMenu'
import { PageTemplate } from '../PageTemplate'
import { Tabs, TabsContent } from '../Tabs'
import { JobPageHeader } from './JobPageHeader'

const demoUser = {
  name: 'Jan Fuxa',
  company: 'LMCTEST_Teamio s.r.o.',
}

const leftMenuItems: LeftMenuItemData[] = [
  { id: 'prehled', label: 'Přehled', icon: 'home', href: '#prehled' },
  { id: 'nabory', label: 'Nábory', icon: 'file-text', href: '#nabory' },
  { id: 'uchazeci', label: 'Uchazeči', icon: 'user', href: '#uchazeci' },
]

const sampleCounts = {
  open: 12,
  published: 8,
  unpublished: 3,
  draft: 2,
  archived: 5,
}

// The header is a white surface, so stories sit on the page background to show its elevation.
const onPageBackground: Decorator = (Story) => (
  <div className="tm-mb-[180px] tm-bg-cover-light tm-p-6">
    <Story />
  </div>
)

const meta = {
  title: 'Jobs/JobPageHeader/V1',
  component: JobPageHeader,
  args: {
    onAddJob: fn(),
    onAddBrigade: fn(),
    onBulkActionsToggle: fn(),
  },
} satisfies Meta<typeof JobPageHeader>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  decorators: [onPageBackground],
  render: (args) => (
    <Tabs defaultValue="open">
      <JobPageHeader {...args} />
    </Tabs>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('heading', { level: 1, name: 'Nábory' })).toBeInTheDocument()
    await expect(canvas.getByRole('tab', { name: 'Otevřený' })).toBeInTheDocument()
    await expect(canvas.getByRole('button', { name: 'Hromadné akce' })).toBeInTheDocument()
    await userEvent.click(canvas.getByRole('button', { name: 'Další možnosti přidání' }))
    await expect(canvas.getByRole('option', { name: 'Přidat brigádu' })).toBeInTheDocument()
  },
}

export const WithCounts: Story = {
  decorators: [onPageBackground],
  args: {
    jobCount: 30,
    tabCounts: sampleCounts,
  },
  render: (args) => (
    <Tabs defaultValue="open">
      <JobPageHeader {...args} />
    </Tabs>
  ),
}

export const BulkActionsActive: Story = {
  decorators: [onPageBackground],
  args: { bulkActionsActive: true },
  render: (args) => (
    <Tabs defaultValue="open">
      <JobPageHeader {...args} />
    </Tabs>
  ),
}

export const InPage: Story = {
  args: {
    jobCount: 30,
    tabCounts: sampleCounts,
  },
  render: (args) => (
    <Tabs defaultValue="open" className="tm-contents">
      <PageTemplate
        leftMenu={{
          items: leftMenuItems,
          activeItemId: 'nabory',
        }}
        headerTop={{
          user: demoUser,
          onMessagesClick: fn(),
          onNotificationsClick: fn(),
          onSearchChange: fn(),
        }}
        pageHeader={<JobPageHeader {...args} />}
      >
        <TabsContent value="open">Otevřené pozice.</TabsContent>
        <TabsContent value="published">Zveřejněné pozice.</TabsContent>
        <TabsContent value="unpublished">Nezveřejněné pozice.</TabsContent>
        <TabsContent value="draft">Rozpracované pozice.</TabsContent>
        <TabsContent value="archived">Archivní pozice.</TabsContent>
      </PageTemplate>
    </Tabs>
  ),
  parameters: {
    layout: 'fullscreen',
  },
}
