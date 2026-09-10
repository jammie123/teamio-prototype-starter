import { forwardRef, useEffect, useState, type HTMLAttributes } from 'react'
import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'
import { Card } from '../Card'
import { Link } from '../Link'
import { Note } from '../Note'
import { Typography } from '../Typography'
import { JobCardActions } from './JobCardActions'
import { JobCardActivity } from './JobCardActivity'
import { JobCardAdvertisement } from './JobCardAdvertisement'
import { JobCardAdvertisementSwitcher } from './JobCardAdvertisementSwitcher'
import { buildJobCardPeople, JobCardPeople } from './JobCardPeople'
import { JobCardStats } from './JobCardStats'
import { buildJobCardMenuSections, type JobCardMenuHandlers } from './jobCardMenu'
import type {
  JobAdvertisement,
  JobCandidateStat,
  JobCardAction,
  JobCardActivity as JobCardActivityItem,
  JobCardCandidates,
  JobCardNote,
  JobPublication,
} from './types'

export interface JobCardSyntezaProps
  extends StyleProps,
    JobCardMenuHandlers,
    Omit<HTMLAttributes<HTMLElement>, 'color' | 'title'> {
  title: string
  owner?: string
  hiringManagers?: string[]
  candidates?: JobCardCandidates
  onCandidatesClick?: (stat: JobCandidateStat) => void
  advertisements?: JobAdvertisement[]
  note?: JobCardNote
  onExpandNote?: () => void
  /** Extra job actions appended after the built-in ones. */
  actions?: JobCardAction[]
  activities?: JobCardActivityItem[]
  onActivityClick?: (activity: JobCardActivityItem) => void
  onViewStatisticsClick?: () => void
  onPreviewPublication?: (publication: JobPublication) => void
  onExtendPublication?: (publication: JobPublication) => void
}

export const JobCardSynteza = forwardRef<HTMLElement, JobCardSyntezaProps>(function JobCardSynteza(
  {
    title,
    owner,
    hiringManagers,
    candidates,
    onCandidatesClick,
    advertisements = [],
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
    onPreviewPublication,
    onExtendPublication,
    className,
    ...rest
  },
  ref,
) {
  const [selectedAdIndex, setSelectedAdIndex] = useState(0)
  const advertisementKey = advertisements.map((advertisement) => advertisement.id).join('|')

  useEffect(() => {
    setSelectedAdIndex(0)
  }, [advertisementKey])

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

  const selectedAdvertisement = advertisements[selectedAdIndex]
  const hasSwitcher = advertisements.length > 1

  function selectPreviousAdvertisement() {
    setSelectedAdIndex((current) =>
      current === 0 ? advertisements.length - 1 : current - 1,
    )
  }

  function selectNextAdvertisement() {
    setSelectedAdIndex((current) =>
      current === advertisements.length - 1 ? 0 : current + 1,
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
          className="tm-min-w-0 md:tm-flex-1"
        >
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
            className="tm-w-full tm-min-w-0 md:tm-w-2/5 md:tm-flex-none md:tm-border-0 md:tm-border-l md:tm-border-solid md:tm-border-secondary md:tm-pl-6"
          >
              {advertisements.length === 0 ? (
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
                      total={advertisements.length}
                      onPrev={selectPreviousAdvertisement}
                      onNext={selectNextAdvertisement}
                    />
                  ) : null}
                  <JobCardAdvertisement
                    key={selectedAdvertisement.id}
                    advertisement={selectedAdvertisement}
                    onViewStatisticsClick={onViewStatisticsClick}
                    onPreviewPublication={onPreviewPublication}
                    onExtendPublication={
                      onExtendPublication ??
                      (onExtendAndRepublish ? () => onExtendAndRepublish() : undefined)
                    }
                  />
                </div>
              ) : null}
            </div>
      </div>
    </Card>
  )
})

JobCardSynteza.displayName = 'JobCardSynteza'
