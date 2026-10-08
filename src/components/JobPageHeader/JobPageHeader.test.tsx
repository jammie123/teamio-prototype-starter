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
      <Tabs defaultValue="aktivni">
        <JobPageHeader onAddJob={onAddJob} onAddBrigade={onAddBrigade} />
      </Tabs>,
    )

    expect(screen.getByRole('heading', { level: 1, name: 'Nábory' })).toBeInTheDocument()
    expect(screen.getByRole('tablist', { name: 'Filtry náborů' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Aktivní' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Archiv' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Návrhy' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Přidat nábor' }))
    expect(onAddJob).toHaveBeenCalledTimes(1)

    await user.click(screen.getByRole('button', { name: 'Další možnosti přidání' }))
    expect(screen.getByRole('option', { name: 'Přidat brigádu' })).toBeInTheDocument()

    await user.click(screen.getByRole('option', { name: 'Přidat brigádu' }))
    expect(onAddBrigade).toHaveBeenCalledTimes(1)
  })
})
