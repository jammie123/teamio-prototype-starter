import type { Decorator, Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { Button } from '../Button'
import { Dropdown, DropdownBody, DropdownToggle } from '../Dropdown'
import { Icon } from '../Icon'
import type { LeftMenuItemData } from '../LeftMenu'
import { Option, OptionList } from '../OptionList'
import { PageTemplate } from '../PageTemplate'
import { SplitButton } from '../SplitButton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../Tabs'
import { PageHeader } from './PageHeader'

const demoUser = {
  name: 'Jan Fuxa',
  company: 'LMCTEST_Teamio s.r.o.',
}

const leftMenuItems: LeftMenuItemData[] = [
  { id: 'prehled', label: 'Přehled', icon: 'home', href: '#prehled' },
  { id: 'nabory', label: 'Nábory', icon: 'file-text', href: '#nabory' },
  { id: 'uchazeci', label: 'Uchazeči', icon: 'user', href: '#uchazeci' },
]

const naboryTabs = (
  <TabsList aria-label="Filtry náborů">
    <TabsTrigger value="aktivni">Aktivní</TabsTrigger>
    <TabsTrigger value="archiv">Archiv</TabsTrigger>
    <TabsTrigger value="navrhy">Návrhy</TabsTrigger>
  </TabsList>
)

// The header is a white surface, so stories sit on the page background to show its elevation.
const onPageBackground: Decorator = (Story) => (
  <div className="tm-bg-cover-light tm-p-6">
    <Story />
  </div>
)

const meta = {
  title: 'Complex components/PageHeader',
  component: PageHeader,
  args: {
    title: 'Název stránky',
  },
} satisfies Meta<typeof PageHeader>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  decorators: [onPageBackground],
}

export const WithActions: Story = {
  decorators: [onPageBackground],
  args: {
    title: 'Uchazeči',
    actions: (
      <>
        <Button variant="secondary" onClick={fn()}>
          Export
        </Button>
        <Button onClick={fn()}>Přidat uchazeče</Button>
      </>
    ),
  },
}

export const WithOverflow: Story = {
  decorators: [onPageBackground],
  args: {
    title: 'Reporty',
    actions: (
      <>
        <Button onClick={fn()}>Nový report</Button>
        <Dropdown placement="bottom-end">
          <DropdownToggle variant="button-tertiary-circle" aria-label="Další akce">
            <Icon name="more-vertical" className="tm-text-lg" />
          </DropdownToggle>
          <DropdownBody>
            <OptionList>
              <Option onClick={fn()}>Duplikovat</Option>
              <Option onClick={fn()}>Sdílet</Option>
              <Option onClick={fn()} color="danger">
                Smazat
              </Option>
            </OptionList>
          </DropdownBody>
        </Dropdown>
      </>
    ),
  },
}

export const WithTabs: Story = {
  decorators: [onPageBackground],
  render: (args) => (
    <Tabs defaultValue="aktivni">
      <PageHeader {...args} tabs={naboryTabs} />
    </Tabs>
  ),
  args: {
    title: 'Nábory',
  },
}

export const JobsNabory: Story = {
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
        pageHeader={
          <PageHeader
            {...args}
            tabs={naboryTabs}
            actions={
              <SplitButton
                label="Přidat nábor"
                onClick={fn()}
                menuLabel="Další možnosti přidání"
              >
                <Option onClick={fn()}>Přidat brigádu</Option>
              </SplitButton>
            }
          />
        }
      >
        <TabsContent value="aktivni">Otevřené pozice.</TabsContent>
        <TabsContent value="archiv">Uzavřené pozice.</TabsContent>
        <TabsContent value="navrhy">Návrhy k publikaci.</TabsContent>
      </PageTemplate>
    </Tabs>
  ),
  args: {
    title: 'Nábory',
  },
  parameters: {
    layout: 'fullscreen',
  },
}
