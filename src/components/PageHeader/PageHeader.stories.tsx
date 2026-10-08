import type { Decorator, Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { Button } from '../Button'
import { Dropdown, DropdownBody, DropdownToggle } from '../Dropdown'
import { Icon } from '../Icon'
import { Option, OptionList } from '../OptionList'
import { Tabs, TabsList, TabsTrigger } from '../Tabs'
import { PageHeader } from './PageHeader'

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
