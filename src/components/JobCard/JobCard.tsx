import { forwardRef, useEffect, useState, type HTMLAttributes } from 'react'
import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'
import { Card } from '../Card'
import { Link } from '../Link'
import { Typography } from '../Typography'
import { JobCardActions } from './JobCardActions'
import { JobCardAdvertisement } from './JobCardAdvertisement'
import { JobCardAdvertisementSwitcher } from './JobCardAdvertisementSwitcher'
import { JobCardStatus } from './JobCardStatus'
import { buildJobCardPeople, JobCardPeople } from './JobCardPeople'
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
  /** Extra job actions appended after the built-in ones. */
  actions?: JobCardAction[]
  onStatusChange?: (status: JobCardSelectableStatus) => void
  onCompleteDraft?: () => void
  onGoToPublish?: () => void
  onRestoreFromArchive?: () => void
  onViewStatisticsClick?: () => void
}

/** An unpublished job has no live advertising, so every portal is shown as ended. */
function asEndedAdvertisement(advertisement: JobAdvertisement): JobAdvertisement {
  return {
    ...advertisement,
    publications: advertisement.publications?.map((publication) => ({
      ...publication,
      status: 'expired' as const,
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
    onStatusChange,
    onCompleteDraft,
    onGoToPublish,
    onRestoreFromArchive,
    onViewStatisticsClick,
    className,
    ...rest
  },
  ref,
) {
  const [currentStatus, setCurrentStatus] = useState<JobStatus>(status)
  const [selectedAdIndex, setSelectedAdIndex] = useState(0)

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
    onCreateAdvertisement,
  })

  const showAdvertisements = currentStatus === 'published' || currentStatus === 'unpublished'
  const shownAdvertisements =
    currentStatus === 'unpublished' ? advertisements.map(asEndedAdvertisement) : advertisements
  const advertisementKey = shownAdvertisements.map((advertisement) => advertisement.id).join('|')

  useEffect(() => {
    setSelectedAdIndex(0)
  }, [advertisementKey])

  const selectedAdvertisement = shownAdvertisements[selectedAdIndex]
  const hasSwitcher = shownAdvertisements.length > 1

  function selectPreviousAdvertisement() {
    setSelectedAdIndex((current) =>
      current === 0 ? shownAdvertisements.length - 1 : current - 1,
    )
  }

  function selectNextAdvertisement() {
    setSelectedAdIndex((current) =>
      current === shownAdvertisements.length - 1 ? 0 : current + 1,
    )
  }

  return (
    <Card
      as="article"
      ref={ref}
      data-testid="job-card"
      className={cn('tm-flex', 'tm-flex-col', className)}
      {...rest}
    >
      <div
        data-testid="job-card-layout"
        className="tm-flex tm-flex-col tm-gap-4 md:tm-flex-row md:tm-items-start md:tm-gap-4"
      >
        <div
          data-testid="job-card-recruitment"
          className="tm-min-w-0 md:tm-w-[400px] md:tm-min-w-[350px] md:tm-flex-none"
        >
          <div className="tm-flex tm-items-start tm-gap-2">
            {menuSections.length ? (
              <JobCardActions
                sections={menuSections}
                label="Akce nad náborem a inzerátem"
                testId="job-card-actions-toggle"
              />
            ) : null}

            <div className="tm-min-w-0 tm-flex-1">
              <div className="tm-flex tm-items-start tm-justify-between tm-gap-3">
                <Typography
                  variant="h3"
                  className="tm-mb-1 !tm-text-base !tm-font-medium tm-text-teamio-blue"
                >
                  {title}
                </Typography>
                {currentStatus === 'draft' ||
                currentStatus === 'active' ||
                currentStatus === 'archived' ? (
                  <JobCardStatus
                    status={currentStatus}
                    onStatusChange={changeStatus}
                    onCompleteDraft={onCompleteDraft}
                    onGoToPublish={onGoToPublish}
                    onRestoreFromArchive={onRestoreFromArchive}
                  />
                ) : null}
              </div>
              {owner || hiringManagers?.length ? (
                <JobCardPeople people={buildJobCardPeople(owner, hiringManagers)} />
              ) : null}
            </div>
          </div>
        </div>

        {candidates ? (
          <div data-testid="job-card-candidates" className="tm-w-full md:tm-w-auto md:tm-flex-none">
            <JobCardStats candidates={candidates} onStatClick={onCandidatesClick} />
          </div>
        ) : null}

        {showAdvertisements ? (
          <div
            data-testid="job-card-advertisements"
            className="tm-w-full tm-min-w-0 md:tm-ml-auto md:tm-w-1/3 md:tm-flex-none md:tm-border-0 md:tm-border-l md:tm-border-solid md:tm-border-secondary md:tm-pl-6"
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
            ) : selectedAdvertisement ? (
              <div className="tm-flex tm-flex-col tm-gap-2">
                {hasSwitcher ? (
                  <JobCardAdvertisementSwitcher
                    title={selectedAdvertisement.title ?? `Inzerát ${selectedAdIndex + 1}`}
                    index={selectedAdIndex}
                    total={shownAdvertisements.length}
                    onPrev={selectPreviousAdvertisement}
                    onNext={selectNextAdvertisement}
                  />
                ) : null}
                <JobCardAdvertisement
                  key={`${selectedAdvertisement.id}-${currentStatus}`}
                  advertisement={selectedAdvertisement}
                  onViewStatisticsClick={onViewStatisticsClick}
                />
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </Card>
  )
})

JobCard.displayName = 'JobCard'
