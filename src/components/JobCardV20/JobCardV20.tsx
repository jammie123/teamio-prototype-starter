import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'
import { Card } from '../Card'
import { Link } from '../Link'
import { AdvertisementEmptyState } from './AdvertisementEmptyState'
import { AdvertisementStats } from './AdvertisementStats'
import { AdvertisementWidget } from './AdvertisementWidget'
import { JobAssignee } from './JobAssignee'
import { buildAdvertisementModel } from './lib/advertisementModel'
import { JobCardActions } from './JobCardActions'
import { buildJobCardMenuSections, type JobCardMenuHandlers } from './jobCardMenu'
import { JobNote } from './JobNote'
import { JobPipeline } from './JobPipeline'
import type {
  JobAdvertisement,
  JobCandidateStat,
  JobCardAction,
  JobCardCandidates,
  JobCardNote,
  JobStatus,
} from './types'

export interface JobCardV20Props
  extends StyleProps,
    JobCardMenuHandlers,
    Omit<HTMLAttributes<HTMLElement>, 'color' | 'title'> {
  title: string
  /** Prezentační jednotka, zobrazená za názvem náboru. */
  department?: string
  owner?: string
  hiringManagers?: string[]
  status?: JobStatus
  candidates?: JobCardCandidates
  onCandidatesClick?: (stat: JobCandidateStat) => void
  advertisements?: JobAdvertisement[]
  showAdditionalAdvertisementsLink?: boolean
  onAdditionalAdvertisementsClick?: () => void
  showAdvertisementTitle?: boolean
  /** Show the advertisement status label. Warning and ended always show it. */
  showAdvertisementHeadingLabel?: boolean
  /** Poznámka k náboru, pod pipeline v levém sloupci. */
  note?: JobCardNote
  onExpandNote?: () => void
  actions?: JobCardAction[]
  /** Reference date for "Brzy končí"; defaults to today. */
  now?: Date
  onViewStatisticsClick?: () => void
  onAdvertisementDetailClick?: () => void
  onAdvertisementPreviewClick?: () => void
}

/** An unpublished job keeps its advertisements, but every portal counts as ended. */
function asEndedAdvertisement(advertisement: JobAdvertisement): JobAdvertisement {
  return {
    ...advertisement,
    publications: advertisement.publications?.map((publication) => ({
      ...publication,
      status: 'expired' as const,
      highlights: publication.highlights?.map((highlight) => ({
        ...highlight,
        status: 'expired' as const,
      })),
    })),
  }
}

