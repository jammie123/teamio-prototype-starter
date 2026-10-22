import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'
import { Button } from '../Button'
import { Icon } from '../Icon'
import {
  formatAdvertisementExpiredHeading,
  formatEndingSoonHeading,
  formatViewCountLabel,
  getAdvertisementSummary,
  getRemainingCalendarDays,
  richestDateLabel,
  shareSameEndDate,
} from '../JobCardSynteza/advertisementSummary'
import type { JobAdvertisement, JobPublication } from '../JobCardSynteza/types'
import { Link } from '../Link'
import { JobCardAdvertisement } from '../JobCardSyntezaAds/JobCardAdvertisement'
import { isDraftAdvertisement, publicationPeriodBadge } from '../JobCardSyntezaAds/advertisementSummaryAds'
import { shouldShowPlacesProlong } from '../JobCardSyntezaAds/JobCardPlacesSummaryTable'
import {
  JobCardExpiredPublicationMiniLogoRow,
  JobCardPublicationPortal,
  type JobCardPublicationHover,
} from '../JobCardSyntezaAds/JobCardPublicationPortal'
import {
  resolveJobCardSimplify10PanelMode,
  type JobCardSimplify10PanelMode,
} from './jobCardSimplify10Presentation'

export interface JobCardAdvertisementSimplify10PanelProps extends StyleProps {
  advertisement: JobAdvertisement
  onCompleteAdvertisement?: (advertisement: JobAdvertisement) => void
  onViewStatisticsClick?: () => void
  onPreviewAdvertisement?: () => void
  onPreviewPublication?: (publication: JobPublication) => void
  onExtendPublication?: (publication: JobPublication) => void
  onExtendPublications?: () => void
  onDeclineAdvertising?: () => void
  onRepublishAdvertisement?: () => void
  publicationHover?: JobCardPublicationHover
  channelLogoSize?: 35 | 40
  showPortalPeriodBadges?: boolean
  expiredLogosMuted?: boolean
  actionButtonVariant?: 'primary' | 'secondary'
  actionButtonSize?: 'small' | 'medium'
}

function sharedFullEndDate(publications: JobPublication[]) {
  if (!shareSameEndDate(publications)) {
    return undefined
  }

  const dates = publications
    .map((publication) => publication.endDate)
    .filter((value): value is string => Boolean(value))

  if (dates.length === 0) {
    return undefined
  }

  return richestDateLabel(dates)
}

function declinedAdvertisingDate(advertisement: JobAdvertisement) {
  if (advertisement.advertisingDeclinedAt) {
    return advertisement.advertisingDeclinedAt
  }

  const publications = advertisement.publications ?? []
  return sharedFullEndDate(publications) ?? getAdvertisementSummary(advertisement).lastEndedOn
}

function StatusHeading({
  icon,
  className,
  testId,
  children,
}: {
  icon: 'clock' | 'alert-triangle-outline' | 'view-off'
  className: string
  testId: string
  children: string
}) {
  return (
    <p
      data-testid={testId}
      className={cn(
        'tm-m-0 tm-flex tm-items-center tm-gap-1.5 tm-text-sm tm-font-medium',
        className,
      )}
    >
      <Icon name={icon} size={20} className="tm-shrink-0" />
      <span>{children}</span>
    </p>
  )
}

function ActivePortalLogos({
  publications,
  allPublications,
  showProlong,
  onPreview,
  onExtend,
  onExtendAll,
  publicationHover,
  channelLogoSize = 35,
  showPortalPeriodBadges = true,
}: {
  publications: JobPublication[]
  allPublications: JobPublication[]
  showProlong: boolean
  onPreview?: (publication: JobPublication) => void
  onExtend?: (publication: JobPublication) => void
  onExtendAll?: () => void
  publicationHover: JobCardPublicationHover
  channelLogoSize?: 35 | 40
  showPortalPeriodBadges?: boolean
}) {
  return (
    <ul
      data-testid="job-card-advertisement-active-publications"
      className="tm-m-0 tm-flex tm-list-none tm-flex-row tm-flex-wrap tm-gap-x-1.5 tm-gap-y-1 tm-p-0"
    >
      {publications.map((publication) => (
        <JobCardPublicationPortal
          key={publication.id}
          publication={publication}
          expired={false}
          withSeparator={false}
          periodBadge={showPortalPeriodBadges ? publicationPeriodBadge(publication) : undefined}
          periodPresentation="text"
          hoverContent={publicationHover}
          publications={allPublications}
          showProlong={showProlong}
          onPreview={onPreview}
          onExtend={onExtend}
          onExtendAll={onExtendAll}
          channelDecoration="plain"
          channelLogoSize={channelLogoSize}
          showChannelLabel={false}
          inlineHighlights="none"
          portalChip
        />
      ))}
    </ul>
  )
}

