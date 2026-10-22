import { forwardRef, useEffect, useState, type HTMLAttributes } from 'react'
import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'
import { Button } from '../Button'
import { Card } from '../Card'
import { buildJobCardPeople, JobCardPeople } from '../JobCardSynteza/JobCardPeople'
import type { JobCardMenuHandlers } from '../JobCardSynteza/jobCardMenu'
import { JobCardAdvertisementSwitcher } from '../JobCardSynteza/JobCardAdvertisementSwitcher'
import { JobCardAdvertisement } from '../JobCardSyntezaAds/JobCardAdvertisement'
import { advertisementSwitcherTitle } from '../JobCardSyntezaAds/advertisementSummaryAds'
import { JobCardPreviewButton } from '../JobCardSimplify/JobCardPreviewButton'
import { JobMenu } from '../JobMenu'
import type {
  JobAdvertisement,
  JobCandidateStat,
  JobCardAction,
  JobCardCandidates,
  JobCardNote,
  JobPublication,
} from '../JobCardSyntezaPipeline/types'
import { Note } from '../Note'
import { Typography } from '../Typography'
import { JobCardBranchInline, type JobCardBranch } from './JobCardBranchInline'
import { JobCardStatsSimplify5 } from './JobCardStatsSimplify5'

export const JOB_CARD_SIMPLIFY_5_PREVIEW_LABEL = 'Zobrazit náhled'

export type { JobCardBranch }

export interface JobCardSimplify5Props
  extends StyleProps,
    JobCardMenuHandlers,
    Omit<HTMLAttributes<HTMLElement>, 'color' | 'title'> {
  title: string
  owner?: string
  hiringManagers?: string[]
  branches?: JobCardBranch[]
  candidates?: JobCardCandidates
  onCandidatesClick?: (stat: JobCandidateStat) => void
  advertisements?: JobAdvertisement[]
  note?: JobCardNote
  onExpandNote?: () => void
  /** Extra job actions appended after the built-in ones. */
  actions?: JobCardAction[]
  onViewStatisticsClick?: () => void
  onPreviewAdvertisement?: () => void
  onPreviewPublication?: (publication: JobPublication) => void
  onExtendPublication?: (publication: JobPublication) => void
  onCompleteAdvertisement?: (advertisement: JobAdvertisement) => void
}

