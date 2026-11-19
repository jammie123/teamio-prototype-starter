import { Alert } from '../Alert'
import { Button } from '../Button'
import { FormGroup } from '../FormGroup'
import { Icon } from '../Icon'
import { Link } from '../Link'
import { TableCell, TableRow } from '../Table'
import { TextArea } from '../TextArea'
import { EVALUATION_CRITERIA_COPY } from '../EvaluationCriteriaModal/EvaluationCriteriaModal'
import { EVALUATION_CRITERION_DETAIL_COPY } from '../EvaluationCriteriaModal/EvaluationCriterionDetailModal'
import { EvaluationCriterionPriorityToggle } from '../EvaluationCriteriaModal/EvaluationCriterionPriorityToggle'
import { EVALUATION_CRITERIA_HELP_URL } from '../EvaluationCriteriaModal/helpUrl'
import type { EvaluationCriterionPriority } from '../EvaluationCriteriaModal/types'
import { V2_COPY } from './copy'

export interface CriterionEditorRowProps {
  text: string
  priority: EvaluationCriterionPriority
  /** A row that is being added has nothing to delete yet, so the trash button is hidden. */
  isNew?: boolean
  /** Shows the EEO alert and marks the text area invalid. */
  hasEeoError?: boolean
  onTextChange?: (text: string) => void
  onPriorityChange?: (priority: EvaluationCriterionPriority) => void
  onDone?: () => void
  onCancel?: () => void
  onDelete?: () => void
}

/** Edit mode of one criterion: one cell spanning all columns with the text area and its actions. */
export function CriterionEditorRow({
  text,
  priority,
  isNew = false,
  hasEeoError = false,
  onTextChange,
  onPriorityChange,
  onDone,
  onCancel,
  onDelete,
}: CriterionEditorRowProps) {
  return (
    <TableRow
      data-testid="evaluation-criterion-row"
      data-editing="true"
      className="tm-bg-cover-light"
    >
      <TableCell colSpan={3} className="!tm-px-4 !tm-py-5">
        <div className="tm-flex tm-w-full tm-flex-col tm-gap-3">
          <span className="tm-text-sm tm-font-medium tm-text-primary-default">
            {V2_COPY.editingLabel}
          </span>
          <FormGroup validationState={hasEeoError ? 'error' : 'default'}>
            <TextArea
              aria-label={EVALUATION_CRITERION_DETAIL_COPY.textLabel}
              className="tm-w-full"
              rows={3}
              value={text}
              autoFocus
              onChange={(event) => onTextChange?.(event.target.value)}
            />
          </FormGroup>
          {hasEeoError ? (
            <Alert variant="error">
              {EVALUATION_CRITERION_DETAIL_COPY.eeoError}{' '}
              <Link href={EVALUATION_CRITERIA_HELP_URL} target="_blank">
                {EVALUATION_CRITERION_DETAIL_COPY.eeoHelp}
              </Link>
            </Alert>
          ) : null}
          <div className="tm-flex tm-w-full tm-items-center tm-gap-2">
            <Button variant="secondary" isDisabled={text.trim() === ''} onClick={onDone}>
              {V2_COPY.done}
            </Button>
            <Button variant="tertiary" onClick={onCancel}>
              {EVALUATION_CRITERIA_COPY.cancel}
            </Button>
            <div className="tm-ml-auto tm-flex tm-items-center tm-gap-2">
              <EvaluationCriterionPriorityToggle
                size="medium"
                value={priority}
                onChange={(next) => onPriorityChange?.(next)}
              />
              {isNew ? null : (
                <Button
                  variant="tertiary"
                  size="medium"
                  isCircle
                  aria-label={EVALUATION_CRITERIA_COPY.deleteLabel}
                  onClick={onDelete}
                >
                  <Icon name="trash" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </TableCell>
    </TableRow>
  )
}

CriterionEditorRow.displayName = 'CriterionEditorRow'
