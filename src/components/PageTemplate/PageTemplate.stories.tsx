import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { fn } from 'storybook/test'
import { Card } from '../Card'
import { Button } from '../Button'
import type { LeftMenuItemData } from '../LeftMenu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../Table'
import { Typography } from '../Typography'
import { PageTemplate } from './PageTemplate'

const demoUser = {
  name: 'Jan Fuxa',
  company: 'LMCTEST_Teamio s.r.o.',
}

const leftMenuItems: LeftMenuItemData[] = [
  { id: 'prehled', label: 'Přehled', icon: 'home', href: '#prehled' },
  { id: 'nabory', label: 'Nábory', icon: 'file-text', href: '#nabory' },
  { id: 'uchazeci', label: 'Uchazeči', icon: 'user', href: '#uchazeci' },
  { id: 'reporty', label: 'Reporty', icon: 'bar-chart', href: '#reporty' },
]

const tableRows = [
  ['Anna Nováková', 'Frontend vývojář', 'Nový'],
  ['Petr Svoboda', 'Produktový manažer', 'Pohovor'],
  ['Eva Dvořáková', 'Recruiter', 'Nabídka'],
]

const meta = {
  title: 'Page/Page Template',
  component: PageTemplate,
  args: {
    leftMenu: {
      items: leftMenuItems,
      activeItemId: 'prehled',
    },
    headerTop: {
      user: demoUser,
      onMessagesClick: fn(),
      onNotificationsClick: fn(),
      onSearchChange: fn(),
    },
    children: (
      <>
        <Typography as="h1" variant="h3">
          Obsah stránky
        </Typography>
        <Typography variant="body" className="tm-mt-2 tm-text-secondary-default">
          Page Template skládá fixní LeftMenu, HeaderTop a oblast obsahu pro další
          komponenty.
        </Typography>
      </>
    ),
  },
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof PageTemplate>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithTable: Story = {
  args: {
    leftMenu: {
      items: leftMenuItems,
      activeItemId: 'uchazeci',
    },
    children: (
      <>
        <Typography as="h1" variant="h3" className="tm-mb-4">
          Uchazeči
        </Typography>
        <Table aria-label="Uchazeči">
          <TableHead>
            <TableRow>
              <TableHeader>Jméno</TableHeader>
              <TableHeader>Pozice</TableHeader>
              <TableHeader>Stav</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {tableRows.map(([name, role, status]) => (
              <TableRow key={name}>
                <TableCell>{name}</TableCell>
                <TableCell>{role}</TableCell>
                <TableCell>{status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </>
    ),
  },
}

export const WithCards: Story = {
  args: {
    leftMenu: {
      items: leftMenuItems,
      activeItemId: 'nabory',
    },
    children: (
      <>
        <Typography as="h1" variant="h3" className="tm-mb-4">
          Nábory
        </Typography>
        <div className="tm-grid tm-gap-4 md:tm-grid-cols-2">
          <Card>
            <Typography as="h2" variant="h4">
              Produktový manažer
            </Typography>
            <Typography className="tm-mt-2 tm-text-secondary-default">
              Praha · Full-time · Publikováno dnes
            </Typography>
            <div className="tm-mt-4">
              <Button size="small">Otevřít</Button>
            </div>
          </Card>
          <Card>
            <Typography as="h2" variant="h4">
              Frontend vývojář
            </Typography>
            <Typography className="tm-mt-2 tm-text-secondary-default">
              Brno · Hybrid · 12 uchazečů
            </Typography>
            <div className="tm-mt-4">
              <Button size="small" variant="secondary">
                Detail
              </Button>
            </div>
          </Card>
        </div>
      </>
    ),
  },
}

export const Collapsed: Story = {
  args: {
    leftMenu: {
      items: leftMenuItems,
      activeItemId: 'prehled',
      isCollapsed: true,
    },
  },
}

export const Interactive: Story = {
  render: function InteractivePageTemplate(args) {
    const [search, setSearch] = useState('')
    const [collapsed, setCollapsed] = useState(false)

    return (
      <PageTemplate
        {...args}
        leftMenu={{
          ...args.leftMenu,
          isCollapsed: collapsed,
          onCollapsedChange: setCollapsed,
        }}
        headerTop={{
          ...args.headerTop,
          searchValue: search,
          onSearchChange: setSearch,
          messagesCount: 3,
          notificationsCount: 12,
        }}
      >
        <Typography as="h1" variant="h3">
          Interaktivní stránka
        </Typography>
        <Typography variant="body" className="tm-mt-2 tm-text-secondary-default">
          Menu: {collapsed ? 'sbalené' : 'rozbalené'} · Hledání: {search || '—'}
        </Typography>
      </PageTemplate>
    )
  },
}
