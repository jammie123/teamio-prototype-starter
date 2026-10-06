import { useState, type ChangeEvent } from 'react'
import { cn } from '../../lib/cn'
import { validationBorderClass } from '../../lib/validation'
import { Button } from '../Button'
import { Dropdown, DropdownBody, DropdownToggle } from '../Dropdown'
import { Icon } from '../Icon'
import { Input } from '../Input'
import { Link } from '../Link'
import { Option, OptionList } from '../OptionList'
import type {
  JobsFilterAdvertisementStatus,
  JobsFilterEmploymentType,
  JobsFilterOption,
  JobsFilterProps,
  JobsFilterValue,
} from '../JobsFilter/types'

export type {
  JobsFilterAdvertisementStatus,
  JobsFilterEmploymentType,
  JobsFilterOption,
  JobsFilterProps,
  JobsFilterProps as JobsFilterV2Props,
  JobsFilterValue,
} from '../JobsFilter/types'

const EMPTY_JOBS_FILTER: JobsFilterValue = {
  query: '',
  recruiterId: '',
  managerId: '',
  departmentId: '',
  employmentType: '',
  advertisementStatus: '',
}

const EMPLOYMENT_TYPE_OPTIONS: JobsFilterOption[] = [
  { value: 'fullTime', label: 'Plný úvazek' },
  { value: 'partTime', label: 'Zkrácený úvazek' },
]

const ADVERTISEMENT_STATUS_OPTIONS: JobsFilterOption[] = [
  { value: 'active', label: 'Aktivní inzerce' },
  { value: 'ended', label: 'Ukončená inzerce' },
]

function hasActiveFilters(value: JobsFilterValue) {
  return Boolean(
    value.query ||
      value.recruiterId ||
      value.managerId ||
      value.departmentId ||
      value.employmentType ||
      value.advertisementStatus,
  )
}

function MoreFilterLabel({ children }: { children: string }) {
  return <span className="tm-text-sm tm-font-medium">{children}</span>
}

function FilterDropdown({
  label,
  emptyLabel,
  value,
  options,
  onChange,
  className,
}: {
  label: string
  emptyLabel?: string
  value: string
  options: JobsFilterOption[]
  onChange: (next: string) => void
  className?: string
}) {
  const selected = options.find((option) => option.value === value)

  return (
    <Dropdown className={cn('tm-block tm-min-w-[12rem]', className ?? 'tm-flex-1')}>
      <DropdownToggle
        variant="custom"
        showIndicator
        aria-label={label}
        className={cn(
          'tm-h-10',
          'tm-w-full',
          'tm-justify-between',
          'tm-gap-2',
          'tm-px-3',
          'tm-py-2',
          'tm-text-base',
          'tm-font-inherit',
          'tm-rounded',
          'tm-border',
          validationBorderClass(),
          'tm-bg-basic',
          selected ? 'tm-text-primary-default' : 'tm-text-secondary-default',
        )}
      >
        <span className="tm-min-w-0 tm-truncate">{selected?.label ?? emptyLabel ?? label}</span>
      </DropdownToggle>
      <DropdownBody className="tm-w-full tm-min-w-full tm-max-w-none">
        <OptionList aria-label={label}>
          {emptyLabel ? (
            <Option isSelected={!value} onClick={() => onChange('')}>
              {emptyLabel}
            </Option>
          ) : null}
          {options.map((option) => (
            <Option
              key={option.value}
              isSelected={option.value === value}
              description={option.description}
              onClick={() => onChange(option.value)}
            >
              {option.label}
            </Option>
          ))}
        </OptionList>
      </DropdownBody>
    </Dropdown>
  )
}

