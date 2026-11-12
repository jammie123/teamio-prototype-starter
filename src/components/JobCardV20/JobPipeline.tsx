import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'
import { formatCount } from './lib/format'
import type { JobCandidateStat, JobCardCandidates } from './types'

export interface JobPipelineProps extends StyleProps {
  candidates: JobCardCandidates
  onStatClick?: (stat: JobCandidateStat) => void
}

const STAT_LABELS: Record<JobCandidateStat, string> = {
  unassessed: 'Neposouzený',
  inProgress: 'Ve hře',
  total: 'Celkem',
}

const STAT_ORDER: JobCandidateStat[] = ['unassessed', 'inProgress', 'total']

function PipelineBadge({
  children,
  testId,
  ariaLabel,
}: {
  children: string
  testId: string
  ariaLabel: string
}) {
  return (
    <span
      data-testid={testId}
      aria-label={ariaLabel}
      className="tm-inline-flex tm-items-center tm-rounded-full tm-bg-teamio-pink tm-px-1.5 tm-py-0.5 tm-text-xs tm-font-semibold tm-leading-tight tm-text-primary-inverted-default"
    >
      {children}
    </span>
  )
}

function highlightCount(value: number | undefined) {
  return typeof value === 'number' && value > 0 ? value : undefined
}

/** Neposouzený / Ve hře / Celkem with optional "nový" and "opalcovaný" badges. */
export function JobPipeline({ candidates, onStatClick, className }: JobPipelineProps) {
  const items = STAT_ORDER.filter((key) => candidates[key] !== undefined)

  if (items.length === 0) {
    return null
  }

  return (
    <div
      data-testid="job-card-stats"
      className={cn('tm-flex', 'tm-shrink-0', 'tm-items-stretch', 'tm-gap-0', className)}
    >
      {items.map((key) => {
        const count = candidates[key] as number
        const label = STAT_LABELS[key]
        const newCount = key === 'unassessed' ? highlightCount(candidates.new) : undefined
        const newOpalcovaniCount =
          key === 'inProgress' ? highlightCount(candidates.newOpalcovani) : undefined
        const layout = cn(
          'tm-flex',
          key === 'total' ? 'tm-w-[120px]' : 'tm-w-[150px]',
          'tm-min-w-0',
          'tm-shrink-0',
          'tm-flex-col',
          'tm-items-start',
          'tm-justify-center',
          'tm-gap-0.5',
          key === 'total' ? 'tm-pl-4' : 'tm-p-0',
          'tm-text-left',
          key === 'total' && 'tm-border-0 tm-border-l tm-border-solid tm-border-secondary',
        )

        const content = (
          <>
            <span className="tm-inline-flex tm-flex-row tm-flex-wrap tm-items-center tm-gap-2">
              <span
                className={cn(
                  'tm-text-xl',
                  'tm-font-normal',
                  'tm-leading-tight',
                  'tm-text-primary-default',
                  onStatClick && 'group-hover:tm-text-action-link-active',
                )}
              >
                {formatCount(count)}
              </span>
              {newCount != null ? (
                <PipelineBadge
                  testId="job-card-new-candidates"
                  ariaLabel={`Noví kandidáti: ${formatCount(newCount)}`}
                >
                  {`${formatCount(newCount)} nový`}
                </PipelineBadge>
              ) : null}
              {newOpalcovaniCount != null ? (
                <PipelineBadge
                  testId="job-card-new-opalcovani"
                  ariaLabel={`Nově opalcovaní: ${formatCount(newOpalcovaniCount)}`}
                >
                  {`${formatCount(newOpalcovaniCount)} opalcovaný`}
                </PipelineBadge>
              ) : null}
            </span>
            <span
              className={cn(
                'tm-text-sm',
                'tm-font-normal',
                'tm-text-secondary-default',
                onStatClick && 'group-hover:tm-text-action-link-active',
              )}
            >
              {label}
            </span>
          </>
        )

        if (!onStatClick) {
          return (
            <div key={key} className={layout} data-testid={`job-card-stat-${key}`}>
              {content}
            </div>
          )
        }

        const highlightLabel =
          newCount != null
            ? `, Noví kandidáti: ${formatCount(newCount)}`
            : newOpalcovaniCount != null
              ? `, Nově opalcovaní: ${formatCount(newOpalcovaniCount)}`
              : ''

        return (
          <button
            key={key}
            type="button"
            data-testid={`job-card-stat-${key}`}
            aria-label={`${label}: ${formatCount(count)}${highlightLabel}`}
            onClick={() => onStatClick(key)}
            className={cn(
              layout,
              'tm-group',
              'tm-border-0',
              'tm-bg-transparent',
              'tm-font-inherit',
              'tm-cursor-pointer',
              'tm-rounded-none',
              'tm-transition-colors',
              'hover:tm-bg-interactive-hover',
              'active:tm-bg-interactive-active',
              'focus-visible:tm-outline-0',
              'focus-visible:tm-ring',
            )}
          >
            {content}
          </button>
        )
      })}
    </div>
  )
}

JobPipeline.displayName = 'JobPipeline'
