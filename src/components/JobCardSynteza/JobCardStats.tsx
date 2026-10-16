import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'
import { formatCount } from './formatCount'
import type { JobCandidateStat, JobCardCandidates } from './types'

export interface JobCardStatsProps extends StyleProps {
  candidates: JobCardCandidates
  onStatClick?: (stat: JobCandidateStat) => void
}

const STAT_LABELS: Record<JobCandidateStat, string> = {
  new: 'Nový',
  unassessed: 'Neposouzený',
  preselected: 'Předvýbraný',
  opalcovani: 'Opalcovaný',
  invited: 'Pozvaný',
  nabidka: 'Nabídka',
  hired: 'Přijatý',
}

const STAT_ORDER: JobCandidateStat[] = [
  'new',
  'unassessed',
  'preselected',
  'opalcovani',
  'invited',
  'hired',
]

function statCount(candidates: JobCardCandidates, key: JobCandidateStat) {
  if (key === 'new') {
    return candidates.new ?? 0
  }

  return candidates[key] as number
}

export function JobCardStats({ candidates, onStatClick, className }: JobCardStatsProps) {
  const items = STAT_ORDER.filter((key) => key === 'new' || candidates[key] !== undefined)

  if (items.length === 0) {
    return null
  }

  return (
    <div
      data-testid="job-card-stats"
      className={cn('tm-flex', 'tm-w-full', 'tm-items-stretch', 'tm-gap-0', className)}
    >
      {items.map((key, index) => {
        const count = statCount(candidates, key)
        const label = STAT_LABELS[key]
        const isPriorityNew = key === 'new' && count > 0
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
                'tm-text-xl',
                'tm-font-semibold',
                'tm-leading-tight',
                isPriorityNew ? 'tm-text-teamio-pink' : 'tm-text-primary-default',
                onStatClick && 'tm-group-hover:tm-text-action-link-active',
              )}
            >
              {formatCount(count)}
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
            aria-label={`${label}: ${formatCount(count)}`}
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