export const JobCardSimplify5 = forwardRef<HTMLElement, JobCardSimplify5Props>(
  function JobCardSimplify5(
    {
      title,
      owner,
      hiringManagers,
      branches,
      candidates,
      onCandidatesClick,
      advertisements = [],
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
      onTopAdvertisement,
      onAddNote,
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
    const [selectedAdIndex, setSelectedAdIndex] = useState(0)
    const advertisementKey = advertisements.map((advertisement) => advertisement.id).join('|')

    useEffect(() => {
      setSelectedAdIndex(0)
    }, [advertisementKey])

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
        className={cn('tm-flex', 'tm-flex-col', '!tm-rounded-xl', '!tm-p-0', className)}
        {...rest}
      >
        <div
          data-testid="job-card-layout"
          className="tm-flex tm-flex-col tm-gap-4 md:tm-flex-row md:tm-items-stretch md:tm-gap-0"
        >
          <div
            data-testid="job-card-recruitment"
            className="tm-min-w-0 tm-p-5 tm-font-normal md:tm-flex-1 md:tm-p-6"
          >
            <div className="tm-flex tm-flex-col tm-gap-2">
              <div
                data-testid="job-card-title-row"
                className="tm-flex tm-min-w-0 tm-flex-wrap tm-items-baseline tm-gap-x-2 tm-gap-y-1"
              >
                <Typography
                  variant="h3"
                  className="tm-mb-0 !tm-text-base !tm-font-normal tm-text-teamio-blue"
                >
                  {title}
                </Typography>
                {branches?.length ? <JobCardBranchInline branches={branches} /> : null}
              </div>
              {candidates ? (
                <div
                  data-testid="job-card-candidates"
                  className="tm-flex tm-w-full tm-overflow-hidden tm-rounded"
                >
                  <JobCardStatsSimplify5
                    candidates={candidates}
                    onStatClick={onCandidatesClick}
                  />
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
            className="tm-relative tm-flex tm-h-full tm-w-full tm-min-w-0 tm-flex-col tm-overflow-visible tm-p-5 md:tm-w-2/5 md:tm-flex-none md:tm-self-stretch md:tm-p-6"
          >
            <div
              data-testid="job-card-ad-toolbar"
              className="tm-mb-3 tm-flex tm-shrink-0 tm-items-center tm-justify-end tm-gap-2"
            >
              {owner || hiringManagers?.length ? (
                <JobCardPeople
                  people={buildJobCardPeople(owner, hiringManagers)}
                  onInviteMore={onInviteColleagues}
                />
              ) : null}
              <div
                data-testid="job-card-icon-buttons"
                className="tm-flex tm-items-center tm-gap-0"
              >
                {advertisements.length > 0 ? (
                  <JobCardPreviewButton
                    label={JOB_CARD_SIMPLIFY_5_PREVIEW_LABEL}
                    onPreviewAdvertisement={onPreviewAdvertisement}
                  />
                ) : null}
                <JobMenu
                  advertisements={advertisements}
                  actions={actions}
                  onEditJob={onEditJob}
                  onDuplicateJob={onDuplicateJob}
                  onInviteColleagues={onInviteColleagues}
                  onTransferJob={onTransferJob}
                  onArchiveJob={onArchiveJob}
                  onEditAdvertisement={onEditAdvertisement}
                  onExtendAndRepublish={onExtendAndRepublish}
                  onEndPublication={onEndPublication}
                  onTopAdvertisement={onTopAdvertisement}
                  onCreateAdvertisement={onCreateAdvertisement}
                  onAddNote={onAddNote}
                  testId="job-card-actions-toggle"
                />
              </div>
            </div>
            <div className="tm-flex tm-min-h-0 tm-flex-1 tm-flex-col tm-justify-end tm-gap-3">
              {advertisements.length === 0 ? (
                <div
                  data-testid="job-card-no-advertisement"
                  className="tm-flex tm-flex-col tm-items-start tm-gap-3 tm-rounded tm-border tm-border-secondary tm-bg-cover-light tm-p-4"
                >
                  <p className="tm-mb-0 tm-text-sm tm-text-secondary-default">
                    Zatím nemáte vytvořený žádný inzerát.
                  </p>
                  {onCreateAdvertisement ? (
                    <Button
                      variant="secondary"
                      size="small"
                      className="!tm-min-h-7 !tm-px-3 !tm-py-1"
                      data-testid="job-card-no-advertisement-create"
                      onClick={(event) => {
                        event.preventDefault()
                        event.stopPropagation()
                        onCreateAdvertisement()
                      }}
                    >
                      Vytvořit inzerát
                    </Button>
                  ) : null}
                </div>
              ) : selectedAdvertisement ? (
                <div
                  data-testid="job-card-advertisement-panel"
                  className="tm-flex tm-flex-col tm-gap-3"
                >
                  {hasSwitcher ? (
                    <JobCardAdvertisementSwitcher
                      title={advertisementSwitcherTitle(selectedAdvertisement, selectedAdIndex)}
                      index={selectedAdIndex}
                      total={advertisements.length}
                      onPrev={selectPreviousAdvertisement}
                      onNext={selectNextAdvertisement}
                    />
                  ) : null}
                  <JobCardAdvertisement
                    key={selectedAdvertisement.id}
                    advertisement={selectedAdvertisement}
                    showPreviewLink={false}
                    periodPresentation="text"
                    publicationHover="placesTable"
                    publicationChannelDecoration="plain"
                    publicationDropdownPlacement="top-start"
                    publicationPresentation="simplify5"
                    onCompleteAdvertisement={onCompleteAdvertisement}
                    onViewStatisticsClick={onViewStatisticsClick}
                    onPreviewAdvertisement={onPreviewAdvertisement}
                    onPreviewPublication={onPreviewPublication}
                    onExtendPublications={onExtendAndRepublish}
                    onExtendPublication={
                      onExtendPublication ??
                      (onExtendAndRepublish ? () => onExtendAndRepublish() : undefined)
                    }
                  />
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </Card>
    )
  },
)

JobCardSimplify5.displayName = 'JobCardSimplify5'
