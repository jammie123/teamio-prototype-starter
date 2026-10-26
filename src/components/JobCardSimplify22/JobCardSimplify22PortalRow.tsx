import type { Placement } from '@floating-ui/react'
import { isUnlimitedPublication, shareSamePaidEndDate } from '../JobCardSynteza/advertisementSummary'
import type { JobPublication } from '../JobCardSynteza/types'
import {
  sortPublicationsBySoonestEnd,
  type PublicationPeriodBadge,
} from '../JobCardSyntezaAds/advertisementSummaryAds'
import {
  JobCardPublicationPortal,
  type JobCardPublicationChannelDecoration,
  type JobCardPublicationHover,
} from '../JobCardSyntezaAds/JobCardPublicationPortal'
import { cn } from '../../lib/cn'
import { resolveSimplify20ChannelStatusTone } from '../JobCardSimplify20/jobCardSimplify20Presentation'

export interface JobCardSimplify22PortalRowProps {
  publications: JobPublication[]
  listTestId: string
  expired: boolean
  perPublicationExpired?: boolean
  periodBadge: (publication: JobPublication) => PublicationPeriodBadge | undefined
  periodPresentation?: 'tag' | 'text'
  hoverContent?: JobCardPublicationHover
  allPublications?: JobPublication[]
  showProlong?: boolean
  onPreview?: (publication: JobPublication) => void
  onExtend?: (publication: JobPublication) => void
  onExtendAll?: () => void
  channelDecoration?: JobCardPublicationChannelDecoration
  dropdownPlacement?: Placement
  channelLogoSize?: 18 | 20 | 24 | 30 | 35 | 40
  showChannelLabel?: boolean
  inlineHighlights?: 'all' | 'none'
}

export function shouldShowSimplify22PerPortalDates(publications: JobPublication[]) {
  return !shareSamePaidEndDate(publications)
}

/** Career web / export placements have no end date, so they show when they were published. */
export function formatSimplify22PublishedLabel(startDate: string) {
  return `od ${startDate}`
}

const LIST_CLASS = 'tm-m-0 tm-flex tm-list-none tm-flex-row tm-flex-wrap tm-gap-x-4 tm-gap-y-2 tm-p-0'

/**
 * Simplify 22 portal row: no status dots. Ended portals get a gray-tone logo (opacity .8),
 * portals ending soon get a warning-colored name, career web shows its publish date.
 * When running and ended portals share one row, ended portals sit separately on the far right.
 */
export function JobCardSimplify22PortalRow({
  publications,
  listTestId,
  expired,
  perPublicationExpired = false,
  periodBadge,
  periodPresentation = 'text',
  hoverContent,
  allPublications,
  showProlong,
  onPreview,
  onExtend,
  onExtendAll,
  channelDecoration,
  dropdownPlacement,
  channelLogoSize = 30,
  showChannelLabel = true,
  inlineHighlights = 'none',
}: JobCardSimplify22PortalRowProps) {
  if (publications.length === 0) {
    return null
  }

  const sorted = sortPublicationsBySoonestEnd(publications)
  const showPerPortalDates = shouldShowSimplify22PerPortalDates(publications)

  const items = sorted.map((publication) => {
    const publicationExpired = perPublicationExpired
      ? publication.status === 'expired' || publication.status === 'disabled'
      : expired
    const tone = resolveSimplify20ChannelStatusTone(publication)
    const ended = publicationExpired || tone === 'gray'
    const badge =
      isUnlimitedPublication(publication.channel) && publication.startDate
        ? {
            color: 'informative' as const,
            label: formatSimplify22PublishedLabel(publication.startDate),
          }
        : showPerPortalDates
          ? periodBadge(publication)
          : undefined

    return {
      ended,
      node: (
        <JobCardPublicationPortal
          key={publication.id}
          publication={publication}
          expired={publicationExpired}
          withSeparator={false}
          variant="stacked"
          flatChannelLabel
          channelLogoMuted={ended}
          channelNameTone={!ended && tone === 'warning' ? 'warning' : 'default'}
          periodBadge={badge}
          periodPresentation={periodPresentation}
          hoverContent={hoverContent}
          publications={allPublications}
          showProlong={showProlong}
          onPreview={onPreview}
          onExtend={onExtend}
          onExtendAll={onExtendAll}
          channelDecoration={channelDecoration}
          dropdownPlacement={dropdownPlacement}
          channelLogoSize={channelLogoSize}
          showChannelLabel={showChannelLabel}
          inlineHighlights={inlineHighlights}
        />
      ),
    }
  })

  const running = items.filter((item) => !item.ended)
  const endedItems = items.filter((item) => item.ended)

  if (running.length === 0 || endedItems.length === 0) {
    return (
      <ul data-testid={listTestId} className={LIST_CLASS}>
        {items.map((item) => item.node)}
      </ul>
    )
  }

  return (
    <div
      data-testid={listTestId}
      className="tm-flex tm-w-full tm-flex-row tm-flex-wrap tm-items-start tm-gap-x-4 tm-gap-y-2"
    >
      <ul data-testid={`${listTestId}-running`} className={cn(LIST_CLASS, 'tm-min-w-0 tm-flex-1')}>
        {running.map((item) => item.node)}
      </ul>
      <ul
        data-testid={`${listTestId}-ended`}
        className={cn(LIST_CLASS, 'tm-ml-auto tm-shrink-0 tm-justify-end')}
      >
        {endedItems.map((item) => item.node)}
      </ul>
    </div>
  )
}

JobCardSimplify22PortalRow.displayName = 'JobCardSimplify22PortalRow'
