import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'
import { Pill } from '../Pill'
import { formatCount } from './formatCount'
import type { JobCandidateStat, JobCardCandidates } from './types'

export interface JobCardStatsProps extends StyleProps {
  candidates: JobCardCandidates
  onStatClick?: (stat: JobCandidateStat) => void
}

const STAT_LABELS: Record<JobCandidateStat, string> = {
  unassessed: 'Neposouzení',
  inProgress: 'Ve hře',
  total: 'Celkem',
}

const STAT_ORDER: JobCandidateStat[] = ['unassessed', 'inProgress', 'total']

export function JobCardStats({ candidates, onStatClick, className }: JobCardStatsProps) {
  const items = STAT_ORDER.filter((key) => candidates[key] !== undefined)

  if (items.length === 0) {
    return null
  }

  return (
    <div
      data-testid="job-card-stats"
      className={cn(
        'tm-flex',
        'tm-flex-wrap',
        'tm-overflow-hidden',
        'tm-rounded',
        'tm-bg-cover-light',
        className,
      )}
    >
      {items.map((key, index) => {
        const count = candidates[key] as number
        const label = STAT_LABELS[key]
        const newCount =
          key === 'unassessed' && typeof candidates.new === 'number' && candidates.new > 0
            ? candidates.new
            : undefined
        const layout = cn(
          'tm-flex',
          'tm-min-w-[7rem]',
          'tm-flex-1',
          'tm-flex-col',
          'tm-items-center',
          'tm-justify-center',
          'tm-gap-0.5',
          'tm-px-4',
          'tm-py-3',
          'tm-text-center',
          index > 0 && 'tm-border-0 tm-border-l tm-border-solid tm-border-secondary',
        )

        const content = (
          <>
            <span
              className={cn(
                'tm-relative',
                onStatClick && 'tm-group-hover:tm-text-action-link-active',
              )}
            >
              <span
                className={cn(
                  'tm-text-2xl',
                  'tm-font-semibold',
                  'tm-leading-tight',
                  'tm-text-primary-default',
                  onStatClick && 'tm-group-hover:tm-text-action-link-active',
                )}
              >
                {formatCount(count)}
              </span>
              {newCount != null ? (
                <Pill
                  color="pink"
                  data-testid="job-card-new-candidates"
                  aria-label={`Noví kandidáti: ${formatCount(newCount)}`}
                  className="tm-absolute tm-left-full tm-top-1/2 tm-ml-2 tm--translate-y-1/2 tm-whitespace-nowrap"
                >
                  {formatCount(newCount)} nových
                </Pill>
              ) : null}
            </span>
            <span
              className={cn(
                'tm-text-sm',
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
            <div key={key} className={layout}>
              {content}
            </div>
          )
        }

        return (
          <button
            key={key}
            type="button"
            data-testid={`job-card-stat-${key}`}
            aria-label={
              newCount != null
                ? `${label}: ${formatCount(count)}, Noví kandidáti: ${formatCount(newCount)}`
                : `${label}: ${formatCount(count)}`
            }
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

JobCardStats.displayName = 'JobCardStats'
