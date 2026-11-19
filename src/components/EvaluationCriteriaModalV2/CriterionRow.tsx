import { Button } from '../Button'
import { Icon } from '../Icon'
import { TableCell, TableRow } from '../Table'
import { EVALUATION_CRITERIA_COPY } from '../EvaluationCriteriaModal/EvaluationCriteriaModal'
import { EvaluationCriterionPriorityToggle } from '../EvaluationCriteriaModal/EvaluationCriterionPriorityToggle'
import type {
  EvaluationCriterion,
  EvaluationCriterionPriority,
} from '../EvaluationCriteriaModal/types'
import { BODY_Y, COLUMN_ACTIONS, COLUMN_NAME, COLUMN_PRIORITY } from './copy'

export interface CriterionRowProps {
  criterion: EvaluationCriterion
  /** Disables the pencil while another row is being edited. */
  isEditDisabled?: boolean
  onPriorityChange?: (priority: EvaluationCriterionPriority) => void
  onEdit?: () => void
  onDelete?: () => void
}

/** Read mode of one criterion: text, priority toggle and the edit / delete icon buttons. */
export function CriterionRow({
  criterion,
  isEditDisabled = false,
  onPriorityChange,
  onEdit,
  onDelete,
}: CriterionRowProps) {
  return (
    <TableRow data-testid="evaluation-criterion-row">
      <TableCell className={`${COLUMN_NAME} ${BODY_Y}`}>{criterion.text}</TableCell>
      <TableCell className={`${COLUMN_PRIORITY} ${BODY_Y}`}>
        <EvaluationCriterionPriorityToggle
          size="medium"
          value={criterion.priority}
          onChange={(priority) => onPriorityChange?.(priority)}
        />
      </TableCell>
      <TableCell className={`${COLUMN_ACTIONS} ${BODY_Y}`}>
        <div className="tm-flex tm-items-center tm-justify-end tm-gap-2">
          <Button
            variant="tertiary"
            size="medium"
            isCircle
            aria-label={EVALUATION_CRITERIA_COPY.editLabel}
            isDisabled={isEditDisabled}
            onClick={onEdit}
          >
            <Icon name="edit" />
          </Button>
          <Button
            variant="tertiary"
            size="medium"
            isCircle
            aria-label={EVALUATION_CRITERIA_COPY.deleteLabel}
            onClick={onDelete}
          >
            <Icon name="trash" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  )
}

CriterionRow.displayName = 'CriterionRow'
