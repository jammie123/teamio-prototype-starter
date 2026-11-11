import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { EmptyJobSearch } from './EmptyJobSearch'

const QUERY_DESCRIPTION =
  'Pro „sdvsd“ nemáme žádný nábor. Zkontrolujte překlepy nebo zkuste obecnější hledání.'
const FILTERS_DESCRIPTION =
  'Pro vybrané filtry nemáme žádný nábor. Zkuste některý filtr zrušit nebo nastavit šířeji.'

describe('EmptyJobSearch', () => {
  it('shows query copy and a primary reset action for a fulltext-only search', async () => {
    const user = userEvent.setup()
    const onResetFilters = vi.fn()

    render(<EmptyJobSearch query="sdvsd" onResetFilters={onResetFilters} />)

    expect(screen.getByRole('heading', { name: 'Nic jsme nenašli' })).toBeInTheDocument()
    expect(screen.getByText(QUERY_DESCRIPTION)).toBeInTheDocument()
    expect(screen.queryByText(FILTERS_DESCRIPTION)).not.toBeInTheDocument()

    const reset = screen.getByRole('button', { name: 'Resetovat filtry' })
    expect(reset).toHaveClass('tm-bg-action-primary-default')

    await user.click(reset)
    expect(onResetFilters).toHaveBeenCalledOnce()
  })

  it('shows filter copy when searching with fulltext and filters', () => {
    render(<EmptyJobSearch query="sdvsd" hasFilters onResetFilters={vi.fn()} />)

    expect(screen.getByRole('heading', { name: 'Nic jsme nenašli' })).toBeInTheDocument()
    expect(screen.getByText(FILTERS_DESCRIPTION)).toBeInTheDocument()
    expect(screen.queryByText(QUERY_DESCRIPTION)).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Resetovat filtry' })).toBeInTheDocument()
  })

  it('shows filter copy when searching with filters only', () => {
    render(<EmptyJobSearch hasFilters onResetFilters={vi.fn()} />)

    expect(screen.getByRole('heading', { name: 'Nic jsme nenašli' })).toBeInTheDocument()
    expect(screen.getByText(FILTERS_DESCRIPTION)).toBeInTheDocument()
    expect(screen.queryByText(/„.+“/)).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Resetovat filtry' })).toBeInTheDocument()
  })

  it('hides the reset button when no handler is provided', () => {
    render(<EmptyJobSearch query="sdvsd" />)

    expect(screen.getByText(QUERY_DESCRIPTION)).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Resetovat filtry' })).not.toBeInTheDocument()
  })
})