export const JobCardV20 = forwardRef<HTMLElement, JobCardV20Props>(function JobCardV20(
  {
    title,
    department,
    owner,
    hiringManagers,
    status = 'published',
    candidates,
    onCandidatesClick,
    advertisements = [],
    showAdditionalAdvertisementsLink = false,
    onAdditionalAdvertisementsClick,
    showAdvertisementTitle = false,
    showAdvertisementHeadingLabel = false,
    note,
    onExpandNote,
    actions,
    onCreateAdvertisement,
    onEditJob,
    onDuplicateJob,
    onInviteColleagues,
    onTransferJob,
    onArchiveJob,
    onEditAdvertisement,
    onExtendAndRepublish,
    onEndPublication,
    onHighlightAdvertisement,
    onTopAdvertisement,
    onViewStatisticsClick,
    onAdvertisementDetailClick,
    onAdvertisementPreviewClick,
    now,
    className,
    ...rest
  },
  ref,
) {
  const menuSections = buildJobCardMenuSections({
    advertisements,
    actions,
    onEditJob,
    onDuplicateJob,
    onInviteColleagues,
    onTransferJob,
    onArchiveJob,
    onEditAdvertisement,
    onExtendAndRepublish,
    onEndPublication,
    onHighlightAdvertisement,
    onTopAdvertisement,
    onCreateAdvertisement,
  })

  const showAdvertisements = status === 'published' || status === 'unpublished'
  const shownAdvertisements =
    status === 'unpublished' ? advertisements.map(asEndedAdvertisement) : advertisements
  const collapseToFirstAd = showAdditionalAdvertisementsLink && shownAdvertisements.length > 1
  const visibleAdvertisements = collapseToFirstAd
    ? shownAdvertisements.slice(0, 1)
    : shownAdvertisements
  const additionalAdvertisementsCount = shownAdvertisements.length - 1
  const statsAdvertisement = visibleAdvertisements[0]
  const statsModel = statsAdvertisement
    ? buildAdvertisementModel(statsAdvertisement, now)
    : undefined
  const isUnpublishedPromo =
    shownAdvertisements.length === 0 || statsModel?.kind === 'notPublished'
  const isMuted = status === 'unpublished' || statsModel?.kind === 'ended'

  return (
    <Card
      as="article"
      ref={ref}
      data-testid="job-card"
      data-variant="v20"
      className={cn(
        'tm-flex',
        'tm-flex-col',
        '!tm-p-0',
        isMuted && '!tm-bg-white/70',
        className,
      )}
      {...rest}
    >
      <div
        data-testid="job-card-layout-row"
        className="tm-flex tm-w-full tm-flex-col tm-items-stretch md:tm-flex-row"
      >
        <div className="tm-grid tm-min-w-0 tm-flex-1 tm-grid-cols-[minmax(0,1fr)_auto] tm-gap-3 tm-px-6 tm-py-6 md:tm-flex md:tm-gap-2 md:tm-px-4">
          {menuSections.length ? (
            <JobCardActions
              sections={menuSections}
              label="Akce nad náborem a inzerátem"
              testId="job-card-actions-toggle"
              className="tm-col-start-2 tm-row-start-1 tm-shrink-0 tm-self-start tm-border-0 tm-border-l tm-border-solid tm-border-secondary tm-pl-3 md:tm-border-l-0 md:tm-pl-0"
            />
          ) : null}
          <div
            data-testid="job-card-main"
            className="tm-col-start-1 tm-row-start-1 tm-flex tm-min-w-0 tm-flex-1 tm-flex-col tm-gap-4"
          >
            <div
              data-testid="job-card-title-heading-row"
              className="tm-flex tm-min-w-0 tm-w-full tm-items-start tm-gap-3"
            >
              <div className="tm-flex tm-min-w-0 tm-flex-1 tm-flex-wrap tm-items-baseline tm-gap-x-2">
                <h3
                  data-testid="job-card-title"
                  className="tm-mb-0 tm-min-w-0 tm-text-lg tm-font-medium tm-leading-tight tm-text-teamio-blue"
                >
                  {title}
                </h3>
                {department ? (
                  <span className="tm-inline-flex tm-items-baseline tm-gap-x-2">
                    <span
                      data-testid="job-card-department-separator"
                      className="tm-text-sm tm-text-secondary-default"
                      aria-hidden
                    >
                      ·
                    </span>
                    <span
                      data-testid="job-card-department"
                      className="tm-text-sm tm-text-secondary-default"
                    >
                      {department}
                    </span>
                  </span>
                ) : null}
              </div>
              <JobAssignee
                owner={owner}
                hiringManagers={hiringManagers}
                onInviteMore={onInviteColleagues}
                className="tm-ml-auto tm-shrink-0"
              />
            </div>
            {candidates ? (
              <div data-testid="job-card-pipeline" className="tm-shrink-0">
                <JobPipeline candidates={candidates} onStatClick={onCandidatesClick} />
              </div>
            ) : null}
            {note ? <JobNote note={note} onExpand={onExpandNote} className="tm-w-full" /> : null}
          </div>
        </div>

        {showAdvertisements ? (
          <div
            data-testid="job-card-advertisements"
            className={cn(
              'tm-flex tm-w-full tm-shrink-0 tm-flex-row tm-items-start tm-border-0 tm-border-t tm-border-solid tm-border-secondary tm-px-6 tm-py-6 md:tm-w-[350px] md:tm-flex-col md:tm-items-stretch md:tm-border-t-0 md:tm-border-l',
              isUnpublishedPromo && 'tm-bg-emotion-info-background',
            )}
          >
            {shownAdvertisements.length === 0 ? (
              <AdvertisementEmptyState onCreateAdvertisement={onCreateAdvertisement} />
            ) : (
              <>
                <div className="tm-flex tm-min-w-0 tm-w-full tm-flex-1 tm-flex-col">
                  {visibleAdvertisements.map((advertisement, index) => (
                    <AdvertisementWidget
                      key={`${advertisement.id}-${status}`}
                      advertisement={advertisement}
                      showTitle={showAdvertisementTitle}
                      showHeadingLabel={showAdvertisementHeadingLabel}
                      now={now}
                      hideTopBorder={index === 0}
                      onProlong={onExtendAndRepublish}
                      onAdvertisementPreviewClick={onAdvertisementPreviewClick}
                      onHighlightAdvertisement={onHighlightAdvertisement}
                      onCreateAdvertisement={onCreateAdvertisement}
                    />
                  ))}
                  {collapseToFirstAd ? (
                    <Link
                      className="tm-pt-3 tm-text-sm"
                      data-testid="job-card-additional-advertisements"
                      onClick={onAdditionalAdvertisementsClick}
                    >
                      {`Zobrazit další inzeráty (${additionalAdvertisementsCount})`}
                    </Link>
                  ) : null}
                </div>
                {statsModel && statsModel.kind !== 'notPublished' ? (
                  <AdvertisementStats
                    viewCount={statsModel.viewCount}
                    onStatistics={onViewStatisticsClick}
                    onDetail={onAdvertisementDetailClick}
                  />
                ) : null}
              </>
            )}
          </div>
        ) : null}
      </div>
    </Card>
  )
})

JobCardV20.displayName = 'JobCardV20'
