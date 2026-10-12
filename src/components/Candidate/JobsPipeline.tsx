import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'
import { formatCount } from '../JobCardSynteza/formatCount'
import { Pill } from '../Pill'
import {
  CANDIDATE_COPY,
  CANDIDATE_PIPELINE_ALL_STATUS_ID,
  CANDIDATE_PIPELINE_STATUSES,
} from './candidateCopy'
import type { CandidateStatusOption } from './types'

export interface JobsPipelineProps
  extends StyleProps,
    Omit<HTMLAttributes<HTMLDivElement>, 'color' | 'onChange'> {
  /** Candidate counts by status id. Missing ids render as 0. */
  statusCounts: Partial<Record<string, number>>
  /** Count of new candidates by status id, shown as a pink pill next to the count. */
  newCounts?: Partial<Record<string, number>>
  statusOptions?: CandidateStatusOption[]
  /** Selected status id; undefined means no filter ("Celkem"). */
  value: string | undefined
  onChange: (status: string | undefined) => void
}

interface PipelineCellProps {
  testId: string
  label: string
  count: number
  newCount?: number
  selected: boolean
  isFirst: boolean
  onClick: () => void
}

function PipelineCell({
  testId,
  label,
  count,
  newCount,
  selected,
  isFirst,
  onClick,
}: PipelineCellProps) {
  const formatted = formatCount(count)
  const hasNew = typeof newCount === 'number' && newCount > 0
  const newFormatted = hasNew ? formatCount(newCount) : undefined

  return (
    <button
      type="button"
      data-testid={testId}
      aria-pressed={selected}
      aria-label={
        newFormatted
          ? `${label}: ${formatted}, ${CANDIDATE_COPY.pipeline.newBadgeLabel(newFormatted)}`
          : `${label}: ${formatted}`
      }
      onClick={onClick}
      className={cn(
        'tm-group',
        'tm-relative',
        'tm-flex',
        'tm-min-w-[8rem]',
        'tm-flex-1',
        'tm-flex-col',
        'tm-items-start',
        'tm-justify-center',
        'tm-gap-1',
        'tm-px-6',
        'tm-py-3',
        'tm-text-left',
        'tm-border-0',
        'tm-rounded-none',
        'tm-font-inherit',
        'tm-cursor-pointer',
        'tm-transition-colors',
        !isFirst && 'tm-border-l tm-border-solid tm-border-secondary',
        'tm-bg-basic',
        'tm-font-poppins',
        'hover:tm-bg-interactive-hover',
        'active:tm-bg-interactive-active',
        'focus:tm-outline-0',
        'focus-visible:tm-ring',
        // Active state mirrors TabsTrigger: pink underline, here across the whole cell.
        selected && [
          'after:tm-absolute',
          'after:tm-left-0',
          'after:tm-right-0',
          'after:tm-bottom-0',
          'after:tm-h-[3px]',
          'after:tm-bg-teamio-pink',
          "after:tm-content-['']",
          'after:tm-rounded-b-none',
        ],
      )}
    >
      <span className="tm-inline-flex tm-items-center tm-gap-2">
        <span
          className={cn(
            'tm-text-2xl',
            'tm-font-semibold',
            'tm-leading-none',
            'tm-text-primary-default',
          )}
        >
          {formatted}
        </span>
        {newFormatted ? (
          <Pill
            color="pink"
            data-testid={`${testId}-new`}
            aria-hidden
            className="tm-h-5 tm-min-w-5 tm-px-1.5 tm-text-xs tm-font-semibold"
          >
            {newFormatted}
          </Pill>
        ) : null}
      </span>
      <span
        className={cn(
          'tm-text-sm',
          'tm-font-normal',
          'tm-leading-tight',
          'tm-whitespace-nowrap',
          selected
            ? 'tm-text-primary-default'
            : 'tm-text-secondary-default group-hover:tm-text-primary-default',
          'group-active:tm-text-primary-default',
        )}
      >
        {label}
      </span>
    </button>
  )
}

/**
 * Filter bar above the candidate table with the same cells as the Job Card stats strip. It is a
 * single-select filter: clicking the selected cell, or "Celkem", clears it. Controlled via
 * `value` / `onChange`. It fills the width of its container, so it lines up with `CandidateTable`.
 */
export const JobsPipeline = forwardRef<HTMLDivElement, JobsPipelineProps>(function JobsPipeline(
  {
    statusCounts,
    newCounts,
    statusOptions = CANDIDATE_PIPELINE_STATUSES,
    value,
    onChange,
    className,
    'aria-label': ariaLabel = CANDIDATE_COPY.pipeline.label,
    ...rest
  },
  ref,
) {
  return (
    <div
      ref={ref}
      role="group"
      aria-label={ariaLabel}
      data-testid="jobs-pipeline"
      className={cn(
        'tm-flex',
        'tm-w-full',
        'tm-items-stretch',
        'tm-overflow-x-auto',
        'tm-rounded',
        'tm-border',
        'tm-border-solid',
        'tm-border-secondary',
        'tm-bg-basic',
        className,
      )}
      {...rest}
    >
      {statusOptions.map((option, index) => {
        const isAll = option.id === CANDIDATE_PIPELINE_ALL_STATUS_ID

        return (
          <PipelineCell
            key={option.id}
            testId={`jobs-pipeline-status-${option.id}`}
            label={option.label}
            count={statusCounts[option.id] ?? 0}
            newCount={newCounts?.[option.id]}
            selected={isAll ? value === undefined : value === option.id}
            isFirst={index === 0}
            onClick={() => onChange(isAll || value === option.id ? undefined : option.id)}
          />
        )
      })}
    </div>
  )
})

JobsPipeline.displayName = 'JobsPipeline'
