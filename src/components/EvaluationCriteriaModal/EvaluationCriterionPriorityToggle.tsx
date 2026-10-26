import type { MouseEvent } from 'react'
import { cn } from '../../lib/cn'
import type { ButtonSize } from '../../lib/types'
import { Button } from '../Button'
import { EVALUATION_PRIORITY_LABELS, EVALUATION_PRIORITY_ORDER } from './priorityLabels'
import type { EvaluationCriterionPriority } from './types'

export interface EvaluationCriterionPriorityToggleProps {
  value: EvaluationCriterionPriority
  onChange: (value: EvaluationCriterionPriority) => void
  size?: ButtonSize
  'aria-label'?: string
  className?: string
}

/** Two secondary buttons ("Vysoká" / "Nižší"); the selected one shows the secondary active state. */
export function EvaluationCriterionPriorityToggle({
  value,
  onChange,
  size = 'small',
  'aria-label': ariaLabel = 'Priorita',
  className,
}: EvaluationCriterionPriorityToggleProps) {
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className={cn('tm-inline-flex', 'tm-items-center', 'tm-gap-2', className)}
      // The group lives inside a clickable row - don't open the detail.
      onClick={(event: MouseEvent<HTMLDivElement>) => event.stopPropagation()}
    >
      {EVALUATION_PRIORITY_ORDER.map((priority) => {
        const isActive = value === priority
        return (
          <Button
            key={priority}
            variant="secondary"
            size={size}
            aria-pressed={isActive}
            onClick={() => onChange(priority)}
            className={cn(
              'tm-whitespace-nowrap',
              isActive && '!tm-bg-interactive-active !tm-border-action-secondary-active',
            )}
          >
            {EVALUATION_PRIORITY_LABELS[priority]}
          </Button>
        )
      })}
    </div>
  )
}

EvaluationCriterionPriorityToggle.displayName = 'EvaluationCriterionPriorityToggle'
