import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'
import { Icon } from '../Icon'
import { Tag } from '../Tag'
import { formatViewCountLabel } from '../JobCardSynteza/advertisementSummary'
import type {
  Simplify14v2HeaderBadge,
  Simplify14v2HeadingIcon,
} from './jobCardSimplify14v2Presentation'

export interface AdvertisementHeaderProps extends StyleProps {
  title?: string
  titleTestId?: string
  icon?: Simplify14v2HeadingIcon
  badges?: Simplify14v2HeaderBadge[]
  viewCount?: number
  onViewStatisticsClick?: () => void
}

const STATUS_ICON_CLASS = 'tm-shrink-0 tm-text-lg tm-leading-none'
const CHECK_ICON_CLASS = 'tm-shrink-0 tm-text-base tm-leading-none'
const STATUS_ICON_STROKE = 2
const CHECK_ICON_STROKE = 1.5

function statusIconStroke(icon: Simplify14v2HeadingIcon) {
  return icon === 'circle-check' ? CHECK_ICON_STROKE : STATUS_ICON_STROKE
}

function statusIconClass(icon: Simplify14v2HeadingIcon) {
  return icon === 'circle-check' ? CHECK_ICON_CLASS : STATUS_ICON_CLASS
}

function AggregateViews({
  viewCount,
  onViewStatisticsClick,
}: {
  viewCount: number
  onViewStatisticsClick?: () => void
}) {
  const label = formatViewCountLabel(viewCount)
  const className = 'tm-shrink-0 tm-text-sm tm-text-secondary-default'

  if (onViewStatisticsClick) {
    return (
      <button
        type="button"
        data-testid="job-card-advertisement-aggregate-views"
        className={cn(
          className,
          'tm-border-0 tm-bg-transparent tm-p-0 tm-font-inherit tm-cursor-pointer hover:tm-text-primary-default',
        )}
        onClick={(event) => {
          event.preventDefault()
          event.stopPropagation()
          onViewStatisticsClick()
        }}
      >
        {label}
      </button>
    )
  }

  return (
    <span data-testid="job-card-advertisement-aggregate-views" className={className}>
      {label}
    </span>
  )
}

export function AdvertisementHeader({
  title,
  titleTestId,
  icon,
  badges = [],
  viewCount,
  onViewStatisticsClick,
  className,
}: AdvertisementHeaderProps) {
  if (!title && badges.length === 0 && viewCount === undefined) {
    return null
  }

  return (
    <div
      data-testid="advertisement-header"
      className="tm-flex tm-flex-col tm-gap-1 tm-border-0 tm-border-b tm-border-solid tm-border-secondary tm-pb-2"
    >
      <div className="tm-flex tm-items-start tm-justify-between tm-gap-3">
        <div className="tm-flex tm-min-w-0 tm-flex-1 tm-flex-wrap tm-items-center tm-gap-2">
          {title ? (
            <p
              data-testid={titleTestId}
              className={cn(
                'tm-m-0 tm-flex tm-min-w-0 tm-items-center tm-gap-2 tm-text-sm tm-font-medium',
                className,
              )}
            >
              {icon ? (
                <Icon
                  name={icon}
                  strokeWidth={statusIconStroke(icon)}
                  className={statusIconClass(icon)}
                />
              ) : null}
              <span>{title}</span>
            </p>
          ) : null}
          {badges.map((badge) => (
            <Tag
              key={badge.label}
              color={badge.color}
              isSubtle
              className="!tm-w-fit !tm-text-[11px] !tm-font-semibold"
              data-testid="advertisement-header-badge"
              data-tone={badge.color}
            >
              {badge.label}
            </Tag>
          ))}
        </div>
        {viewCount !== undefined ? (
          <AggregateViews
            viewCount={viewCount}
            onViewStatisticsClick={onViewStatisticsClick}
          />
        ) : null}
      </div>
    </div>
  )
}

AdvertisementHeader.displayName = 'AdvertisementHeader'
