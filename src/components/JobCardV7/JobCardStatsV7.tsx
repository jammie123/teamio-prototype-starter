import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'
import { Tag } from '../Tag'
import { formatCount } from '../JobCard/formatCount'
import type { JobCandidateStat, JobCardCandidates } from './types'

export interface JobCardStatsV7Props extends StyleProps {
  candidates: JobCardCandidates
  onStatClick?: (stat: JobCandidateStat) => void
  /** Applied to each `job-card-stat-*` cell (e.g. fixed width). */
  statItemClassName?: string
}

const STAT_LABELS: Record<JobCandidateStat, string> = {
  unassessed: 'Neposouzený',
  inProgress: 'Ve hře',
  total: 'Celkem',
}

const STAT_ORDER: JobCandidateStat[] = ['unassessed', 'inProgress', 'total']

const PINK_BADGE_CLASS =
  '!tm-min-h-0 !tm-h-auto !tm-gap-0 !tm-py-0.5 !tm-px-1.5 !tm-text-[10px] !tm-font-semibold !tm-leading-tight !tm-rounded-full !tm-text-primary-inverted-default !tm-bg-teamio-pink'

function StatHighlightBadge({
  children,
  testId,
  ariaLabel,
}: {
  children: string
  testId: string
  ariaLabel: string
}) {
  return (
    <Tag color="neutral" className={PINK_BADGE_CLASS} data-testid={testId} aria-label={ariaLabel}>
      {children}
    </Tag>
  )
}

export function JobCardStatsV7({
  candidates,
  onStatClick,
  statItemClassName,
  className,
}: JobCardStatsV7Props) {
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
        const newCount =
          key === 'unassessed' && typeof candidates.new === 'number' && candidates.new > 0
            ? candidates.new
            : undefined
        const newOpalcovaniCount =
          key === 'inProgress' &&
          typeof candidates.newOpalcovani === 'number' &&
          candidates.newOpalcovani > 0
            ? candidates.newOpalcovani
            : undefined
        const layout = cn(
          'tm-flex',
          'tm-min-w-0',
          'tm-shrink-0',
          'tm-flex-col',
          'tm-items-start',
          'tm-justify-center',
          'tm-gap-0.5',
          'tm-px-4',
          'tm-py-2',
          'tm-text-left',
          index > 0 && 'tm-border-0 tm-border-l tm-border-solid tm-border-secondary',
          statItemClassName,
        )

        const content = (
          <>
            <span
              className={cn(
                'tm-inline-flex',
                'tm-flex-wrap',
                'tm-items-center',
                'tm-gap-1.5',
                onStatClick && 'tm-group-hover:tm-text-action-link-active',
              )}
            >
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
                <StatHighlightBadge
                  testId="job-card-new-candidates"
                  ariaLabel={`Noví kandidáti: ${formatCount(newCount)}`}
                >
                  {`${formatCount(newCount)} nový`}
                </StatHighlightBadge>
              ) : null}
              {newOpalcovaniCount != null ? (
                <StatHighlightBadge
                  testId="job-card-new-opalcovani"
                  ariaLabel={`Nově opalcovaní: ${formatCount(newOpalcovaniCount)}`}
                >
                  {`${formatCount(newOpalcovaniCount)} opalcovaný`}
                </StatHighlightBadge>
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

JobCardStatsV7.displayName = 'JobCardStatsV7'
