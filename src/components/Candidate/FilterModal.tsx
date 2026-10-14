import { useRef, useState, type RefObject } from 'react'
import { cn } from '../../lib/cn'
import { validationBorderClass } from '../../lib/validation'
import { Button } from '../Button'
import { Dropdown, DropdownBody, DropdownToggle } from '../Dropdown'
import { Icon } from '../Icon'
import { Option, OptionList } from '../OptionList'
import {
  Modal,
  ModalBody,
  ModalClose,
  ModalContent,
  ModalFooter,
  ModalTitle,
} from '../Modal'
import { CANDIDATE_COPY } from './candidateCopy'
import {
  CANDIDATE_FILTER_MODAL_FIELDS,
  EMPTY_CANDIDATE_FILTER_VALUE,
  findFilterModalOptionLabel,
} from './filterModalOptions'
import type {
  CandidateFilterModalFieldKey,
  CandidateFilterModalOption,
  CandidateFilterModalValue,
  FilterModalProps,
} from './filterModalTypes'

export type { FilterModalProps, CandidateFilterModalValue } from './filterModalTypes'
export {
  EMPTY_CANDIDATE_FILTER_VALUE,
  countActiveCandidateFilters,
  CANDIDATE_FILTER_MODAL_FIELDS,
} from './filterModalOptions'

function depthPaddingClass(depth: number | undefined) {
  if (depth === 1) return 'tm-pl-4'
  if (depth === 2) return 'tm-pl-8'
  return undefined
}

function FilterFieldLabel({ children }: { children: string }) {
  return <span className="tm-text-sm tm-font-medium">{children}</span>
}

function OptionLabel({ option }: { option: CandidateFilterModalOption }) {
  if (!option.icon) {
    return option.label
  }

  return (
    <span className="tm-flex tm-min-w-0 tm-items-center tm-gap-2">
      <Icon name={option.icon} className="tm-shrink-0 tm-text-base" aria-hidden />
      <span className="tm-truncate">{option.label}</span>
    </span>
  )
}

function FilterDropdown({
  label,
  emptyLabel,
  value,
  options,
  onChange,
  portalContainerRef,
}: {
  label: string
  emptyLabel: string
  value: string
  options: CandidateFilterModalOption[]
  onChange: (next: string) => void
  portalContainerRef: RefObject<HTMLElement | null>
}) {
  const selectedLabel = value ? findFilterModalOptionLabel(options, value) : undefined
  const selectedOption = options.find((option) => option.value === value)

  return (
    <Dropdown strategy="fixed" className="tm-block tm-w-full tm-min-w-0">
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
          selectedLabel ? 'tm-text-primary-default' : 'tm-text-secondary-default',
        )}
      >
        <span className="tm-min-w-0 tm-truncate">
          {selectedLabel ? (
            selectedOption ? (
              <OptionLabel option={selectedOption} />
            ) : (
              selectedLabel
            )
          ) : (
            emptyLabel
          )}
        </span>
      </DropdownToggle>
      <DropdownBody
        portalContainerRef={portalContainerRef}
        overflow="scrollY"
        className="tm-w-full tm-min-w-full tm-max-w-none"
      >
        <OptionList aria-label={label}>
          <Option isSelected={!value} onClick={() => onChange('')}>
            {emptyLabel}
          </Option>
          {options.map((option) => (
            <Option
              key={option.value}
              isSelected={option.value === value}
              className={depthPaddingClass(option.depth)}
              onClick={() => onChange(option.value)}
            >
              <OptionLabel option={option} />
            </Option>
          ))}
        </OptionList>
      </DropdownBody>
    </Dropdown>
  )
}

interface FilterModalFormProps {
  value: CandidateFilterModalValue
  onApply: (value: CandidateFilterModalValue) => void
  onOpenChange: (open: boolean) => void
  portalContainerRef: RefObject<HTMLElement | null>
}

function FilterModalForm({ value, onApply, onOpenChange, portalContainerRef }: FilterModalFormProps) {
  const copy = CANDIDATE_COPY.filterModal
  const [draft, setDraft] = useState<CandidateFilterModalValue>(() => ({ ...value }))

  const patch = <K extends CandidateFilterModalFieldKey>(key: K, nextValue: string) => {
    setDraft((current) => ({ ...current, [key]: nextValue }))
  }

  return (
    <>
      <ModalBody
        className="!tm-overflow-visible tm-grid tm-grid-cols-[auto_minmax(0,1fr)] tm-items-center tm-gap-x-8 tm-gap-y-4 tm-pb-6"
        data-testid="candidate-filter-modal-body"
      >
        {CANDIDATE_FILTER_MODAL_FIELDS.map((field) => (
          <div key={field.key} className="tm-contents">
            <FilterFieldLabel>{field.label}</FilterFieldLabel>
            <FilterDropdown
              label={field.label}
              emptyLabel={field.emptyLabel}
              value={draft[field.key]}
              options={field.options}
              onChange={(next) => patch(field.key, next)}
              portalContainerRef={portalContainerRef}
            />
          </div>
        ))}
      </ModalBody>
      <ModalFooter className="tm-border-0 tm-border-t tm-border-solid tm-border-secondary">
        <Button
          data-testid="candidate-filter-apply"
          onClick={() => {
            onApply(draft)
            onOpenChange(false)
          }}
        >
          {copy.apply}
        </Button>
        <ModalClose asChild aria-label={copy.cancel}>
          <Button variant="secondary">{copy.cancel}</Button>
        </ModalClose>
        <Button
          variant="tertiary"
          data-testid="candidate-filter-reset"
          className="sm:tm-ml-auto"
          onClick={() => setDraft({ ...EMPTY_CANDIDATE_FILTER_VALUE })}
        >
          {copy.reset}
        </Button>
      </ModalFooter>
    </>
  )
}

export function FilterModal({ open, onOpenChange, value, onApply }: FilterModalProps) {
  const copy = CANDIDATE_COPY.filterModal
  const contentRef = useRef<HTMLDivElement>(null)

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent
        ref={contentRef}
        data-testid="candidate-filter-modal"
        className="!tm-overflow-visible tm-max-w-[480px]"
        onOpenAutoFocus={(event) => event.preventDefault()}
      >
        <ModalTitle>{copy.title}</ModalTitle>
        <ModalClose aria-label={copy.close} />
        {open ? (
          <FilterModalForm
            value={value}
            onApply={onApply}
            onOpenChange={onOpenChange}
            portalContainerRef={contentRef}
          />
        ) : null}
      </ModalContent>
    </Modal>
  )
}

FilterModal.displayName = 'FilterModal'
