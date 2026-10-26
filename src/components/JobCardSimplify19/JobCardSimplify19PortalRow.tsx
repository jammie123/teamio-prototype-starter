import type { Placement } from '@floating-ui/react'
import { shareSamePaidEndDate } from '../JobCardSynteza/advertisementSummary'
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
import type { JobCardChannelStatusDotPlacement } from './JobCardSimplify19ChannelStatusDot'
import { resolveSimplify19ChannelStatusTone } from './jobCardSimplify19Presentation'

export interface JobCardSimplify19PortalRowProps {
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
  channelLogoStatusPlacement?: JobCardChannelStatusDotPlacement
}

export function shouldShowSimplify19PerPortalDates(publications: JobPublication[]) {
  return !shareSamePaidEndDate(publications)
}

export function JobCardSimplify19PortalRow({
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
  channelLogoStatusPlacement,
}: JobCardSimplify19PortalRowProps) {
  if (publications.length === 0) {
    return null
  }

  const sorted = sortPublicationsBySoonestEnd(publications)
  const showPerPortalDates = shouldShowSimplify19PerPortalDates(publications)

  return (
    <ul
      data-testid={listTestId}
      className="tm-m-0 tm-flex tm-list-none tm-flex-row tm-flex-wrap tm-gap-x-4 tm-gap-y-2 tm-p-0"
    >
      {sorted.map((publication) => {
        const publicationExpired = perPublicationExpired
          ? publication.status === 'expired' || publication.status === 'disabled'
          : expired
        const channelLogoStatus = publicationExpired
          ? 'gray'
          : resolveSimplify19ChannelStatusTone(publication)

        return (
        <JobCardPublicationPortal
          key={publication.id}
          publication={publication}
          expired={publicationExpired}
          withSeparator={false}
          variant="stacked"
          channelLogoStatus={channelLogoStatus}
          channelLogoStatusPlacement={channelLogoStatusPlacement}
          periodBadge={showPerPortalDates ? periodBadge(publication) : undefined}
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
        )
      })}
    </ul>
  )
}

JobCardSimplify19PortalRow.displayName = 'JobCardSimplify19PortalRow'
