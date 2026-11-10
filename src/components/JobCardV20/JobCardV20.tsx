import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'
import { Card } from '../Card'
import { Link } from '../Link'
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
        className="tm-flex tm-w-full tm-items-stretch"
      >
        <div className="tm-flex tm-min-w-0 tm-flex-1 tm-gap-2 tm-px-4 tm-py-6">
          {menuSections.length ? (
            <JobCardActions
              sections={menuSections}
              label="Akce nad náborem a inzerátem"
              testId="job-card-actions-toggle"
              className="tm-shrink-0 tm-self-start"
            />
          ) : null}
          <div
            data-testid="job-card-main"
            className="tm-flex tm-min-w-0 tm-flex-1 tm-flex-col tm-gap-4"
          >
            <div
              data-testid="job-card-title-heading-row"
              className="tm-flex tm-min-w-0 tm-w-full tm-items-start tm-gap-3"
            >
              <h3
                data-testid="job-card-title"
                className="tm-mb-0 tm-min-w-0 tm-flex-1 tm-text-lg tm-font-medium tm-leading-tight tm-text-teamio-blue"
              >
                {title}
              </h3>
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
            className="tm-flex tm-w-[350px] tm-shrink-0 tm-flex-col tm-border-0 tm-border-l tm-border-solid tm-border-secondary tm-px-6 tm-py-6"
          >
            {shownAdvertisements.length === 0 ? (
              <div
                data-testid="job-card-no-advertisement"
                className="tm-flex tm-flex-wrap tm-items-center tm-gap-x-2 tm-gap-y-1 tm-text-sm tm-text-secondary-default"
              >
                <span>Nábor nemá žádný inzerát.</span>
                {onCreateAdvertisement ? (
                  <Link className="tm-text-sm" onClick={onCreateAdvertisement}>
                    Vytvořit inzerát
                  </Link>
                ) : null}
              </div>
            ) : (
              <>
                {visibleAdvertisements.map((advertisement, index) => (
                  <AdvertisementWidget
                    key={`${advertisement.id}-${status}`}
                    advertisement={advertisement}
                    showTitle={showAdvertisementTitle}
                    showHeadingLabel={showAdvertisementHeadingLabel}
                    now={now}
                    hideTopBorder={index === 0}
                    onProlong={onExtendAndRepublish}
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
                {statsModel ? (
                  <AdvertisementStats
                    viewCount={statsModel.viewCount}
                    onStatistics={onViewStatisticsClick}
                    onDetail={onAdvertisementDetailClick}
                    className="tm-mt-auto"
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
