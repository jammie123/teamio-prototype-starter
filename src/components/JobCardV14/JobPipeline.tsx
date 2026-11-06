import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'
import { Tag } from '../Tag'
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

const BADGE_CLASS =
  '!tm-min-h-0 !tm-h-auto !tm-gap-0 !tm-py-0.5 !tm-px-1.5 !tm-text-[10px] !tm-font-semibold !tm-leading-tight !tm-rounded-full !tm-text-primary-inverted-default !tm-bg-teamio-pink'

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
    <Tag color="neutral" className={BADGE_CLASS} data-testid={testId} aria-label={ariaLabel}>
      {children}
    </Tag>
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
      {items.map((key, index) => {
        const count = candidates[key] as number
        const label = STAT_LABELS[key]
        const isFirst = index === 0
        const newCount = key === 'unassessed' ? highlightCount(candidates.new) : undefined
        const newOpalcovaniCount =
          key === 'inProgress' ? highlightCount(candidates.newOpalcovani) : undefined
        const layout = cn(
          'tm-flex',
          'tm-w-[120px]',
          'tm-min-w-0',
          'tm-shrink-0',
          'tm-flex-col',
          'tm-items-end',
          'tm-justify-center',
          'tm-gap-0.5',
          'tm-px-4',
          'tm-py-2',
          'tm-text-left',
          index > 0 && 'tm-border-0 tm-border-l tm-border-solid tm-border-secondary',
        )

        const content = (
          <>
            <span className="tm-inline-flex tm-flex-col-reverse tm-flex-wrap tm-items-center tm-gap-2">
              <span
                className={cn(
                  isFirst ? 'tm-text-2xl' : 'tm-text-xl',
                  'tm-font-normal',
                  'tm-leading-tight',
                  'tm-text-primary-default',
                  onStatClick && 'tm-group-hover:tm-text-action-link-active',
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
                onStatClick && 'tm-group-hover:tm-text-action-link-active',
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