function Simplify10EndingSoonPanel({
  advertisement,
  onExtendAll,
  onPreviewPublication,
  onExtendPublication,
  publicationHover,
  channelLogoSize = 35,
  showPortalPeriodBadges = true,
  actionButtonVariant = 'primary',
  actionButtonSize = 'small',
}: {
  advertisement: JobAdvertisement
  onExtendAll?: () => void
  onPreviewPublication?: (publication: JobPublication) => void
  onExtendPublication?: (publication: JobPublication) => void
  publicationHover: JobCardPublicationHover
  channelLogoSize?: 35 | 40
  showPortalPeriodBadges?: boolean
  actionButtonVariant?: 'primary' | 'secondary'
  actionButtonSize?: 'small' | 'medium'
}) {
  const publications = advertisement.publications ?? []
  const summary = getAdvertisementSummary(advertisement)
  const endDate = sharedFullEndDate(publications)
  const remainingDays = endDate ? getRemainingCalendarDays(endDate) : undefined
  const heading = formatEndingSoonHeading({
    sameDate: true,
    endDate,
    remainingDays,
  })
  const showProlong = shouldShowPlacesProlong(publications)

  return (
    <div
      data-testid="job-card-simplify10-ending-soon"
      className="tm-flex tm-flex-col tm-gap-2"
    >
      <StatusHeading
        icon="clock"
        className="tm-text-emotion-warning-emphasis"
        testId="job-card-advertisement-ending-soon-heading"
      >
        {heading}
      </StatusHeading>
      <ActivePortalLogos
        publications={publications}
        allPublications={publications}
        showProlong={showProlong}
        onPreview={onPreviewPublication}
        onExtend={onExtendPublication}
        onExtendAll={onExtendAll}
        publicationHover={publicationHover}
        channelLogoSize={channelLogoSize}
        showPortalPeriodBadges={showPortalPeriodBadges}
      />
      {summary.viewCount !== undefined ? (
        <p
          data-testid="job-card-advertisement-aggregate-views"
          className="tm-m-0 tm-text-xs tm-text-secondary-default"
        >
          {formatViewCountLabel(summary.viewCount)}
        </p>
      ) : null}
      {onExtendAll ? (
        <Button
          variant={actionButtonVariant}
          size={actionButtonSize}
          isBlock
          className={actionButtonSize === 'small' ? '!tm-min-h-8' : undefined}
          data-testid="job-card-simplify10-extend-advertising"
          onClick={(event) => {
            event.preventDefault()
            event.stopPropagation()
            onExtendAll()
          }}
        >
          Prodloužit inzerci
        </Button>
      ) : null}
    </div>
  )
}

