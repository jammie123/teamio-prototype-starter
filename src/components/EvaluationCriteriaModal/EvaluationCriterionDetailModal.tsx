import { useState } from 'react'
import { Alert } from '../Alert'
import { Button } from '../Button'
import { FormGroup } from '../FormGroup'
import { FormLabel } from '../FormLabel'
import { Icon } from '../Icon'
import { Link } from '../Link'
import {
  Modal,
  ModalBody,
  ModalClose,
  ModalContent,
  ModalFooter,
  ModalTitle,
  type ModalProps,
} from '../Modal'
import { TextArea } from '../TextArea'
import { EvaluationCriterionPriorityToggle } from './EvaluationCriterionPriorityToggle'
import { findEeoViolation } from './evaluationCriteriaRules'
import { EVALUATION_CRITERIA_HELP_URL } from './helpUrl'
import type { EvaluationCriterion } from './types'

export const EVALUATION_CRITERION_DETAIL_COPY = {
  title: 'Detail kritéria',
  titleNew: 'Nové kritérium',
  textLabel: 'Kritérium',
  priorityLabel: 'Priorita',
  save: 'Uložit',
  cancel: 'Zrušit',
  delete: 'Smazat',
  close: 'Zavřít detail kritéria',
  eeoError:
    'Toto kritérium nelze uložit, protože by mohlo vést k nerovnému zacházení s kandidáty. Hodnoťte schopnosti a zkušenosti, ne osobní vlastnosti.',
  eeoHelp: 'Zjistit víc',
} as const

export interface EvaluationCriterionDetailModalProps {
  criterion: EvaluationCriterion
  /** A criterion that is being added (not in the list yet). */
  isNew?: boolean
  open: ModalProps['open']
  onOpenChange: NonNullable<ModalProps['onOpenChange']>
  onSave: (criterion: EvaluationCriterion) => void
  /** Shows the "Smazat" action; omitted for a criterion that is being added. */
  onDelete?: (criterion: EvaluationCriterion) => void
}

interface DetailFormProps extends Pick<EvaluationCriterionDetailModalProps, 'criterion' | 'onSave' | 'onDelete'> {
  onClose: () => void
}

function DetailForm({ criterion, onSave, onDelete, onClose }: DetailFormProps) {
  const [text, setText] = useState(criterion.text)
  const [priority, setPriority] = useState(criterion.priority)
  const [hasEeoError, setHasEeoError] = useState(false)

  const handleSave = () => {
    if (findEeoViolation(text) !== null) {
      setHasEeoError(true)
      return
    }
    onSave({ ...criterion, text, priority })
    onClose()
  }

  return (
    <>
      <ModalBody className="tm-flex tm-flex-col tm-gap-4 tm-py-2">
        <FormGroup validationState={hasEeoError ? 'error' : 'default'}>
          <FormLabel>{EVALUATION_CRITERION_DETAIL_COPY.textLabel}</FormLabel>
          <TextArea
            rows={5}
            value={text}
            onChange={(event) => {
              setText(event.target.value)
              setHasEeoError(false)
            }}
          />
        </FormGroup>
        <div className="tm-flex tm-flex-col tm-items-start tm-gap-1">
          <span className="tm-text-sm tm-font-medium">
            {EVALUATION_CRITERION_DETAIL_COPY.priorityLabel}
          </span>
          <EvaluationCriterionPriorityToggle
            size="medium"
            value={priority}
            onChange={setPriority}
          />
        </div>
        {hasEeoError ? (
          <Alert variant="error">
            {EVALUATION_CRITERION_DETAIL_COPY.eeoError}{' '}
            <Link href={EVALUATION_CRITERIA_HELP_URL} target="_blank">
              {EVALUATION_CRITERION_DETAIL_COPY.eeoHelp}
            </Link>
          </Alert>
        ) : null}
      </ModalBody>
      <ModalFooter className="tm-shrink-0 tm-bg-basic">
        <Button isDisabled={text.trim() === ''} onClick={handleSave}>{EVALUATION_CRITERION_DETAIL_COPY.save}</Button>
        <ModalClose asChild aria-label={EVALUATION_CRITERION_DETAIL_COPY.cancel}>
          <Button variant="secondary">{EVALUATION_CRITERION_DETAIL_COPY.cancel}</Button>
        </ModalClose>
        {onDelete ? (
          <Button
            variant="tertiary"
            className="sm:tm-ml-auto"
            onClick={() => {
              onDelete(criterion)
              onClose()
            }}
          >
            <Icon name="trash" />
            {EVALUATION_CRITERION_DETAIL_COPY.delete}
          </Button>
        ) : null}
      </ModalFooter>
    </>
  )
}

/** Second dialog stacked above the criteria list. Closing without saving discards edits. */
export function EvaluationCriterionDetailModal({
  criterion,
  isNew = false,
  open,
  onOpenChange,
  onSave,
  onDelete,
}: EvaluationCriterionDetailModalProps) {
  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent
        size="default"
        className="tm-z-[60]"
        overlayClassName="tm-z-[55]"
        aria-describedby={undefined}
      >
        <ModalTitle>
          {isNew ? EVALUATION_CRITERION_DETAIL_COPY.titleNew : EVALUATION_CRITERION_DETAIL_COPY.title}
        </ModalTitle>
        <ModalClose aria-label={EVALUATION_CRITERION_DETAIL_COPY.close} />
        {/* key resets local form state for every criterion that is opened */}
        <DetailForm
          key={criterion.id}
          criterion={criterion}
          onSave={onSave}
          onDelete={isNew ? undefined : onDelete}
          onClose={() => onOpenChange(false)}
        />
      </ModalContent>
    </Modal>
  )
}

EvaluationCriterionDetailModal.displayName = 'EvaluationCriterionDetailModal'
