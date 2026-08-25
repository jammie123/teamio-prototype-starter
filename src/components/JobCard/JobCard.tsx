import { forwardRef, useEffect, useState, type HTMLAttributes } from 'react'
import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'
import { Card } from '../Card'
import { Link } from '../Link'
import { Typography } from '../Typography'
import { JobCardActions } from './JobCardActions'
import { JobCardAdvertisement } from './JobCardAdvertisement'
import { JobCardStatus } from './JobCardStatus'
import { JobCardStats } from './JobCardStats'
import { buildJobCardMenuSections, type JobCardMenuHandlers } from './jobCardMenu'
import type {
  JobAdvertisement,
  JobCandidateStat,
  JobCardAction,
  JobCardCandidates,
  JobCardSelectableStatus,
  JobStatus,
} from './types'

export interface JobCardProps
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
  /** When true and there is more than one ad, show only the first ad plus a footer link. Default false. */
  showAdditionalAdvertisementsLink?: boolean
  onAdditionalAdvertisementsClick?: () => void
  /** When false, advertisement titles are hidden. Default true. */
  showAdvertisementTitle?: boolean
  /** Extra job actions appended after the built-in ones. */
  actions?: JobCardAction[]
  onStatusChange?: (status: JobCardSelectableStatus) => void
  onCompleteDraft?: () => void
  onGoToPublish?: () => void
  onRestoreFromArchive?: () => void
}

/** An unpublished job has no live advertising, so every portal is shown as ended. */
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

export const JobCard = forwardRef<HTMLElement, JobCardProps>(function JobCard(
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
    showAdvertisementTitle = true,
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
    onStatusChange,
    onCompleteDraft,
    onGoToPublish,
    onRestoreFromArchive,
    className,
    ...rest
  },
  ref,
) {
  const [currentStatus, setCurrentStatus] = useState<JobStatus>(status)

  useEffect(() => {
    setCurrentStatus(status)
  }, [status])

  function changeStatus(nextStatus: JobCardSelectableStatus) {
    setCurrentStatus(nextStatus)
    onStatusChange?.(nextStatus)
  }

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

  const showAdvertisements = currentStatus === 'published' || currentStatus === 'unpublished'
  const shownAdvertisements =
    currentStatus === 'unpublished' ? advertisements.map(asEndedAdvertisement) : advertisements
  const additionalAdvertisementsCount = shownAdvertisements.length - 1
  const collapseToFirstAd =
    showAdditionalAdvertisementsLink && shownAdvertisements.length > 1
  const visibleAdvertisements = collapseToFirstAd
    ? shownAdvertisements.slice(0, 1)
    : shownAdvertisements

  return (
    <Card
      as="article"
      ref={ref}
      data-testid="job-card"
      className={cn('tm-flex', 'tm-flex-col', 'tm-gap-4', className)}
      {...rest}
    >
      <div className="tm-flex tm-flex-wrap tm-items-start tm-justify-between tm-gap-3">
        <div className="tm-min-w-[12rem] tm-flex-1">
          <Typography variant="h3" className="tm-mb-1 tm-text-teamio-blue">
            {title}
          </Typography>
          {owner || hiringManagers?.length ? (
            <div className="tm-flex tm-flex-wrap tm-items-center tm-gap-x-4 tm-gap-y-1 tm-text-sm tm-text-secondary-default">
              {owner ? <span data-testid="job-card-owner">{owner}</span> : null}
              {hiringManagers?.length ? (
                <span data-testid="job-card-hiring-managers">{hiringManagers.join(', ')}</span>
              ) : null}
            </div>
          ) : null}
        </div>

        <div className="tm-flex tm-flex-none tm-items-center tm-gap-2">
          <JobCardStatus
            status={currentStatus}
            onStatusChange={changeStatus}
            onCompleteDraft={onCompleteDraft}
            onGoToPublish={onGoToPublish}
            onRestoreFromArchive={onRestoreFromArchive}
          />
          {menuSections.length ? (
            <JobCardActions
              sections={menuSections}
              label="Akce nad náborem a inzerátem"
              testId="job-card-actions-toggle"
            />
          ) : null}
        </div>
      </div>

      {candidates ? (
        <JobCardStats candidates={candidates} onStatClick={onCandidatesClick} />
      ) : null}

      {showAdvertisements ? (
        <div data-testid="job-card-advertisements">
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
            <div className="tm-flex tm-flex-col tm-gap-3">
              {visibleAdvertisements.map((advertisement) => (
                <JobCardAdvertisement
                  key={`${advertisement.id}-${currentStatus}`}
                  advertisement={advertisement}
                  showTitle={showAdvertisementTitle}
                />
              ))}
              {collapseToFirstAd ? (
                <Link
                  className="tm-text-sm"
                  data-testid="job-card-additional-advertisements"
                  onClick={onAdditionalAdvertisementsClick}
                >
                  {`Zobrazit další inzeráty (${additionalAdvertisementsCount})`}
                </Link>
              ) : null}
            </div>
          )}
        </div>
      ) : null}
    </Card>
  )
})

JobCard.displayName = 'JobCard'
