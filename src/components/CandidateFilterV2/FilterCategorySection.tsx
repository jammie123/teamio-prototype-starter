import { useId, type ChangeEvent } from 'react'
import { cn } from '../../lib/cn'
import { Button } from '../Button'
import { Checkbox } from '../Checkbox'
import { FormGroup } from '../FormGroup'
import { Icon } from '../Icon'
import { Radio } from '../Radio'
import { Typography } from '../Typography'
import { CANDIDATE_COPY } from '../Candidate/candidateCopy'
import type {
  CandidateFilterModalFieldConfig,
  CandidateFilterModalOption,
  CandidateFilterV2FieldMeta,
} from '../Candidate/filterModalTypes'
import { optionsHaveHierarchy } from '../Candidate/filterModalOptions'
import { buildOptionTree, type FilterOptionTreeNode } from './buildOptionTree'
import { FilterOptionLabel } from './FilterOptionLabel'

export interface FilterCategorySectionProps {
  field: CandidateFilterModalFieldConfig
  meta: CandidateFilterV2FieldMeta
  expanded: boolean
  onToggleExpanded: () => void
  /** Single-select string fields, or tag ids when `field.key === 'candidateTag'`. */
  value: string | string[]
  onChange: (next: string | string[]) => void
}

function treeLevelPaddingClass(level: number) {
  if (level <= 0) return undefined
  if (level === 1) return 'tm-pl-4'
  if (level === 2) return 'tm-pl-8'
  return 'tm-pl-12'
}

function FilterCheckboxTree({
  nodes,
  level,
  selected,
  onSelect,
  groupLabel,
}: {
  nodes: FilterOptionTreeNode[]
  level: number
  selected: string
  onSelect: (next: string) => void
  groupLabel: string
}) {
  return (
    <>
      {nodes.map((node) => (
        <div key={node.option.value} className="tm-flex tm-flex-col tm-gap-2">
          <Checkbox
            className={treeLevelPaddingClass(level)}
            checked={selected === node.option.value}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              onSelect(event.target.checked ? node.option.value : '')
            }}
          >
            <FilterOptionLabel option={node.option} />
          </Checkbox>
          {node.children.length > 0 ? (
            <FilterCheckboxTree
              nodes={node.children}
              level={level + 1}
              selected={selected}
              onSelect={onSelect}
              groupLabel={groupLabel}
            />
          ) : null}
        </div>
      ))}
    </>
  )
}

function FlatRadioList({
  name,
  emptyLabel,
  options,
  value,
  onChange,
  groupLabel,
}: {
  name: string
  emptyLabel: string
  options: CandidateFilterModalOption[]
  value: string
  onChange: (next: string) => void
  groupLabel: string
}) {
  return (
    <FormGroup>
      <div
        className="tm-flex tm-flex-col tm-gap-2"
        role="radiogroup"
        aria-label={groupLabel}
      >
        <Radio name={name} value="" checked={!value} onChange={() => onChange('')}>
          {emptyLabel}
        </Radio>
        {options.map((option) => (
          <Radio
            key={option.value}
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={() => onChange(option.value)}
          >
            <FilterOptionLabel option={option} />
          </Radio>
        ))}
      </div>
    </FormGroup>
  )
}

function FlatCheckboxMultiList({
  options,
  values,
  onChange,
  groupLabel,
}: {
  options: CandidateFilterModalOption[]
  values: string[]
  onChange: (next: string[]) => void
  groupLabel: string
}) {
  return (
    <FormGroup>
      <div className="tm-flex tm-flex-col tm-gap-2" role="group" aria-label={groupLabel}>
        {options.map((option) => (
          <Checkbox
            key={option.value}
            checked={values.includes(option.value)}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              if (event.target.checked) {
                onChange([...values, option.value])
              } else {
                onChange(values.filter((item) => item !== option.value))
              }
            }}
          >
            <FilterOptionLabel option={option} />
          </Checkbox>
        ))}
      </div>
    </FormGroup>
  )
}

export function FilterCategorySection({
  field,
  meta,
  expanded,
  onToggleExpanded,
  value,
  onChange,
}: FilterCategorySectionProps) {
  const copy = CANDIDATE_COPY.filterModal
  const headingId = useId()
  const hierarchical = optionsHaveHierarchy(field.options)
  const expandLabel = expanded ? copy.collapseCategory(field.label) : copy.expandCategory(field.label)

  return (
    <section
      role="group"
      aria-labelledby={headingId}
      className="tm-flex tm-flex-col tm-gap-3 tm-border-0 tm-border-t tm-border-solid tm-border-secondary tm-py-8 first:tm-border-t-0 first:tm-pt-0"
    >
      <div className="tm-flex tm-items-center tm-gap-2">
        <Typography id={headingId} variant="h2" className="tm-m-0 tm-flex-1 tm-font-medium">
          {field.label}
        </Typography>
        <Button
          type="button"
          variant="tertiary"
          isCircle
          aria-expanded={expanded}
          aria-label={expandLabel}
          onClick={onToggleExpanded}
        >
          <Icon name={expanded ? 'chevron-up' : 'chevron-down'} />
        </Button>
      </div>
      {expanded ? (
        <div className={cn('tm-flex tm-flex-col tm-gap-2 tm-pb-2')}>
          {hierarchical ? (
            <FormGroup>
              <div className="tm-flex tm-flex-col tm-gap-2" role="group" aria-label={field.label}>
                <FilterCheckboxTree
                  nodes={buildOptionTree(field.options)}
                  level={0}
                  selected={typeof value === 'string' ? value : ''}
                  onSelect={(next) => onChange(next)}
                  groupLabel={field.label}
                />
              </div>
            </FormGroup>
          ) : meta.multi ? (
            <FlatCheckboxMultiList
              options={field.options}
              values={Array.isArray(value) ? value : []}
              onChange={(next) => onChange(next)}
              groupLabel={field.label}
            />
          ) : (
            <FlatRadioList
              name={field.key}
              emptyLabel={field.emptyLabel}
              options={field.options}
              value={typeof value === 'string' ? value : ''}
              onChange={(next) => onChange(next)}
              groupLabel={field.label}
            />
          )}
        </div>
      ) : null}
    </section>
  )
}

FilterCategorySection.displayName = 'FilterCategorySection'
