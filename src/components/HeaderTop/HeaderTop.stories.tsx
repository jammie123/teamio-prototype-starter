import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { fn } from 'storybook/test'
import { LeftMenu, type LeftMenuItemData } from '../LeftMenu'
import { Typography } from '../Typography'
import { HeaderTop } from './HeaderTop'

const demoUser = {
  name: 'Jan Fuxa',
  company: 'LMCTEST_Teamio s.r.o.',
}

const leftMenuItems: LeftMenuItemData[] = [
  { id: 'prehled', label: 'Přehled', icon: 'home', href: '#prehled' },
  { id: 'nabory', label: 'Nábory', icon: 'file-text', href: '#nabory' },
  { id: 'uchazeci', label: 'Uchazeči', icon: 'user', href: '#uchazeci' },
]

const meta = {
  title: 'Complex components/HeaderTop',
  component: HeaderTop,
  args: {
    user: demoUser,
    onMessagesClick: fn(),
    onNotificationsClick: fn(),
    onSearchChange: fn(),
  },
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof HeaderTop>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithBadges: Story = {
  args: {
    messagesCount: 3,
    notificationsCount: 12,
  },
}

export const WithLeftMenu: Story = {
  render: (args) => (
    <div className="tm-flex tm-min-h-screen">
      <LeftMenu items={leftMenuItems} activeItemId="prehled" position="static" />
      <div className="tm-flex tm-min-w-0 tm-flex-1 tm-flex-col">
        <HeaderTop {...args} />
        <main className="tm-flex-1 tm-bg-cover-light tm-p-6">
          <Typography variant="h3">Obsah stránky</Typography>
          <Typography variant="body" className="tm-mt-2 tm-text-secondary-default">
            HeaderTop je statický a sedí v toku dokumentu vedle LeftMenu.
          </Typography>
        </main>
      </div>
    </div>
  ),
}

export const Interactive: Story = {
  render: function InteractiveHeaderTop(args) {
    const [search, setSearch] = useState('')
    const [lastAction, setLastAction] = useState('—')

    return (
      <div>
        <HeaderTop
          {...args}
          searchValue={search}
          onSearchChange={setSearch}
          addMenuItems={[
            {
              id: 'nabor',
              label: 'Nábor',
              onClick: () => setLastAction('Přidat: Nábor'),
            },
            {
              id: 'uchazec',
              label: 'Uchazeč',
              onClick: () => setLastAction('Přidat: Uchazeč'),
            },
            {
              id: 'brigada',
              label: 'Brigáda',
              onClick: () => setLastAction('Přidat: Brigáda'),
            },
          ]}
          userMenuItems={[
            {
              id: 'nastaveni',
              label: 'Nastavení',
              onClick: () => setLastAction('Uživatel: Nastavení'),
            },
            {
              id: 'akademie',
              label: 'Akademie',
              onClick: () => setLastAction('Uživatel: Akademie'),
            },
          ]}
          onMessagesClick={() => setLastAction('Zprávy')}
          onNotificationsClick={() => setLastAction('Notifikace')}
          messagesCount={2}
          notificationsCount={5}
        />
        <div className="tm-p-4">
          <Typography variant="caption">Hledání: {search || '—'}</Typography>
          <Typography variant="caption" className="tm-mt-1 tm-block">
            Poslední akce: {lastAction}
          </Typography>
        </div>
      </div>
    )
  },
}
