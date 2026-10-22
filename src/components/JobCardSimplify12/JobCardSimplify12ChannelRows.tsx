import { cn } from '../../lib/cn'
import {
  formatUnlimitedEndLabel,
  stripYear,
} from '../JobCardSynteza/advertisementSummary'
import type { JobPublication } from '../JobCardSynteza/types'
import { Link } from '../Link'
import { SIMPLIFY_12_CHANNEL_ORDER } from './constants'
import { JobCardSimplify12ChannelLogo } from './JobCardSimplify12ChannelLogo'
import {
  nearestEndPublicationId,
  resolveSimplify12ChannelVisualState,
  type Simplify12ChannelVisualState,
} from './jobCardSimplify12Presentation'

function sortPublicationsForRows(publications: JobPublication[]) {
  return [...publications].sort((left, right) => {
    const leftIndex = SIMPLIFY_12_CHANNEL_ORDER.indexOf(left.channel)
    const rightIndex = SIMPLIFY_12_CHANNEL_ORDER.indexOf(right.channel)
    return (leftIndex === -1 ? 999 : leftIndex) - (rightIndex === -1 ? 999 : rightIndex)
  })
}

function formatRowEndDate(publication: JobPublication, visual: Simplify12ChannelVisualState) {
  if (visual === 'unlimited') {
    return formatUnlimitedEndLabel()
  }

  if (!publication.endDate) {
    return '–'
  }

  return stripYear(publication.endDate)
}

export interface JobCardSimplify12ChannelRowsProps {
  publications: JobPublication[]
  variant: 'partial' | 'mixedEndDates'
  now?: Date
  highlightNearestEnd?: boolean
  onExtendPublication?: (publication: JobPublication) => void
}

export function JobCardSimplify12ChannelRows({
  publications,
  variant,
  now = new Date(),
  highlightNearestEnd = false,
  onExtendPublication,
}: JobCardSimplify12ChannelRowsProps) {
  const visible = publications.filter((publication) => publication.status !== 'disabled')
  const ordered = sortPublicationsForRows(visible)
  const nearestId =
    highlightNearestEnd && variant === 'mixedEndDates'
      ? nearestEndPublicationId(publications, now)
      : undefined

  if (ordered.length === 0) {
    return null
  }

  return (
    <div
      data-testid="job-card-simplify12-channel-rows"
      className="tm-flex tm-flex-col tm-gap-2 tm-border-0 tm-border-t tm-border-solid tm-border-secondary tm-pt-2"
    >
      {ordered.map((publication) => {
        const visual = resolveSimplify12ChannelVisualState(publication, now)
        const endLabel = formatRowEndDate(publication, visual)
        const isNearest = nearestId === publication.id

        if (variant === 'mixedEndDates') {
          return (
            <div
              key={publication.id}
              data-testid="job-card-simplify12-channel-row"
              data-layout="stacked"
              className="tm-flex tm-items-start tm-gap-2"
            >
              <JobCardSimplify12ChannelLogo publication={publication} />
              <div className="tm-flex tm-min-w-0 tm-flex-col tm-gap-0.5 tm-text-xs">
                <span className="tm-truncate tm-text-primary-default">{publication.channel}</span>
                <span
                  className={cn(
                    isNearest
                      ? 'tm-text-emotion-warning-emphasis'
                      : 'tm-text-primary-default',
                  )}
                >
                  {endLabel}
                </span>
              </div>
            </div>
          )
        }

        return (
          <div
            key={publication.id}
            data-testid="job-card-simplify12-channel-row"
            data-layout="inline"
            className="tm-flex tm-items-center tm-gap-2 tm-text-xs"
          >
            <JobCardSimplify12ChannelLogo publication={publication} />
            <span
              className={cn(
                'tm-min-w-0 tm-truncate',
                visual === 'expired'
                  ? 'tm-text-emotion-danger-emphasis'
                  : 'tm-text-primary-default',
              )}
            >
              {publication.channel}
            </span>
            {visual === 'expired' && onExtendPublication ? (
              <Link
                className="tm-ml-auto tm-shrink-0 tm-text-xs"
                data-testid="job-card-simplify12-channel-restore"
                onClick={(event) => {
                  event.preventDefault()
                  event.stopPropagation()
                  onExtendPublication(publication)
                }}
              >
                Obnovit
              </Link>
            ) : (
              <span
                className={cn(
                  'tm-ml-auto tm-shrink-0 tm-text-primary-default',
                )}
              >
                {visual === 'expired' ? null : endLabel}
              </span>
            )}
          </div>
        )
      })}
    </div>
  )
}

JobCardSimplify12ChannelRows.displayName = 'JobCardSimplify12ChannelRows'
