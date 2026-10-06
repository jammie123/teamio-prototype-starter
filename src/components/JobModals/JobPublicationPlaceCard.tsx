import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'
import { Card } from '../Card'
import { Checkbox } from '../Checkbox'
import { JobPortalLogo, jobPortalLogoTypeFromChannel } from '../JobPortalLogo'
import { formatPublicationRange } from '../JobCardSynteza/advertisementSummary'
import type { JobModalPublicationPlace } from './types'

export interface JobPublicationPlaceCardProps extends StyleProps {
  place: JobModalPublicationPlace
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}

function formatCredits(credits: number) {
  return `${credits} kreditů`
}

export function JobPublicationPlaceCard({
  place,
  checked,
  onCheckedChange,
  className,
}: JobPublicationPlaceCardProps) {
  const logoType = place.logoType ?? jobPortalLogoTypeFromChannel(place.name)
  const period = place.startDate
    ? formatPublicationRange(place.startDate, place.endDate)
    : undefined
  const hasPrice = Boolean(place.priceLabel)
  const hasCredits = place.credits != null

  return (
    <Card
      as="div"
      data-testid="job-publication-place-card"
      className={cn('tm-cursor-pointer', className)}
      onClick={() => onCheckedChange(!checked)}
    >
      <span className="tm-flex tm-items-start tm-gap-3">
        <JobPortalLogo type={logoType} title="" className="tm-mt-0.5 tm-size-8" />
        <span className="tm-flex tm-min-w-0 tm-flex-1 tm-flex-col tm-gap-1">
          <span className="tm-text-sm tm-font-medium tm-text-primary-default">{place.name}</span>
          {place.description ? (
            <span className="tm-text-sm tm-text-secondary-default">{place.description}</span>
          ) : null}
          {period ? (
            <span className="tm-text-13 tm-tabular-nums tm-text-secondary-default">{period}</span>
          ) : null}
          {hasPrice || hasCredits ? (
            <span className="tm-flex tm-flex-wrap tm-gap-x-2 tm-text-sm tm-text-primary-default">
              {hasPrice ? <span>{place.priceLabel}</span> : null}
              {hasCredits ? <span>{formatCredits(place.credits as number)}</span> : null}
            </span>
          ) : null}
        </span>
        <Checkbox
          checked={checked}
          aria-label={place.name}
          onChange={(event) => onCheckedChange(event.target.checked)}
          onClick={(event) => event.stopPropagation()}
          className="tm-shrink-0"
        />
      </span>
    </Card>
  )
}

JobPublicationPlaceCard.displayName = 'JobPublicationPlaceCard'
