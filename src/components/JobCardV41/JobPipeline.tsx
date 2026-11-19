import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'
import { Pill } from '../Pill'
import { formatCount } from './lib/format'
import type { JobCandidateStat, JobCardCandidates } from './types'

export interface JobPipelineProps extends StyleProps {
  candidates: JobCardCandidates
  onStatClick?: (stat: JobCandidateStat) => void
  /** Hiring Manager pipeline: K ohodnocení / Celkem. */
  isHiringManager?: boolean
}

const STAT_LABELS: Record<JobCandidateStat, string> = {
  unassessed: 'Neposouzený',
  toAssess: 'K ohodnocení',
  inProgress: 'Ve hře',
  opalcovani: 'Opalcovaný',
  total: 'Celkem',
}

const STAT_ORDER: JobCandidateStat[] = ['unassessed', 'inProgress', 'opalcovani', 'total']
const HIRING_MANAGER_STAT_ORDER: JobCandidateStat[] = ['toAssess', 'total']

function highlightCount(value: number | undefined) {
  return typeof value === 'number' && value > 0 ? value : undefined
}

/** Neposouzený / Ve hře / Opalcovaný / Celkem with an optional pill (count of new candidates) on Neposouzený. */
export function JobPipeline({
  candidates,
  onStatClick,
  isHiringManager = false,
  className,
}: JobPipelineProps) {
  const items = (isHiringManager ? HIRING_MANAGER_STAT_ORDER : STAT_ORDER).filter((key) => candidates[key] !== undefined)

  if (items.length === 0) {
    return null
  }

  return (
    <div
      data-testid="job-card-stats"
      className={cn(
        'tm-flex',
        'tm-w-full',
        'tm-flex-col',
        'md:tm-w-auto',
        'md:tm-shrink-0',
        'md:tm-flex-row',
        'tm-items-stretch',
        'tm-gap-0',
        className,
      )}
    >
      {items.map((key, index) => {
        const count = candidates[key] as number
        const label = STAT_LABELS[key]
        const newCount = key === 'unassessed' ? highlightCount(candidates.new) : undefined
        const layout = cn(
          'tm-flex',
          'tm-w-full',
          'md:tm-w-auto',
          'tm-min-w-0',
          'md:tm-shrink-0',
          // Mobile: one stat per row, label left and count right. Desktop: stacked cell.
          'tm-flex-row-reverse',
          'tm-items-center',
          'tm-justify-between',
          'md:tm-flex-col',
          'md:tm-items-start',
          'md:tm-justify-center',
          'tm-gap-0.5',
          'tm-px-0',
          'md:tm-px-4',
          'tm-py-3',
          'tm-text-left',
          // The first cell lines up with the title on the left.
          index === 0 && 'md:tm-pl-0',
          index > 0 &&
            'tm-border-0 tm-border-t md:tm-border-t-0 md:tm-border-l tm-border-solid tm-border-secondary',
        )

        const content = (
          <>
            <span className="tm-inline-flex tm-flex-row-reverse tm-flex-wrap tm-items-center tm-gap-2 md:tm-flex-row">
              <span
                className={cn(
                  'tm-text-lg',
                  'tm-font-medium',
                  'tm-leading-tight',
                  'tm-text-primary-default',
                  onStatClick && 'group-hover:tm-text-action-link-active',
                )}
              >
                {formatCount(count)}
              </span>
              {newCount != null ? (
                <Pill
                  color="pink"
                  data-testid="job-card-new-candidates"
                  aria-label={`Noví kandidáti: ${formatCount(newCount)}`}
                >
                  {formatCount(newCount)}
                </Pill>
              ) : null}
            </span>
            <span
              className={cn(
                'tm-text-13',
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

        const highlightLabel = newCount != null ? `, Noví kandidáti: ${formatCount(newCount)}` : ''

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
