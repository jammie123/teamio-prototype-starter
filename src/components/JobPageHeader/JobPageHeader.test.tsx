import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Tabs } from '../Tabs'
import { JobPageHeader } from './JobPageHeader'

describe('JobPageHeader', () => {
  it('renders the Nábory heading, job tabs, and split add action', async () => {
    const user = userEvent.setup()
    const onAddJob = vi.fn()
    const onAddBrigade = vi.fn()

    render(
      <Tabs defaultValue="open">
        <JobPageHeader onAddJob={onAddJob} onAddBrigade={onAddBrigade} />
      </Tabs>,
    )

    expect(screen.getByRole('heading', { level: 1, name: 'Nábory' })).toBeInTheDocument()
    expect(screen.getByRole('tablist', { name: 'Filtry náborů' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Otevřený' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Zveřejněný' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Nezveřejněný' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Rozpracovaný' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Archivní' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Přidat nábor' }))
    expect(onAddJob).toHaveBeenCalledTimes(1)

    await user.click(screen.getByRole('button', { name: 'Další možnosti přidání' }))
    expect(screen.getByRole('option', { name: 'Přidat brigádu' })).toBeInTheDocument()

    await user.click(screen.getByRole('option', { name: 'Přidat brigádu' }))
    expect(onAddBrigade).toHaveBeenCalledTimes(1)
  })

  it('renders jobCount in the title and tabCounts on default tabs', () => {
    render(
      <Tabs defaultValue="open">
        <JobPageHeader
          jobCount={12}
          tabCounts={{ open: 5, published: 3, unpublished: 2, draft: 1, archived: 1 }}
        />
      </Tabs>,
    )

    expect(screen.getByRole('heading', { level: 1, name: 'Nábory (12)' })).toBeInTheDocument()
    expect(screen.getByRole('banner', { name: 'Nábory' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /Otevřený/ })).toHaveTextContent('5')
    expect(screen.getByRole('tab', { name: /Zveřejněný/ })).toHaveTextContent('3')
  })

  it('renders a secondary Hromadné akce toggle to the right of Přidat nábor', async () => {
    const user = userEvent.setup()
    const onBulkActionsToggle = vi.fn()

    render(
      <Tabs defaultValue="open">
        <JobPageHeader onBulkActionsToggle={onBulkActionsToggle} />
      </Tabs>,
    )

    const bulkToggle = screen.getByRole('button', { name: 'Hromadné akce' })
    expect(bulkToggle).toHaveAttribute('aria-pressed', 'false')
    expect(bulkToggle.className).toContain('tm-bg-basic')

    await user.click(bulkToggle)
    expect(onBulkActionsToggle).toHaveBeenCalledTimes(1)
  })

  it('shows Vypnout hromadné úpravy as the active toggle while bulk editing is on', () => {
    render(
      <Tabs defaultValue="open">
        <JobPageHeader bulkActionsActive onBulkActionsToggle={vi.fn()} />
      </Tabs>,
    )

    const bulkToggle = screen.getByRole('button', { name: 'Vypnout hromadné úpravy' })
    expect(screen.queryByRole('button', { name: 'Hromadné akce' })).not.toBeInTheDocument()
    expect(bulkToggle).toHaveAttribute('aria-pressed', 'true')
    expect(bulkToggle.className).toContain('tm-bg-interactive-active')
    expect(bulkToggle.className).toContain('tm-border-action-secondary-active')
  })
})
