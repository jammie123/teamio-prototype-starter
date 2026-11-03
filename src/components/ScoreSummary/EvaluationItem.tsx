import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'
import { Icon, type IconName } from '../Icon'
import { Typography } from '../Typography'
import { SCORE_SUMMARY_COPY } from './copy'
import type { EvaluationItemStatus } from './types'

export interface EvaluationItemProps
  extends StyleProps, Omit<HTMLAttributes<HTMLDivElement>, 'color'> {
  label: string
  status: EvaluationItemStatus
}

const STATUS_ICON: Record<EvaluationItemStatus, IconName> = {
  met: 'check',
  partial: 'circle-help',
  unmet: 'x',
}

const STATUS_CIRCLE_CLASS: Record<EvaluationItemStatus, string> = {
  met: 'tm-bg-emotion-success-active tm-text-primary-inverted-default',
  partial: 'tm-bg-emotion-warning-hover tm-text-primary-inverted-default',
  unmet: 'tm-bg-emotion-danger-active tm-text-primary-inverted-default',
}

export const EvaluationItem = forwardRef<HTMLDivElement, EvaluationItemProps>(
  function EvaluationItem({ label, status, className, ...rest }, ref) {
    const statusLabel = SCORE_SUMMARY_COPY.criterionStatus[status]

    return (
      <div
        ref={ref}
        role="group"
        data-testid="evaluation-item"
        data-status={status}
        aria-label={`${label} (${statusLabel})`}
        className={cn('tm-flex tm-items-start tm-gap-3', className)}
        {...rest}
      >
        <span
          aria-hidden="true"
          className={cn(
            'tm-mt-0.5 tm-inline-flex tm-size-4 tm-shrink-0 tm-items-center tm-justify-center tm-rounded-full',
            STATUS_CIRCLE_CLASS[status],
          )}
        >
          <Icon name={STATUS_ICON[status]} className="tm-text-[0.625rem]" />
        </span>
        <Typography as="span" className="tm-mb-0">
          {label}
        </Typography>
        <span className="tm-sr-only">{statusLabel}</span>
      </div>
    )
  },
)

EvaluationItem.displayName = 'EvaluationItem'
