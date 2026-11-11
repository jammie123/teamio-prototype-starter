import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'
import { Icon } from '../Icon'
import { Link } from '../Link'
import { formatCount } from './lib/format'

export interface AdvertisementStatsProps extends StyleProps {
  viewCount?: number
  onStatistics?: () => void
  onDetail?: () => void
}

/**
 * Compact advertisement footer: aggregated views and a Detailní přehled action.
 */
export function AdvertisementStats({
  viewCount,
  onStatistics,
  onDetail,
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
            onClick={(event) => {
              event.preventDefault()
              event.stopPropagation()
              onStatistics?.()
            }}
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
        aria-label="Detailní přehled"
        data-testid="job-card-advertisement-detail-action"
        className="tm-inline-flex tm-items-center tm-gap-1 tm-text-sm tm-font-normal"
        onClick={(event) => {
          event.preventDefault()
          event.stopPropagation()
          onDetail?.()
        }}
      >
        Detailní přehled
        <Icon name="chevron-right" className="tm-text-base tm-leading-none" aria-hidden />
      </Link>
    </div>
  )
}

AdvertisementStats.displayName = 'AdvertisementStats'
