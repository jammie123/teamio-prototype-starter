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

/**
 * Outline icons that fill the whole 24px box and look bigger than the lighter custom icons next to
 * them; they are drawn slightly smaller so every tab icon has a similar optical size.
 */
const OPTICALLY_LARGE_ICONS = new Set(['ban', 'circle-check', 'message-square'])

/**
 * Only these tabs can show the pink "new" pill, like the Job Card stats strip: new candidates on
 * "Neposouzení" and newly opalcovaní on "Opalcovaný". Values for other tabs are ignored.
 */
const NEW_PILL_LABELS: Partial<Record<string, (count: string) => string>> = {
  unassessed: CANDIDATE_COPY.pipeline.newCandidatesBadgeLabel,
  opalcovani: CANDIDATE_COPY.pipeline.newOpalcovaniBadgeLabel,
}

/** Stroke weight of the outline icons, closer to the thin lines of the custom icons. */
const ICON_STROKE_WIDTH = 1.75

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
 * `newCounts` adds a pink pill next to the count, but only on the "Neposouzení" (`unassessed`) and
 * "Opalcovaný" (`opalcovani`) tabs.
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
        <TabsList aria-label={ariaLabel} className="!tm-gap-0 !tm-mx-0 !tm-items-stretch">
          {statusOptions.map((option) => {
            const newCount = newCounts?.[option.id]
            const newBadgeLabel = NEW_PILL_LABELS[option.id]
            const hasNew = newBadgeLabel !== undefined && typeof newCount === 'number' && newCount > 0
            const testId = `jobs-pipeline-status-${option.id}`

            return (
              <TabsTrigger
                key={option.id}
                value={option.id}
                data-testid={testId}
                // There is no tab panel; the tabs filter a table elsewhere on the page.
                aria-controls={undefined}
                // Horizontal padding is at least the icon width (1em of tm-text-2xl = 1.5rem).
                className={cn(
                  '!tm-items-start !tm-gap-1 !tm-px-8 !tm-py-5 tm-flex-col',
                  '!tm-bg-cover-light data-[state=active]:!tm-bg-basic',
                  // Active indicator: across the whole cell, on top instead of the tab underline.
                  ACTIVE_INDICATOR_CLASS,
                )}
              >
                {/* min-h keeps the count row as tall as the icon row, so tabs without an icon line up. */}
                <span className="tm-inline-flex tm-min-h-6 tm-items-center tm-gap-2">
                  {option.icon ? (
                    <Icon
                      name={option.icon}
                      data-testid={`${testId}-icon`}
                      strokeWidth={ICON_STROKE_WIDTH}
                        className={cn(
                          'tm-text-2xl',
                          ICON_COLOR_CLASS[option.iconColor ?? 'neutral'],
                          OPTICALLY_LARGE_ICONS.has(option.icon) && 'tm-scale-90',
                        )}
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
                      aria-label={newBadgeLabel(formatCount(newCount))}
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
