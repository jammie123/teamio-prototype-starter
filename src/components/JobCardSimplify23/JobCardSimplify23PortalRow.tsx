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
import { jobPortalLogoTypeFromChannel } from '../JobPortalLogo'
import { cn } from '../../lib/cn'
import { resolveSimplify20ChannelStatusTone } from '../JobCardSimplify20/jobCardSimplify20Presentation'

export interface JobCardSimplify23PortalRowProps {
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

export function shouldShowSimplify23PerPortalDates(publications: JobPublication[]) {
  return !shareSamePaidEndDate(publications)
}

/** Career web / export placements have no end date, so they show when they were published. */
export function formatSimplify23PublishedLabel(startDate: string) {
  return `od ${startDate}`
}

function careerWordmarkType(channel: string) {
  return jobPortalLogoTypeFromChannel(channel) === 'pages' ? 'karierky' : undefined
}

const LIST_CLASS = 'tm-m-0 tm-flex tm-list-none tm-flex-row tm-flex-wrap tm-gap-x-4 tm-gap-y-2 tm-p-0'

/**
 * Simplify 23 portal row: no portal names, Kariérky wordmark for career web.
 * Ended portals move to a second row with a top border when running portals are also present.
 */
export function JobCardSimplify23PortalRow({
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
  showChannelLabel = false,
  inlineHighlights = 'none',
}: JobCardSimplify23PortalRowProps) {
  if (publications.length === 0) {
    return null
  }

  const sorted = sortPublicationsBySoonestEnd(publications)
  const showPerPortalDates = shouldShowSimplify23PerPortalDates(publications)

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
            label: formatSimplify23PublishedLabel(publication.startDate),
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
          channelLogoType={careerWordmarkType(publication.channel)}
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
    <div data-testid={listTestId} className="tm-flex tm-w-full tm-flex-col">
      <ul data-testid={`${listTestId}-running`} className={LIST_CLASS}>
        {running.map((item) => item.node)}
      </ul>
      <ul
        data-testid={`${listTestId}-ended`}
        className={cn(
          LIST_CLASS,
          'tm-border-0 tm-border-t tm-border-solid tm-border-secondary tm-pt-2 tm-mt-2',
        )}
      >
        {endedItems.map((item) => item.node)}
      </ul>
    </div>
  )
}

JobCardSimplify23PortalRow.displayName = 'JobCardSimplify23PortalRow'