function Simplify10ExpiredPanel({
  advertisement,
  onExtendAll,
  onDeclineAdvertising,
  onPreviewPublication,
  onExtendPublication,
  publicationHover,
  channelLogoSize = 35,
  expiredLogosMuted = true,
  actionButtonVariant = 'primary',
  actionButtonSize = 'small',
}: {
  advertisement: JobAdvertisement
  onExtendAll?: () => void
  onDeclineAdvertising?: () => void
  onPreviewPublication?: (publication: JobPublication) => void
  onExtendPublication?: (publication: JobPublication) => void
  publicationHover: JobCardPublicationHover
  channelLogoSize?: 35 | 40
  expiredLogosMuted?: boolean
  actionButtonVariant?: 'primary' | 'secondary'
  actionButtonSize?: 'small' | 'medium'
}) {
  const publications = advertisement.publications ?? []
  const endDate = sharedFullEndDate(publications)
  const heading = formatAdvertisementExpiredHeading(endDate)
  const showProlong = shouldShowPlacesProlong(publications)

  return (
    <div data-testid="job-card-simplify10-expired" className="tm-flex tm-flex-col tm-gap-2">
      <StatusHeading
        icon="alert-triangle-outline"
        className="tm-text-emotion-danger-emphasis"
        testId="job-card-publication-ended-heading"
      >
        {heading}
      </StatusHeading>
      <JobCardExpiredPublicationMiniLogoRow
        publications={publications}
        listTestId="job-card-advertisement-ended-publications"
        hoverContent={publicationHover}
        allPublications={publications}
        showProlong={showProlong}
        onPreview={onPreviewPublication}
        onExtend={onExtendPublication}
        onExtendAll={onExtendAll}
        channelDecoration="plain"
        channelLogoSize={channelLogoSize}
        muted={expiredLogosMuted}
      />
      <p className="tm-m-0 tm-text-xs tm-text-secondary-default">
        Nábor běží, ale pozice už není vidět. Noví kandidáti nepřijdou.
      </p>
      {onExtendAll ? (
        <Button
          variant={actionButtonVariant}
          size={actionButtonSize}
          isBlock
          className={actionButtonSize === 'small' ? '!tm-min-h-8' : undefined}
          data-testid="job-card-simplify10-restore-advertising"
          onClick={(event) => {
            event.preventDefault()
            event.stopPropagation()
            onExtendAll()
          }}
        >
          Obnovit inzerci
        </Button>
      ) : null}
      {onDeclineAdvertising ? (
        <Link
          variant="secondary"
          underlined="never"
          className="tm-text-xs tm-text-secondary-default hover:tm-text-primary-default"
          data-testid="job-card-simplify10-decline-advertising"
          onClick={(event) => {
            event.preventDefault()
            event.stopPropagation()
            onDeclineAdvertising()
          }}
        >
          Už neinzeruji
        </Link>
      ) : null}
    </div>
  )
}

function Simplify10NotAdvertisingPanel({
  advertisement,
  onRepublish,
}: {
  advertisement: JobAdvertisement
  onRepublish?: () => void
}) {
  const summary = getAdvertisementSummary(advertisement)
  const declinedDate = declinedAdvertisingDate(advertisement)
  const metaParts = [
    declinedDate ? `Inzerce ukončena ${declinedDate}` : undefined,
    summary.viewCount !== undefined ? formatViewCountLabel(summary.viewCount) : undefined,
  ].filter(Boolean)

  return (
    <div
      data-testid="job-card-simplify10-not-advertising"
      className="tm-flex tm-flex-col tm-gap-2"
    >
      <StatusHeading
        icon="view-off"
        className="tm-text-secondary-default"
        testId="job-card-simplify10-not-advertising-heading"
      >
        Neinzeruje se
      </StatusHeading>
      {metaParts.length > 0 ? (
        <p className="tm-m-0 tm-text-xs tm-text-secondary-default">{metaParts.join(' · ')}</p>
      ) : null}
      {onRepublish ? (
        <Link
          variant="primary"
          underlined="never"
          className="tm-inline-flex tm-items-center tm-gap-1 tm-text-sm"
          data-testid="job-card-simplify10-republish"
          onClick={(event) => {
            event.preventDefault()
            event.stopPropagation()
            onRepublish()
          }}
        >
          <Icon name="plus" size={16} />
          Znovu inzerovat
        </Link>
      ) : null}
    </div>
  )
}

