import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'
import { Link } from '../Link'
import { formatCount } from './lib/format'

export interface AdvertisementStatsProps extends StyleProps {
  viewCount?: number
  onStatistics?: () => void
}

/** Stacked aggregated view count for the advertisement row. */
export function AdvertisementStats({ viewCount, onStatistics, className }: AdvertisementStatsProps) {
  const formattedViews = viewCount === undefined ? undefined : formatCount(viewCount)

  if (formattedViews === undefined) {
    return null
  }

  return (
    <Link
      underlined="never"
      variant="secondary"
      aria-label={`${formattedViews} zhlédnutí`}
      data-testid="job-card-advertisement-aggregate-views"
      className={cn(
        'tm-inline-flex tm-shrink-0 tm-flex-col tm-items-start tm-gap-0 tm-text-sm tm-font-normal tm-leading-tight',
        className,
      )}
      onClick={onStatistics}
    >
      <span data-testid="job-card-advertisement-view-count">{formattedViews}</span>
      <span>zhlédnutí</span>
    </Link>
  )
}

AdvertisementStats.displayName = 'AdvertisementStats'
