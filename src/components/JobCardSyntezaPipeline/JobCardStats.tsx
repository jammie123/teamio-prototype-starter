import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'
import { Pill } from '../Pill'
import { formatCount } from '../JobCardSynteza/formatCount'
import type { JobCandidateStat, JobCardCandidates } from './types'

export interface JobCardStatsProps extends StyleProps {
  candidates: JobCardCandidates
  onStatClick?: (stat: JobCandidateStat) => void
}

const STAT_LABELS: Record<JobCandidateStat, string> = {
  unassessed: 'Neposouzení',
  preselected: 'Předvýbraný',
  opalcovani: 'Opalcovaný',
  invited: 'Pozvaný',
  hired: 'Přijatý',
  total: 'Celkem',
}

const STAT_ORDER: JobCandidateStat[] = [
  'unassessed',
  'preselected',
  'opalcovani',
  'invited',
  'hired',
  'total',
]

export function JobCardStats({ candidates, onStatClick, className }: JobCardStatsProps) {
  const items = STAT_ORDER.filter((key) => candidates[key] !== undefined)

  if (items.length === 0) {
    return null
  }

  return (
    <div
      data-testid="job-card-stats"
      className={cn('tm-flex', 'tm-w-full', 'tm-items-stretch', 'tm-gap-0', className)}
    >
      {items.map((key, index) => {
        const count = candidates[key] as number
        const label = STAT_LABELS[key]
        const newCount =
          key === 'unassessed' && typeof candidates.new === 'number' && candidates.new > 0
            ? candidates.new
            : undefined
        const newOpalcovaniCount =
          key === 'opalcovani' &&
          typeof candidates.newOpalcovani === 'number' &&
          candidates.newOpalcovani > 0
            ? candidates.newOpalcovani
            : undefined
        const layout = cn(
          'tm-flex',
          'tm-min-w-0',
          'tm-flex-1',
          'tm-flex-col',
          'tm-items-start',
          'tm-justify-center',
          'tm-gap-0.5',
          'tm-px-6',
          'tm-py-2',
          'tm-text-left',
          index > 0 && 'tm-border-0 tm-border-l tm-border-solid tm-border-secondary',
        )

        const content = (
          <>
            <span
              className={cn(
                'tm-inline-flex',
                'tm-items-center',
                'tm-gap-1.5',
                onStatClick && 'tm-group-hover:tm-text-action-link-active',
              )}
            >
              <span
                className={cn(
                  'tm-text-xl',
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
                  className="tm-h-6 tm-min-w-6 tm-px-2 tm-text-sm tm-font-semibold"
                >
                  {formatCount(newCount)}
                </Pill>
              ) : null}
              {newOpalcovaniCount != null ? (
                <Pill
                  color="pink"
                  data-testid="job-card-new-opalcovani"
                  aria-label={`Nově opalcovaní: ${formatCount(newOpalcovaniCount)}`}
                  className="tm-h-6 tm-min-w-6 tm-px-2 tm-text-sm tm-font-semibold"
                >
                  {formatCount(newOpalcovaniCount)}
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
                : newOpalcovaniCount != null
                  ? `${label}: ${formatCount(count)}, Nově opalcovaní: ${formatCount(newOpalcovaniCount)}`
                  : `${label}: ${formatCount(count)}`
            }
            onClick={() => onStatClick(key)}
            className={cn(
              layout,
              'tm-group',
              'tm-border-0',
              'tm-gap-0',
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
