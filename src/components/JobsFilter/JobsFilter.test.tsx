import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { JobsFilter } from './JobsFilter'
import type { JobsFilterProps, JobsFilterValue } from './types'

const recruiters = [
  { value: 'martina', label: 'Martina Nováková' },
  { value: 'petra', label: 'Petra Svobodová' },
  { value: 'jan', label: 'Jan Dvořák' },
  { value: 'eva', label: 'Eva Králová' },
  { value: 'tomas', label: 'Tomáš Novotný' },
]

const managers = [
  { value: 'karel', label: 'Karel Horák' },
  { value: 'lucie', label: 'Lucie Černá' },
  { value: 'martin', label: 'Martin Veselý' },
  { value: 'alena', label: 'Alena Pokorná' },
  { value: 'pavel', label: 'Pavel Němec' },
]

const departments = [
  { value: 'centrala', label: 'Centrála' },
  { value: 'provoz', label: 'Provoz' },
]

const emptyValue: JobsFilterValue = {
  query: '',
  recruiterId: '',
  managerId: '',
  departmentId: '',
  employmentType: '',
  advertisementStatus: '',
}

function renderFilter(props: Partial<JobsFilterProps> = {}) {
  return render(
    <JobsFilter
      value={emptyValue}
      onChange={vi.fn()}
      recruiters={recruiters}
      managers={managers}
      departments={departments}
      {...props}
    />,
  )
}

describe('JobsFilter', () => {
  it('renders search, recruiter dropdown, and the more-filters toggle while extra filters stay hidden', () => {
    renderFilter()

    expect(screen.getByPlaceholderText('Hledat nábor…')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Personalista' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Řazení' })).not.toBeInTheDocument()
    expect(screen.queryByRole('option')).not.toBeInTheDocument()
    expect(document.querySelector('select')).not.toBeInTheDocument()
    const toggle = screen.getByRole('button', { name: 'Zobrazit více filtrů' })
    expect(toggle).toHaveAttribute('aria-expanded', 'false')

    expect(screen.queryByRole('button', { name: 'Liniový manažer' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Oddělení' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Typ úvazku' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Stav inzerátu' })).not.toBeInTheDocument()
  })

  it('reveals extra filter dropdowns when the toggle is clicked', async () => {
    const user = userEvent.setup()
    const onMoreFiltersOpenChange = vi.fn()
    renderFilter({ onMoreFiltersOpenChange })

    await user.click(screen.getByRole('button', { name: 'Zobrazit více filtrů' }))

    const collapse = screen.getByRole('button', { name: 'Zobrazit méně filtrů' })
    expect(collapse).toHaveAttribute('aria-expanded', 'true')
    expect(onMoreFiltersOpenChange).toHaveBeenCalledWith(true)
    expect(screen.getByRole('button', { name: 'Liniový manažer' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Oddělení' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Typ úvazku' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Stav inzerátu' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Typ úvazku' }))
    expect(screen.getByRole('option', { name: 'Plný úvazek' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Zkrácený úvazek' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Stav inzerátu' }))
    expect(screen.getByRole('option', { name: 'Aktivní inzerce' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Ukončená inzerce' })).toBeInTheDocument()
  })

  it('calls onChange with a patched value when search or recruiter changes', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    renderFilter({ onChange })

    await user.type(screen.getByPlaceholderText('Hledat nábor…'), 'ř')
    expect(onChange).toHaveBeenCalledWith({ ...emptyValue, query: 'ř' })

    await user.click(screen.getByRole('button', { name: 'Personalista' }))
    await user.click(screen.getByRole('option', { name: 'Martina Nováková' }))
    expect(onChange).toHaveBeenCalledWith({ ...emptyValue, recruiterId: 'martina' })
  })

  it('renders a search icon inside the search field', () => {
    renderFilter()

    const field = screen.getByPlaceholderText('Hledat nábor…').parentElement
    expect(field).not.toBeNull()
    expect(within(field as HTMLElement).getByTestId('icon')).toHaveAttribute(
      'data-icon-name',
      'search',
    )
  })

  it('shows extra filters when moreFiltersOpen is true', () => {
    renderFilter({ moreFiltersOpen: true })

    expect(screen.getByRole('button', { name: 'Zobrazit méně filtrů' })).toHaveAttribute(
      'aria-expanded',
      'true',
    )
    expect(screen.getByRole('button', { name: 'Liniový manažer' })).toBeInTheDocument()
  })

  it('renders a sort select after the recruiter and calls onSortChange', async () => {
    const user = userEvent.setup()
    const onSortChange = vi.fn()
    const sortOptions = [
      { value: 'latestAd', label: 'Nejnověji vystavený inzerát' },
      { value: 'newestJob', label: 'Nejnovější nábor' },
    ]
    renderFilter({
      sortValue: 'latestAd',
      sortOptions,
      onSortChange,
    })

    const sort = screen.getByRole('button', { name: 'Řazení' })
    expect(sort).toHaveTextContent('Nejnověji vystavený inzerát')

    await user.click(sort)
    expect(screen.queryByRole('option', { name: 'Všichni' })).not.toBeInTheDocument()
    await user.click(screen.getByRole('option', { name: 'Nejnovější nábor' }))
    expect(onSortChange).toHaveBeenCalledWith('newestJob')
  })
})
