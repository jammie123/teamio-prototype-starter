import { useState } from 'react'
import { Button } from '../Button'
import {
  Modal,
  ModalBody,
  ModalClose,
  ModalContent,
  ModalFooter,
  ModalTitle,
} from '../Modal'
import { CANDIDATE_COPY } from '../Candidate/candidateCopy'
import {
  CANDIDATE_FILTER_MODAL_FIELDS,
  CANDIDATE_FILTER_V2_FIELD_META,
  EMPTY_CANDIDATE_FILTER_V2_VALUE,
} from '../Candidate/filterModalOptions'
import type {
  CandidateFilterModalFieldKey,
  CandidateFilterV2Value,
  FilterModalV2Props,
} from '../Candidate/filterModalTypes'
import { FilterCategorySection } from './FilterCategorySection'

export type { FilterModalV2Props, CandidateFilterV2Value } from '../Candidate/filterModalTypes'
export {
  EMPTY_CANDIDATE_FILTER_V2_VALUE,
  countActiveCandidateFiltersV2,
  CANDIDATE_FILTER_MODAL_FIELDS,
  CANDIDATE_FILTER_V2_FIELD_META,
} from '../Candidate/filterModalOptions'

function initialExpandedState(): Record<CandidateFilterModalFieldKey, boolean> {
  return CANDIDATE_FILTER_MODAL_FIELDS.reduce(
    (acc, field) => {
      acc[field.key] = true
      return acc
    },
    {} as Record<CandidateFilterModalFieldKey, boolean>,
  )
}

interface FilterModalV2FormProps {
  value: CandidateFilterV2Value
  onApply: (value: CandidateFilterV2Value) => void
  onOpenChange: (open: boolean) => void
}

function FilterModalV2Form({ value, onApply, onOpenChange }: FilterModalV2FormProps) {
  const copy = CANDIDATE_COPY.filterModal
  const [draft, setDraft] = useState<CandidateFilterV2Value>(() => ({ ...value, candidateTag: [...value.candidateTag] }))
  const [expanded, setExpanded] = useState(initialExpandedState)

  const patchString = (key: Exclude<CandidateFilterModalFieldKey, 'candidateTag'>, next: string) => {
    setDraft((current) => ({ ...current, [key]: next }))
  }

  return (
    <>
      <ModalBody
        className="tm-flex tm-flex-col tm-pb-6"
        data-testid="candidate-filter-modal-v2-body"
      >
        {CANDIDATE_FILTER_MODAL_FIELDS.map((field) => {
          const isTags = field.key === 'candidateTag'
          return (
            <FilterCategorySection
              key={field.key}
              field={field}
              meta={CANDIDATE_FILTER_V2_FIELD_META[field.key]}
              expanded={expanded[field.key]}
              onToggleExpanded={() =>
                setExpanded((current) => ({ ...current, [field.key]: !current[field.key] }))
              }
              value={isTags ? draft.candidateTag : draft[field.key]}
              onChange={(next) => {
                const key = field.key
                if (key === 'candidateTag') {
                  setDraft((current) => ({
                    ...current,
                    candidateTag: Array.isArray(next) ? next : [],
                  }))
                  return
                }

                patchString(key, typeof next === 'string' ? next : '')
              }}
            />
          )
        })}
      </ModalBody>
      <ModalFooter className="tm-border-0 tm-border-t tm-border-solid tm-border-secondary">
        <Button
          data-testid="candidate-filter-v2-apply"
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
          data-testid="candidate-filter-v2-reset"
          className="sm:tm-ml-auto"
          onClick={() => setDraft({ ...EMPTY_CANDIDATE_FILTER_V2_VALUE, candidateTag: [] })}
        >
          {copy.reset}
        </Button>
      </ModalFooter>
    </>
  )
}

export function FilterModalV2({ open, onOpenChange, value, onApply }: FilterModalV2Props) {
  const copy = CANDIDATE_COPY.filterModal

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent
        data-testid="candidate-filter-modal-v2"
        className="tm-max-w-[560px]"
        onOpenAutoFocus={(event) => event.preventDefault()}
      >
        <ModalTitle>{copy.title}</ModalTitle>
        <ModalClose aria-label={copy.close} />
        {open ? (
          <FilterModalV2Form value={value} onApply={onApply} onOpenChange={onOpenChange} />
        ) : null}
      </ModalContent>
    </Modal>
  )
}

FilterModalV2.displayName = 'FilterModalV2'
