import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'
import { Button } from '../Button'
import { Icon } from '../Icon'
import { Link } from '../Link'
import { formatCount } from './lib/format'

export interface AdvertisementStatsProps extends StyleProps {
  viewCount?: number
  onStatistics?: () => void
  onDetail?: () => void
  /** Offer Prodloužit right of Přehled, for an advertisement that is ending soon. */
  showProlong?: boolean
  onProlong?: () => void
  /** Offer Znovuvystavit on an ended advertisement. */
  showRepublish?: boolean
  onRepublish?: () => void
}

/**
 * Compact advertisement footer: aggregated views, a Přehled action and optionally Prodloužit.
 */
export function AdvertisementStats({
  viewCount,
  onStatistics,
  onDetail,
  showProlong = false,
  onProlong,
  showRepublish = false,
  onRepublish,
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
        data-testid="job-card-advertisement-detail-action"
        className="tm-inline-flex tm-items-center tm-gap-1 tm-text-sm tm-font-normal"
        onClick={(event) => {
          event.preventDefault()
          event.stopPropagation()
          onDetail?.()
        }}
      >
        Přehled
        <Icon name="chevron-right" className="tm-text-base tm-leading-none" aria-hidden />
      </Link>
      {showProlong ? (
        <Button
          variant="primary"
          size="small"
          className="tm-ml-auto !tm-min-h-7 !tm-px-3"
          data-testid="job-card-disappearance-prolong"
          onClick={(event) => {
            event.stopPropagation()
            onProlong?.()
          }}
        >
          Prodloužit
        </Button>
      ) : null}
      {showRepublish ? (
        <Button
          variant="primary"
          size="small"
          className="tm-ml-auto !tm-min-h-7 !tm-px-3"
          data-testid="job-card-advertisement-republish"
          onClick={(event) => {
            event.stopPropagation()
            onRepublish?.()
          }}
        >
          Znovuvystavit
        </Button>
      ) : null}
    </div>
  )
}

AdvertisementStats.displayName = 'AdvertisementStats'
