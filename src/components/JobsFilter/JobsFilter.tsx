import { useState, type ChangeEvent } from 'react'
import { cn } from '../../lib/cn'
import { validationBorderClass } from '../../lib/validation'
import { Button } from '../Button'
import { Dropdown, DropdownBody, DropdownToggle } from '../Dropdown'
import { Icon } from '../Icon'
import { Input } from '../Input'
import { Option, OptionList } from '../OptionList'
import type {
  JobsFilterAdvertisementStatus,
  JobsFilterEmploymentType,
  JobsFilterOption,
  JobsFilterProps,
  JobsFilterValue,
} from './types'

export type {
  JobsFilterAdvertisementStatus,
  JobsFilterEmploymentType,
  JobsFilterOption,
  JobsFilterProps,
  JobsFilterValue,
} from './types'

const EMPLOYMENT_TYPE_OPTIONS: JobsFilterOption[] = [
  { value: 'fullTime', label: 'Plný úvazek' },
  { value: 'partTime', label: 'Zkrácený úvazek' },
]

const ADVERTISEMENT_STATUS_OPTIONS: JobsFilterOption[] = [
  { value: 'active', label: 'Aktivní inzerce' },
  { value: 'ended', label: 'Ukončená inzerce' },
]

function FilterDropdown({
  label,
  emptyLabel,
  value,
  options,
  onChange,
}: {
  label: string
  emptyLabel?: string
  value: string
  options: JobsFilterOption[]
  onChange: (next: string) => void
}) {
  const selected = options.find((option) => option.value === value)

  return (
    <Dropdown className="tm-block tm-min-w-[12rem] tm-flex-1">
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
        <span className="tm-min-w-0 tm-truncate">{selected?.label ?? label}</span>
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

export function JobsFilter({
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

  const patch = <K extends keyof JobsFilterValue>(key: K, nextValue: JobsFilterValue[K]) => {
    onChange({ ...value, [key]: nextValue })
  }

  const handleToggle = () => {
    const next = !open
    if (!isOpenControlled) {
      setUncontrolledOpen(next)
    }
    onMoreFiltersOpenChange?.(next)
  }

  return (
    <div className={cn('tm-flex tm-flex-col tm-gap-4', className)}>
      <div className="tm-flex tm-flex-wrap tm-items-center tm-gap-4">
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

        <Button
          variant="tertiary"
          aria-expanded={open}
          onClick={handleToggle}
          className="tm-shrink-0"
        >
          {open ? 'Zobrazit méně filtrů' : 'Zobrazit více filtrů'}
        </Button>
      </div>

      {open ? (
        <div className="tm-flex tm-flex-wrap tm-items-center tm-gap-4">
          <FilterDropdown
            label="Liniový manažer"
            emptyLabel="Všichni"
            value={value.managerId}
            options={managers}
            onChange={(next) => patch('managerId', next)}
          />
          <FilterDropdown
            label="Oddělení"
            emptyLabel="Všechny"
            value={value.departmentId}
            options={departments}
            onChange={(next) => patch('departmentId', next)}
          />
          <FilterDropdown
            label="Typ úvazku"
            emptyLabel="Všechny"
            value={value.employmentType}
            options={EMPLOYMENT_TYPE_OPTIONS}
            onChange={(next) => patch('employmentType', next as JobsFilterEmploymentType | '')}
          />
          <FilterDropdown
            label="Stav inzerátu"
            emptyLabel="Všechny"
            value={value.advertisementStatus}
            options={ADVERTISEMENT_STATUS_OPTIONS}
            onChange={(next) =>
              patch('advertisementStatus', next as JobsFilterAdvertisementStatus | '')
            }
          />
        </div>
      ) : null}
    </div>
  )
}
