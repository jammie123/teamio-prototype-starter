import { forwardRef } from 'react'
import { cn } from '../../lib/cn'
import { formatCount } from '../JobCardSynteza/formatCount'
import { Icon } from '../Icon'
import { Pill } from '../Pill'
import { Tabs, TabsList, TabsTrigger } from '../Tabs'
import {
  CANDIDATE_COPY,
  CANDIDATE_PIPELINE_ALL_STATUS_ID,
  CANDIDATE_PIPELINE_V2_STATUSES,
} from './candidateCopy'
import type { JobsPipelineProps } from './JobsPipeline'
import type { CandidatePipelineIconColor } from './types'

const ICON_COLOR_CLASS: Record<CandidatePipelineIconColor, string> = {
  neutral: 'tm-text-secondary-default',
  info: 'tm-text-emotion-info-emphasis',
  success: 'tm-text-emotion-success-emphasis',
  danger: 'tm-text-emotion-danger-active',
}

const ACTIVE_INDICATOR_CLASS = [
  'data-[state=active]:after:!tm-top-0',
  'data-[state=active]:after:!tm-bottom-auto',
  'data-[state=active]:after:!tm-left-0',
  'data-[state=active]:after:!tm-right-0',
  'data-[state=active]:after:!tm-h-[3px]',
]

export type JobsPipelineV2Props = Pick<
  JobsPipelineProps,
  'statusCounts' | 'newCounts' | 'statusOptions' | 'value' | 'onChange' | 'className' | 'aria-label'
>

/**
 * Tab navigation variant of `JobsPipeline`: every tab shows its icon and count on one line with the
 * status title underneath. It is built on the `Tabs` primitives so it shares their tokens and active
 * underline, and takes the same data props as `JobsPipeline`. "Celkem" is the tab that is active
 * while no status filter is set. `statusOptions` defaults to `CANDIDATE_PIPELINE_V2_STATUSES`
 * (the hiring stages, then "Zamítnutý" and "Celkem"); an option's `icon` (tinted by `iconColor`) is rendered before its count.
 */
export const JobsPipelineV2 = forwardRef<HTMLDivElement, JobsPipelineV2Props>(
  function JobsPipelineV2(
    {
      statusCounts,
      newCounts,
      statusOptions = CANDIDATE_PIPELINE_V2_STATUSES,
      value,
      onChange,
      className,
      'aria-label': ariaLabel = CANDIDATE_COPY.pipeline.label,
    },
    ref,
  ) {
    return (
      <Tabs
        ref={ref}
        data-testid="jobs-pipeline"
        value={value ?? CANDIDATE_PIPELINE_ALL_STATUS_ID}
        onValueChange={(next) =>
          onChange(next === CANDIDATE_PIPELINE_ALL_STATUS_ID ? undefined : next)
        }
        className={cn('tm-w-full', className)}
      >
        <TabsList aria-label={ariaLabel} className="!tm-gap-0 !tm-mx-0">
          {statusOptions.map((option) => {
            const newCount = newCounts?.[option.id]
            const hasNew = typeof newCount === 'number' && newCount > 0
            const testId = `jobs-pipeline-status-${option.id}`

            return (
              <TabsTrigger
                key={option.id}
                value={option.id}
                data-testid={testId}
                // There is no tab panel; the tabs filter a table elsewhere on the page.
                aria-controls={undefined}
                // Horizontal padding is at least the icon width (1em of tm-text-lg = 1.125rem).
                className={cn(
                  '!tm-items-start !tm-gap-1 !tm-px-8 !tm-py-5 tm-flex-col',
                  '!tm-bg-cover-light data-[state=active]:!tm-bg-basic',
                  // Active indicator: across the whole cell, on top instead of the tab underline.
                  ACTIVE_INDICATOR_CLASS,
                )}
              >
                <span className="tm-inline-flex tm-items-center tm-gap-2">
                  {option.icon ? (
                    <Icon
                      name={option.icon}
                      data-testid={`${testId}-icon`}
                      className={cn('tm-text-lg', ICON_COLOR_CLASS[option.iconColor ?? 'neutral'])}
                    />
                  ) : null}
                  <span
                    data-testid={`${testId}-count`}
                    className="tm-text-lg tm-font-medium tm-leading-none tm-tabular-nums tm-text-primary-default"
                  >
                    {formatCount(statusCounts[option.id] ?? 0)}
                  </span>
                  {hasNew ? (
                    <Pill
                      color="pink"
                      data-testid={`${testId}-new`}
                      aria-label={CANDIDATE_COPY.pipeline.newBadgeLabel(formatCount(newCount))}
                      className="tm-h-5 tm-min-w-5 tm-px-1.5 tm-text-xs tm-font-semibold"
                    >
                      {formatCount(newCount)}
                    </Pill>
                  ) : null}
                </span>
                <span
                  data-testid={`${testId}-label`}
                  className="tm-text-sm tm-font-normal tm-leading-tight tm-whitespace-nowrap"
                >
                  {option.label}
                </span>
              </TabsTrigger>
            )
          })}
        </TabsList>
      </Tabs>
    )
  },
)

JobsPipelineV2.displayName = 'JobsPipelineV2'
