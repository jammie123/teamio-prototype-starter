import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'
import { Tag } from '../Tag'
import { formatCount } from '../JobCardSynteza/formatCount'
import type { JobCandidateStat, JobCardCandidates } from '../JobCardSyntezaPipeline/types'

export interface JobCardStatsSimplify8Props extends StyleProps {
  candidates: JobCardCandidates
  onStatClick?: (stat: JobCandidateStat) => void
}

const STAT_LABELS: Record<JobCandidateStat, string> = {
  unassessed: 'Neposouzený',
  preselected: 'Předvybraný',
  opalcovani: 'Opalcovaný',
  invited: 'Pozvaný',
  nabidka: 'Nabídka',
  hired: 'Přijatý',
  total: 'Celkem',
}

const STAT_ORDER: JobCandidateStat[] = [
  'unassessed',
  'preselected',
  'invited',
  'hired',
  'total',
]

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
    <Tag
      color="neutral"
      className={PINK_BADGE_CLASS}
      data-testid={testId}
      aria-label={ariaLabel}
    >
      {children}
    </Tag>
  )
}

export function JobCardStatsSimplify8({
  candidates,
  onStatClick,
  className,
}: JobCardStatsSimplify8Props) {
  const items = STAT_ORDER.filter((key) => candidates[key] !== undefined)

  if (items.length === 0) {
    return null
  }

  const newOhodnoceniCount =
    typeof candidates.newOhodnoceni === 'number' && candidates.newOhodnoceni > 0
      ? candidates.newOhodnoceni
      : typeof candidates.newOpalcovani === 'number' && candidates.newOpalcovani > 0
        ? candidates.newOpalcovani
        : undefined

  return (
    <div
      data-testid="job-card-stats"
      className={cn('tm-flex', 'tm-w-full', 'tm-items-stretch', 'tm-gap-0', className)}
    >
      {items.map((key, index) => {
        const count = candidates[key] as number
        const label = STAT_LABELS[key]
        const isFirst = index === 0
        const newCount =
          key === 'unassessed' && typeof candidates.new === 'number' && candidates.new > 0
            ? candidates.new
            : undefined
        const ohodnoceniCount = key === 'preselected' ? newOhodnoceniCount : undefined
        const layout = cn(
          'tm-flex',
          'tm-min-w-0',
          'tm-flex-1',
          'tm-flex-col',
          'tm-items-start',
          'tm-justify-center',
          'tm-gap-0.5',
          'tm-px-4',
          'tm-py-2',
          'tm-text-left',
          index > 0 && 'tm-border-0 tm-border-l tm-border-solid tm-border-secondary',
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
              {ohodnoceniCount != null ? (
                <StatHighlightBadge
                  testId="job-card-new-ohodnoceni"
                  ariaLabel={`Nově ohodnocení: ${formatCount(ohodnoceniCount)}`}
                >
                  {`${formatCount(ohodnoceniCount)} ohodnocený`}
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
                : ohodnoceniCount != null
                  ? `${label}: ${formatCount(count)}, Nově ohodnocení: ${formatCount(ohodnoceniCount)}`
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

JobCardStatsSimplify8.displayName = 'JobCardStatsSimplify8'
