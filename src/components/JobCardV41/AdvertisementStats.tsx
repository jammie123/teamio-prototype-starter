import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'
import { Button } from '../Button'
import { Icon } from '../Icon'
import { Link } from '../Link'
import { formatCount } from './lib/format'

/** Prodloužit for an advertisement that ends soon, Znovuvystavit for an ended one. */
export type AdvertisementStatsAction = 'prolong' | 'republish'

const ACTION_CONFIG: Record<AdvertisementStatsAction, { label: string; testId: string }> = {
  prolong: { label: 'Prodloužit', testId: 'job-card-disappearance-prolong' },
  republish: { label: 'Znovuvystavit', testId: 'job-card-advertisement-republish' },
}

export interface AdvertisementStatsProps extends StyleProps {
  viewCount?: number
  onStatistics?: () => void
  onDetail?: () => void
  /** Primary button right of Přehled. Omit for a running advertisement. */
  action?: AdvertisementStatsAction
  onAction?: () => void
}

/**
 * Compact advertisement footer: aggregated views, a Přehled action and optionally Prodloužit / Znovuvystavit.
 */
export function AdvertisementStats({
  viewCount,
  onStatistics,
  onDetail,
  action,
  onAction,
  className,
}: AdvertisementStatsProps) {
  const formattedViews = viewCount === undefined ? undefined : formatCount(viewCount)

  return (
    <div
      data-testid="job-card-advertisement-stats"
      className={cn(
        'tm-mt-0 tm-flex tm-w-auto tm-shrink-0 tm-items-center tm-gap-2 tm-self-start tm-pt-0 md:tm-mt-auto md:tm-w-full md:tm-pt-4',
        className,
      )}
    >
      {formattedViews !== undefined ? (
        <>
          <Link
            underlined="never"
            variant="secondary"
            aria-label={`${formattedViews} zhlédnutí`}
            data-testid="job-card-advertisement-aggregate-views"
            className="tm-inline-flex tm-items-center tm-gap-1 tm-text-sm tm-font-normal"
            onClick={onStatistics}
          >
            <Icon name="eye" size={20} strokeWidth={1.5} aria-hidden />
            {formattedViews}
          </Link>
          <div
            role="separator"
            aria-hidden
            className="tm-mx-0.5 tm-h-3 tm-self-center tm-border-0 tm-border-l tm-border-solid tm-border-secondary"
          />
        </>
      ) : null}
      <Link
        underlined="never"
        variant="secondary"
        data-testid="job-card-advertisement-detail-action"
        className="tm-inline-flex tm-items-center tm-gap-1 tm-text-sm tm-font-normal"
        onClick={onDetail}
      >
        Přehled
        <Icon name="chevron-right" className="tm-text-base tm-leading-none" aria-hidden />
      </Link>
      {action ? (
        <Button
          variant="primary"
          size="small"
          className="tm-ml-auto !tm-min-h-7 !tm-px-3"
          data-testid={ACTION_CONFIG[action].testId}
          onClick={onAction}
        >
          {ACTION_CONFIG[action].label}
        </Button>
      ) : null}
    </div>
  )
}

AdvertisementStats.displayName = 'AdvertisementStats'
