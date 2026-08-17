import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'
import { formatCount } from './formatCount'
import type { JobCardCandidates } from './types'

export interface JobCardStatsProps extends StyleProps {
  candidates: JobCardCandidates
}

const STAT_LABELS: Record<keyof JobCardCandidates, string> = {
  unreviewed: 'Neposouzení',
  inProgress: 'Ve hře',
  total: 'Uchazečů',
}

const STAT_ORDER: (keyof JobCardCandidates)[] = ['unreviewed', 'inProgress', 'total']

export function JobCardStats({ candidates, className }: JobCardStatsProps) {
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
        'tm-rounded',
        'tm-bg-cover-light',
        'tm-py-3',
        className,
      )}
    >
      {items.map((key, index) => (
        <div
          key={key}
          className={cn(
            'tm-flex',
            'tm-min-w-[7rem]',
            'tm-flex-1',
            'tm-items-baseline',
            'tm-justify-center',
            'tm-gap-2',
            'tm-px-4',
            index > 0 && 'tm-border-0 tm-border-l tm-border-solid tm-border-secondary',
          )}
        >
          <span className="tm-text-2xl tm-font-semibold tm-leading-tight tm-text-primary-default">
            {formatCount(candidates[key] as number)}
          </span>
          <span className="tm-text-sm tm-text-secondary-default">{STAT_LABELS[key]}</span>
        </div>
      ))}
    </div>
  )
}

JobCardStats.displayName = 'JobCardStats'
