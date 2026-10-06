import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { JobsFilterV2 } from './JobsFilterV2'
import type { JobsFilterProps, JobsFilterValue } from '../JobsFilter/types'

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
    <JobsFilterV2
      value={emptyValue}
      onChange={vi.fn()}
      recruiters={recruiters}
      managers={managers}
      departments={departments}
      {...props}
    />,
  )
}

describe('JobsFilterV2', () => {
  it('renders search, recruiter dropdown, and Další filtry while extra filters stay hidden', () => {
    renderFilter()

    expect(screen.getByPlaceholderText('Hledat nábor…')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Personalista' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Řazení' })).not.toBeInTheDocument()
    expect(screen.queryByRole('option')).not.toBeInTheDocument()
    expect(document.querySelector('select')).not.toBeInTheDocument()
    const toggle = screen.getByRole('button', { name: 'Další filtry' })
    expect(toggle).toHaveAttribute('aria-expanded', 'false')

    expect(screen.queryByRole('button', { name: 'Liniový manažer' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Oddělení' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Typ úvazku' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Stav inzerátu' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Potvrdit' })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Resetovat filtry' })).toHaveClass('tm-invisible')
  })

  it('lays out more-filter rows as a semibold label and a select in a 400px dropdown', () => {
    renderFilter({ moreFiltersOpen: true })

    const panel = screen.getByTestId('dropdown-body')
    expect(panel).toHaveClass('!tm-min-w-[400px]', '!tm-w-[400px]')

    for (const label of ['Liniový manažer', 'Oddělení', 'Typ úvazku', 'Stav inzerátu']) {
      const rowLabel = screen.getByText(label, { selector: 'span.tm-font-medium' })
      expect(rowLabel).toHaveClass('tm-text-sm', 'tm-font-medium')
      expect(screen.getByRole('button', { name: label })).toBeInTheDocument()
    }
  })

  it('opens a stacked more-filters dropdown with Potvrdit', async () => {
    const user = userEvent.setup()
    const onMoreFiltersOpenChange = vi.fn()
    renderFilter({ onMoreFiltersOpenChange })

    await user.click(screen.getByRole('button', { name: 'Další filtry' }))

    const toggle = screen.getByRole('button', { name: 'Další filtry' })
    expect(toggle).toHaveAttribute('aria-expanded', 'true')
    expect(onMoreFiltersOpenChange).toHaveBeenCalledWith(true)
    expect(screen.getByRole('button', { name: 'Liniový manažer' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Oddělení' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Typ úvazku' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Stav inzerátu' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Potvrdit' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Typ úvazku' }))
    expect(screen.getByRole('option', { name: 'Plný úvazek' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Zkrácený úvazek' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Stav inzerátu' }))
    expect(screen.getByRole('option', { name: 'Aktivní inzerce' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Ukončená inzerce' })).toBeInTheDocument()
  })

  it('applies an extra filter immediately and keeps the more-filters dropdown open', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    renderFilter({ onChange, moreFiltersOpen: true })

    await user.click(screen.getByRole('button', { name: 'Liniový manažer' }))
    await user.click(screen.getByRole('option', { name: 'Karel Horák' }))

    expect(onChange).toHaveBeenCalledWith({ ...emptyValue, managerId: 'karel' })
    expect(screen.getByRole('button', { name: 'Další filtry' })).toHaveAttribute(
      'aria-expanded',
      'true',
    )
    expect(screen.getByRole('button', { name: 'Potvrdit' })).toBeInTheDocument()
  })

  it('closes the more-filters dropdown when Potvrdit is clicked', async () => {
    const user = userEvent.setup()
    const onMoreFiltersOpenChange = vi.fn()
    renderFilter({ defaultMoreFiltersOpen: true, onMoreFiltersOpenChange })

    await user.click(screen.getByRole('button', { name: 'Potvrdit' }))

    expect(onMoreFiltersOpenChange).toHaveBeenCalledWith(false)
    expect(screen.queryByRole('button', { name: 'Liniový manažer' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Potvrdit' })).not.toBeInTheDocument()
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

    expect(screen.getByRole('button', { name: 'Další filtry' })).toHaveAttribute(
      'aria-expanded',
      'true',
    )
    expect(screen.getByRole('button', { name: 'Liniový manažer' })).toBeInTheDocument()
  })

  it('renders a sort select after the recruiter and calls onSortChange', async () => {
    const user = userEvent.setup()
    const onSortChange = vi.fn()
    const sortOptions = [
      { value: 'latestAd', label: 'Nejnovější inzeráty' },
      { value: 'newestJob', label: 'Nejnovější nábor' },
    ]
    renderFilter({
      sortValue: 'latestAd',
      sortOptions,
      onSortChange,
    })

    const sort = screen.getByRole('button', { name: 'Řazení' })
    expect(sort).toHaveTextContent('Nejnovější inzeráty')

    await user.click(sort)
    expect(screen.queryByRole('option', { name: 'Všichni' })).not.toBeInTheDocument()
    await user.click(screen.getByRole('option', { name: 'Nejnovější nábor' }))
    expect(onSortChange).toHaveBeenCalledWith('newestJob')
  })

  it('renders a subtitle under a sort option and lists the extra sort choices', async () => {
    const user = userEvent.setup()
    renderFilter({
      sortValue: 'latestAd',
      sortOptions: [
        {
          value: 'latestAd',
          label: 'Nejnovější inzeráty',
          description: 'Vystavení inzerátu, topování a zvýraznění',
        },
        { value: 'mostNewCandidates', label: 'Nejvíce nových uchazečů' },
        { value: 'titleAz', label: 'Název A–Z' },
      ],
      onSortChange: vi.fn(),
    })

    await user.click(screen.getByRole('button', { name: 'Řazení' }))

    expect(screen.getByTestId('option-description')).toHaveTextContent(
      'Vystavení inzerátu, topování a zvýraznění',
    )
    expect(screen.getByRole('option', { name: /Nejvíce nových uchazečů/ })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: /Název A–Z/ })).toBeInTheDocument()
  })

  it('shows Resetovat filtry when any filter is set and keeps it invisible when empty', () => {
    const { rerender } = renderFilter({ value: { ...emptyValue, query: 'Řidič' } })

    expect(screen.getByRole('button', { name: 'Resetovat filtry' })).not.toHaveClass('tm-invisible')

    rerender(
      <JobsFilterV2
        value={emptyValue}
        onChange={vi.fn()}
        recruiters={recruiters}
        managers={managers}
        departments={departments}
      />,
    )

    expect(screen.getByRole('button', { name: 'Resetovat filtry' })).toHaveClass('tm-invisible')
  })

  it('does not treat sort as an active filter for the reset link', () => {
    renderFilter({
      sortValue: 'newestJob',
      sortOptions: [{ value: 'newestJob', label: 'Nejnovější nábor' }],
      onSortChange: vi.fn(),
    })

    expect(screen.getByRole('button', { name: 'Resetovat filtry' })).toHaveClass('tm-invisible')
  })

  it('resets filters and closes the more-filters dropdown', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    const onMoreFiltersOpenChange = vi.fn()
    renderFilter({
      value: {
        query: 'Řidič',
        recruiterId: 'martina',
        managerId: 'karel',
        departmentId: 'centrala',
        employmentType: 'fullTime',
        advertisementStatus: 'active',
      },
      moreFiltersOpen: true,
      onChange,
      onMoreFiltersOpenChange,
    })

    await user.click(screen.getByRole('button', { name: 'Resetovat filtry' }))

    expect(onChange).toHaveBeenCalledWith(emptyValue)
    expect(onMoreFiltersOpenChange).toHaveBeenCalledWith(false)
  })
})
