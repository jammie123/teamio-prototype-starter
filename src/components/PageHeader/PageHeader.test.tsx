import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Button } from '../Button'
import { Option } from '../OptionList'
import { SplitButton } from '../SplitButton'
import { Tabs, TabsList, TabsTrigger } from '../Tabs'
import { PageHeader } from './PageHeader'

describe('PageHeader', () => {
  it('renders a header landmark with an h1 title', () => {
    render(<PageHeader title="Název stránky" />)

    expect(screen.getByTestId('page-header')).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 1, name: 'Název stránky' })).toBeInTheDocument()
    expect(screen.getByRole('banner', { name: 'Název stránky' })).toBeInTheDocument()
  })

  it('renders actions in the header', () => {
    render(
      <PageHeader
        title="Nábory"
        actions={<Button>Uložit</Button>}
      />,
    )

    expect(screen.getByRole('button', { name: 'Uložit' })).toBeInTheDocument()
  })

  it('renders a tablist when tabs are provided', () => {
    render(
      <Tabs defaultValue="aktivni">
        <PageHeader
          title="Nábory"
          tabs={
            <TabsList aria-label="Filtry náborů">
              <TabsTrigger value="aktivni">Aktivní</TabsTrigger>
              <TabsTrigger value="archiv">Archiv</TabsTrigger>
            </TabsList>
          }
        />
      </Tabs>,
    )

    expect(screen.getByRole('tablist', { name: 'Filtry náborů' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Aktivní' })).toBeInTheDocument()
  })

  it('composes the Nábory header with a split add action', async () => {
    const user = userEvent.setup()
    const onAddJob = vi.fn()
    const onAddBrigade = vi.fn()

    render(
      <PageHeader
        title="Nábory"
        actions={
          <SplitButton label="Přidat nábor" onClick={onAddJob}>
            <Option onClick={onAddBrigade}>Přidat brigádu</Option>
          </SplitButton>
        }
      />,
    )

    expect(screen.getByRole('heading', { level: 1, name: 'Nábory' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Přidat nábor' }))
    expect(onAddJob).toHaveBeenCalledTimes(1)

    await user.click(screen.getByRole('button', { name: 'Další možnosti' }))
    expect(screen.getByRole('option', { name: 'Přidat brigádu' })).toBeInTheDocument()
  })
})