function renderSimplify10Panel(
  mode: JobCardSimplify10PanelMode,
  props: JobCardAdvertisementSimplify10PanelProps,
  onExtendAll?: () => void,
  publicationHover: JobCardPublicationHover = 'placesTable',
) {
  const { advertisement, onPreviewPublication, onExtendPublication, onDeclineAdvertising, onRepublishAdvertisement } =
    props
  const onRepublish = onRepublishAdvertisement ?? onExtendAll

  const {
    channelLogoSize = 35,
    showPortalPeriodBadges = true,
    expiredLogosMuted = true,
    actionButtonVariant = 'primary',
    actionButtonSize = 'small',
  } = props

  switch (mode) {
    case 'endingSoon':
      return (
        <Simplify10EndingSoonPanel
          advertisement={advertisement}
          onExtendAll={onExtendAll}
          onPreviewPublication={onPreviewPublication}
          onExtendPublication={onExtendPublication}
          publicationHover={publicationHover}
          channelLogoSize={channelLogoSize}
          showPortalPeriodBadges={showPortalPeriodBadges}
          actionButtonVariant={actionButtonVariant}
          actionButtonSize={actionButtonSize}
        />
      )
    case 'expiredUnexpected':
      return (
        <Simplify10ExpiredPanel
          advertisement={advertisement}
          onExtendAll={onExtendAll}
          onDeclineAdvertising={onDeclineAdvertising}
          onPreviewPublication={onPreviewPublication}
          onExtendPublication={onExtendPublication}
          publicationHover={publicationHover}
          channelLogoSize={channelLogoSize}
          expiredLogosMuted={expiredLogosMuted}
          actionButtonVariant={actionButtonVariant}
          actionButtonSize={actionButtonSize}
        />
      )
    case 'notAdvertising':
      return (
        <Simplify10NotAdvertisingPanel advertisement={advertisement} onRepublish={onRepublish} />
      )
    default:
      return null
  }
}

export function JobCardAdvertisementSimplify10Panel({
  advertisement,
  onCompleteAdvertisement,
  onViewStatisticsClick,
  onPreviewAdvertisement,
  onPreviewPublication,
  onExtendPublication,
  onExtendPublications,
  onDeclineAdvertising,
  onRepublishAdvertisement,
  publicationHover = 'placesTable',
  channelLogoSize = 35,
  showPortalPeriodBadges = true,
  expiredLogosMuted = true,
  actionButtonVariant = 'primary',
  actionButtonSize = 'small',
  className,
}: JobCardAdvertisementSimplify10PanelProps) {
  const publications = advertisement.publications ?? []
  const onExtendAll =
    onExtendPublications ??
    (onExtendPublication
      ? () => {
          const target = publications.find((item) => item.status !== 'expired') ?? publications[0]
          if (target) {
            onExtendPublication(target)
          }
        }
      : undefined)

  const sharedAdvertisementProps = {
    advertisement,
    onCompleteAdvertisement,
    onViewStatisticsClick,
    onPreviewAdvertisement,
    onPreviewPublication,
    onExtendPublication,
    onExtendPublications: onExtendAll,
    showPreviewLink: false as const,
    periodPresentation: 'text' as const,
    publicationHover,
    publicationChannelDecoration: 'plain' as const,
    publicationDropdownPlacement: 'top-start' as const,
    publicationPresentation: 'simplify9' as const,
    className,
  }

  if (isDraftAdvertisement(advertisement)) {
    return <JobCardAdvertisement {...sharedAdvertisementProps} />
  }

  if (publications.length === 0) {
    return <JobCardAdvertisement {...sharedAdvertisementProps} />
  }

  const mode = resolveJobCardSimplify10PanelMode(advertisement)
  const panel = renderSimplify10Panel(
    mode,
    {
      advertisement,
      onPreviewPublication,
      onExtendPublication,
      onDeclineAdvertising,
      onRepublishAdvertisement,
      publicationHover,
      channelLogoSize,
      showPortalPeriodBadges,
      expiredLogosMuted,
      actionButtonVariant,
      actionButtonSize,
    },
    onExtendAll,
    publicationHover,
  )

  if (panel) {
    return (
      <div
        data-testid="job-card-advertisement"
        className={cn('tm-flex tm-flex-col tm-gap-3', className)}
      >
        {panel}
      </div>
    )
  }

  return <JobCardAdvertisement {...sharedAdvertisementProps} />
}

JobCardAdvertisementSimplify10Panel.displayName = 'JobCardAdvertisementSimplify10Panel'
