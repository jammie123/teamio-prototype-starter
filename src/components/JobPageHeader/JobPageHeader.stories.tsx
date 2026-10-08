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
  },
} satisfies Meta<typeof JobPageHeader>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  decorators: [onPageBackground],
  render: (args) => (
    <Tabs defaultValue="aktivni">
      <JobPageHeader {...args} />
    </Tabs>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('heading', { level: 1, name: 'Nábory' })).toBeInTheDocument()
    await userEvent.click(canvas.getByRole('button', { name: 'Další možnosti přidání' }))
    await expect(canvas.getByRole('option', { name: 'Přidat brigádu' })).toBeInTheDocument()
  },
}

export const InPage: Story = {
  render: (args) => (
    <Tabs defaultValue="aktivni" className="tm-contents">
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
        <TabsContent value="aktivni">Otevřené pozice.</TabsContent>
        <TabsContent value="archiv">Uzavřené pozice.</TabsContent>
        <TabsContent value="navrhy">Návrhy k publikaci.</TabsContent>
      </PageTemplate>
    </Tabs>
  ),
  parameters: {
    layout: 'fullscreen',
  },
}