export function JobsFilterV2({
  value,
  onChange,
  recruiters,
  managers,
  departments,
  sortValue,
  sortOptions,
  onSortChange,
  moreFiltersOpen,
  defaultMoreFiltersOpen = false,
  onMoreFiltersOpenChange,
  className,
}: JobsFilterProps) {
  const isOpenControlled = moreFiltersOpen !== undefined
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultMoreFiltersOpen)
  const open = isOpenControlled ? moreFiltersOpen : uncontrolledOpen

  const setOpen = (next: boolean) => {
    if (!isOpenControlled) {
      setUncontrolledOpen(next)
    }
    onMoreFiltersOpenChange?.(next)
  }

  const patch = <K extends keyof JobsFilterValue>(key: K, nextValue: JobsFilterValue[K]) => {
    onChange({ ...value, [key]: nextValue })
  }

  const handleReset = () => {
    onChange({ ...EMPTY_JOBS_FILTER })
    setOpen(false)
  }

  return (
    <div className={cn('tm-flex tm-flex-wrap tm-items-center tm-gap-4', className)}>
      <div className="tm-relative tm-min-w-[16rem] tm-flex-1">
        <Icon
          name="search"
          className="tm-pointer-events-none tm-absolute tm-left-3 tm-top-1/2 tm-z-10 tm--translate-y-1/2 tm-text-secondary-default"
        />
        <Input
          value={value.query}
          placeholder="Hledat nábor…"
          aria-label="Hledat nábor…"
          onChange={(event: ChangeEvent<HTMLInputElement>) => patch('query', event.target.value)}
          className="tm-pl-10"
        />
      </div>

      <FilterDropdown
        label="Personalista"
        emptyLabel="Všichni"
        value={value.recruiterId}
        options={recruiters}
        onChange={(next) => patch('recruiterId', next)}
      />

      {sortOptions && onSortChange ? (
        <FilterDropdown
          label="Řazení"
          value={sortValue ?? ''}
          options={sortOptions}
          onChange={onSortChange}
        />
      ) : null}

      <Dropdown
        autoClose={false}
        isOpen={open}
        onOpenChange={setOpen}
        className="tm-shrink-0"
      >
        {({ setOpen: closeMoreFilters }) => (
          <>
            <DropdownToggle variant="button-tertiary" aria-expanded={open}>
              Další filtry
            </DropdownToggle>
            <DropdownBody
              overflow="visible"
              className="tm-grid !tm-min-w-[400px] !tm-w-[400px] !tm-max-w-none !tm-p-5 tm-grid-cols-[auto_minmax(0,1fr)] tm-items-center tm-gap-x-8 tm-gap-y-4"
            >
              <MoreFilterLabel>Liniový manažer</MoreFilterLabel>
              <FilterDropdown
                label="Liniový manažer"
                emptyLabel="Všichni"
                value={value.managerId}
                options={managers}
                onChange={(next) => patch('managerId', next)}
                className="tm-w-full tm-min-w-0"
              />
              <MoreFilterLabel>Oddělení</MoreFilterLabel>
              <FilterDropdown
                label="Oddělení"
                emptyLabel="Všechny"
                value={value.departmentId}
                options={departments}
                onChange={(next) => patch('departmentId', next)}
                className="tm-w-full tm-min-w-0"
              />
              <MoreFilterLabel>Typ úvazku</MoreFilterLabel>
              <FilterDropdown
                label="Typ úvazku"
                emptyLabel="Všechny"
                value={value.employmentType}
                options={EMPLOYMENT_TYPE_OPTIONS}
                onChange={(next) => patch('employmentType', next as JobsFilterEmploymentType | '')}
                className="tm-w-full tm-min-w-0"
              />
              <MoreFilterLabel>Stav inzerátu</MoreFilterLabel>
              <FilterDropdown
                label="Stav inzerátu"
                emptyLabel="Všechny"
                value={value.advertisementStatus}
                options={ADVERTISEMENT_STATUS_OPTIONS}
                onChange={(next) =>
                  patch('advertisementStatus', next as JobsFilterAdvertisementStatus | '')
                }
                className="tm-w-full tm-min-w-0"
              />
              <Button
                className="tm-col-span-2"
                onClick={() => {
                  closeMoreFilters(false)
                }}
              >
                Potvrdit
              </Button>
            </DropdownBody>
          </>
        )}
      </Dropdown>

      <Link
        className={cn('tm-ml-auto tm-shrink-0', !hasActiveFilters(value) && 'tm-invisible')}
        isDisabled={!hasActiveFilters(value)}
        onClick={handleReset}
      >
        Resetovat filtry
      </Link>
    </div>
  )
}
