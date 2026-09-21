import { forwardRef, useState, type HTMLAttributes } from 'react'
import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'
import { Card } from '../Card'
import { Icon } from '../Icon'
import { JobCardActions } from '../JobCardSynteza/JobCardActions'
import { JobCardActivity } from '../JobCardSynteza/JobCardActivity'
import { buildJobCardPeople, JobCardPeople } from '../JobCardSynteza/JobCardPeople'
import { buildJobCardMenuSections, type JobCardMenuHandlers } from '../JobCardSynteza/jobCardMenu'
import { JobCardAdvertisement } from '../JobCardSyntezaAds/JobCardAdvertisement'
import { JobCardStats } from '../JobCardSyntezaPipeline/JobCardStats'
import type {
  JobAdvertisement,
  JobCandidateStat,
  JobCardAction,
  JobCardActivity as JobCardActivityItem,
  JobCardCandidates,
  JobCardNote,
  JobPublication,
} from '../JobCardSyntezaPipeline/types'
import { Link } from '../Link'
import { Note } from '../Note'
import { Typography } from '../Typography'
import { JobCardAdvertisementBatch } from './JobCardAdvertisementBatch'

export interface JobCardSyntezaMoreAdsProps
  extends StyleProps,
    JobCardMenuHandlers,
    Omit<HTMLAttributes<HTMLElement>, 'color' | 'title'> {
  title: string
  owner?: string
  hiringManagers?: string[]
  candidates?: JobCardCandidates
  onCandidatesClick?: (stat: JobCandidateStat) => void
  advertisements?: JobAdvertisement[]
  defaultOpenedAdvertisementId?: string
  note?: JobCardNote
  onExpandNote?: () => void
  /** Extra job actions appended after the built-in ones. */
  actions?: JobCardAction[]
  activities?: JobCardActivityItem[]
  onActivityClick?: (activity: JobCardActivityItem) => void
  onViewStatisticsClick?: () => void
  onPreviewAdvertisement?: () => void
  onPreviewPublication?: (publication: JobPublication) => void
  onExtendPublication?: (publication: JobPublication) => void
  onCompleteAdvertisement?: (advertisement: JobAdvertisement) => void
}

export const JobCardSyntezaMoreAds = forwardRef<HTMLElement, JobCardSyntezaMoreAdsProps>(
  function JobCardSyntezaMoreAds(
    {
      title,
      owner,
      hiringManagers,
      candidates,
      onCandidatesClick,
      advertisements = [],
      defaultOpenedAdvertisementId,
      note,
      onExpandNote,
      actions,
      activities,
      onActivityClick,
      onCreateAdvertisement,
      onEditJob,
      onDuplicateJob,
      onInviteColleagues,
      onTransferJob,
      onArchiveJob,
      onEditAdvertisement,
      onExtendAndRepublish,
      onEndPublication,
      onViewStatisticsClick,
      onPreviewAdvertisement,
      onPreviewPublication,
      onExtendPublication,
      onCompleteAdvertisement,
      className,
      ...rest
    },
    ref,
  ) {
    const [openedAdvertisementId, setOpenedAdvertisementId] = useState<string | null>(
      defaultOpenedAdvertisementId ?? null,
    )

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

    const hasBatch = advertisements.length > 1
    const openedAdvertisement = hasBatch
      ? advertisements.find((advertisement) => advertisement.id === openedAdvertisementId)
      : advertisements[0]

    function renderAdvertisements() {
      if (advertisements.length === 0) {
        return (
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
        )
      }

      if (hasBatch && !openedAdvertisement) {
        return (
          <JobCardAdvertisementBatch
            advertisements={advertisements}
            onSelect={(advertisement) => {
              queueMicrotask(() => setOpenedAdvertisementId(advertisement.id))
            }}
          />
        )
      }

      if (!openedAdvertisement) {
        return null
      }

      return (
        <div className="tm-flex tm-flex-col tm-gap-2">
          {hasBatch ? (
            <Link
              className="tm-inline-flex tm-items-center tm-gap-1 tm-text-sm"
              data-testid="job-card-advertisement-batch-back"
              onClick={(event) => {
                event.preventDefault()
                event.stopPropagation()
                queueMicrotask(() => setOpenedAdvertisementId(null))
              }}
            >
              <Icon name="chevron-left" />
              Zpět na běžící inzerci
            </Link>
          ) : null}
          <JobCardAdvertisement
            key={openedAdvertisement.id}
            advertisement={openedAdvertisement}
            onCompleteAdvertisement={onCompleteAdvertisement}
            onViewStatisticsClick={onViewStatisticsClick}
            onPreviewAdvertisement={onPreviewAdvertisement}
            onPreviewPublication={onPreviewPublication}
            onExtendPublication={
              onExtendPublication ??
              (onExtendAndRepublish ? () => onExtendAndRepublish() : undefined)
            }
          />
        </div>
      )
    }

    return (
      <Card
        as="article"
        ref={ref}
        data-testid="job-card"
        className={cn('tm-flex', 'tm-flex-col', '!tm-p-0', className)}
        {...rest}
      >
        <div
          data-testid="job-card-layout"
          className="tm-flex tm-flex-col tm-gap-4 md:tm-flex-row md:tm-items-stretch md:tm-gap-0"
        >
          <div data-testid="job-card-recruitment" className="tm-min-w-0 tm-p-4 md:tm-flex-1">
            <div className="tm-flex tm-flex-col tm-gap-2">
              <div
                data-testid="job-card-title-row"
                className="tm-flex tm-items-center tm-justify-between tm-gap-3"
              >
                <Typography
                  variant="h3"
                  className="tm-min-w-0 tm-mb-0 !tm-text-base !tm-font-medium tm-text-teamio-blue"
                >
                  {title}
                </Typography>
                <div className="tm-flex tm-shrink-0 tm-items-center tm-gap-2">
                  {owner || hiringManagers?.length ? (
                    <JobCardPeople people={buildJobCardPeople(owner, hiringManagers)} />
                  ) : null}
                  <div
                    data-testid="job-card-icon-buttons"
                    className="tm-flex tm-items-center tm-gap-0"
                  >
                    <JobCardActivity activities={activities} onActivityClick={onActivityClick} />
                    {menuSections.length ? (
                      <JobCardActions
                        sections={menuSections}
                        label="Akce nad náborem a inzerátem"
                        testId="job-card-actions-toggle"
                      />
                    ) : null}
                  </div>
                </div>
              </div>
              {candidates ? (
                <div
                  data-testid="job-card-candidates"
                  className="tm-flex tm-w-full tm-overflow-hidden tm-rounded tm-border tm-border-solid tm-border-secondary tm-bg-cover-light"
                >
                  <JobCardStats candidates={candidates} onStatClick={onCandidatesClick} />
                </div>
              ) : null}
              {note ? (
                <Note
                  author={note.author}
                  text={note.text}
                  addedAt={note.addedAt}
                  showDate={note.showDate}
                  onExpand={onExpandNote}
                  data-testid="job-card-note"
                />
              ) : null}
            </div>
          </div>

          <div
            data-testid="job-card-advertisements"
            className="tm-w-full tm-min-w-0 tm-p-6 md:tm-w-2/5 md:tm-flex-none md:tm-self-stretch md:tm-border-0 md:tm-border-l md:tm-border-solid md:tm-border-secondary"
          >
            {renderAdvertisements()}
          </div>
        </div>
      </Card>
    )
  },
)

JobCardSyntezaMoreAds.displayName = 'JobCardSyntezaMoreAds'
