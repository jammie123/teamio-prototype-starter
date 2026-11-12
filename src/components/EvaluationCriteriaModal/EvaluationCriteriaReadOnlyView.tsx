import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'
import { formatCriteriaCount } from './formatCriteriaCount'
import { EVALUATION_PRIORITY_ORDER } from './priorityLabels'
import type { EvaluationCriterion, EvaluationCriterionPriority } from './types'

export const EVALUATION_CRITERIA_READ_ONLY_COPY = {
  groupTitle: {
    high: 'Vysoká priorita',
    low: 'Nižší priorita',
  } satisfies Record<EvaluationCriterionPriority, string>,
} as const

export interface EvaluationCriteriaReadOnlyViewProps extends StyleProps {
  criteria: EvaluationCriterion[]
}

/**
 * Criteria grouped by priority (high first), without priority dots or checkboxes.
 * Empty groups are omitted; the original order is kept inside a group.
 */
export function EvaluationCriteriaReadOnlyView({
  criteria,
  className,
}: EvaluationCriteriaReadOnlyViewProps) {
  const groups = EVALUATION_PRIORITY_ORDER.map((priority) => ({
    priority,
    items: criteria.filter((criterion) => criterion.priority === priority),
  })).filter((group) => group.items.length > 0)

  return (
    <div className={cn('tm-flex', 'tm-w-full', 'tm-flex-col', 'tm-gap-6', className)}>
      {groups.map(({ priority, items }) => {
        const headingId = `evaluation-criteria-group-${priority}`
        return (
          <section
            key={priority}
            aria-labelledby={headingId}
            data-testid="evaluation-criteria-group"
            className="tm-flex tm-flex-col tm-gap-3"
          >
            <div className="tm-flex tm-items-baseline tm-gap-2">
              <h3
                id={headingId}
                className="tm-m-0 tm-text-sm tm-font-semibold tm-text-primary-default"
              >
                {EVALUATION_CRITERIA_READ_ONLY_COPY.groupTitle[priority]}
              </h3>
              <span className="tm-text-sm tm-text-secondary-default">
                {formatCriteriaCount(items.length)}
              </span>
            </div>
            <ul className="tm-m-0 tm-list-none tm-overflow-hidden tm-rounded tm-border tm-border-solid tm-border-secondary tm-p-0">
              {items.map((criterion) => (
                <li
                  key={criterion.id}
                  data-testid="evaluation-criterion-readonly-item"
                  className="tm-border-b tm-border-solid tm-border-secondary tm-px-4 tm-py-4 tm-text-base tm-text-primary-default last:tm-border-b-0"
                >
                  {criterion.text}
                </li>
              ))}
            </ul>
          </section>
        )
      })}
    </div>
  )
}

EvaluationCriteriaReadOnlyView.displayName = 'EvaluationCriteriaReadOnlyView'
