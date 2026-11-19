import { TableHead, TableHeader, TableRow } from '../Table'
import { EVALUATION_CRITERIA_COPY } from '../EvaluationCriteriaModal/EvaluationCriteriaModal'
import { COLUMN_ACTIONS, COLUMN_NAME, COLUMN_PRIORITY, HEADER_Y } from './copy'

/** Header row of the criteria table: name / priority / (visually hidden) actions. */
export function CriteriaTableHead() {
  return (
    <TableHead>
      <TableRow>
        <TableHeader className={`${COLUMN_NAME} ${HEADER_Y}`}>
          {EVALUATION_CRITERIA_COPY.columnName}
        </TableHeader>
        <TableHeader className={`${COLUMN_PRIORITY} ${HEADER_Y}`}>
          {EVALUATION_CRITERIA_COPY.columnPriority}
        </TableHeader>
        <TableHeader className={`${COLUMN_ACTIONS} ${HEADER_Y}`}>
          <span className="tm-sr-only">{EVALUATION_CRITERIA_COPY.columnActions}</span>
        </TableHeader>
      </TableRow>
    </TableHead>
  )
}

CriteriaTableHead.displayName = 'CriteriaTableHead'
