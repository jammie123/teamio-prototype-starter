import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Typography } from '../Typography'
import { LeftMenu, type LeftMenuItemData } from './LeftMenu'

const items: LeftMenuItemData[] = [
  { id: 'prehled', label: 'Přehled', icon: 'home', href: '#prehled' },
  { id: 'nabory', label: 'Nábory', icon: 'file-text', href: '#nabory' },
  { id: 'uchazeci', label: 'Uchazeči', icon: 'user', href: '#uchazeci' },
  { id: 'preboarding', label: 'Preboarding', icon: 'briefcase', href: '#preboarding' },
  { id: 'databaze', label: 'Databáze Jobs.cz', icon: 'database', href: '#databaze' },
  { id: 'kalendar', label: 'Kalendář pohovorů', icon: 'calendar', href: '#kalendar' },
  { id: 'statistiky', label: 'Statistiky', icon: 'bar-chart', href: '#statistiky' },
]

const meta = {
  title: 'Complex components/LeftMenu',
  component: LeftMenu,
  args: {
    items,
    activeItemId: 'prehled',
    edition: 'default',
    position: 'static',
  },
} satisfies Meta<typeof LeftMenu>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Collapsed: Story = {
  args: {
    defaultCollapsed: true,
  },
}

export const WithDisabledItem: Story = {
  args: {
    items: [
      ...items.slice(0, 4),
      { id: 'databaze', label: 'Databáze Jobs.cz', icon: 'database', isDisabled: true },
      ...items.slice(5),
    ],
  },
}

export const WithFooter: Story = {
  args: {
    footer: (
      <Typography variant="caption" className="tm-text-secondary-inverted-default">
        Alma Career · v1.0
      </Typography>
    ),
  },
}

export const NotCollapsible: Story = {
  args: {
    isCollapsible: false,
  },
}

/** Logo se mění podle zakoupené edice klienta. Zatím je implementovaná jen `default`. */
export const Editions: Story = {
  render: (args) => (
    <div className="tm-flex tm-gap-6">
      <LeftMenu {...args} edition="default" aria-label="Navigace edice default" />
      <LeftMenu {...args} edition="neznama-edice" aria-label="Navigace neznámé edice" />
    </div>
  ),
}

export const Interactive: Story = {
  render: function InteractiveLeftMenu(args) {
    const [activeItemId, setActiveItemId] = useState('prehled')
    const [isCollapsed, setIsCollapsed] = useState(false)

    return (
      <LeftMenu
        {...args}
        activeItemId={activeItemId}
        isCollapsed={isCollapsed}
        onCollapsedChange={setIsCollapsed}
        items={items.map((item) => ({
          ...item,
          href: undefined,
          onClick: () => setActiveItemId(item.id),
        }))}
      />
    )
  },
}

export const FixedWithScrollableContent: Story = {
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    position: 'fixed',
  },
  render: (args) => (
    <div className="tm-flex">
      <LeftMenu {...args} />
      <div className="tm-ml-left-menu tm-flex tm-flex-col tm-gap-4 tm-p-6">
        <Typography as="h1" variant="h2">
          Fixní navigace při scrollování
        </Typography>
        {Array.from({ length: 30 }, (_, index) => (
          <Typography key={index}>
            Řádek obsahu {index + 1} — scrollujte stránkou, levé menu zůstává na místě.
          </Typography>
        ))}
      </div>
    </div>
  ),
}
