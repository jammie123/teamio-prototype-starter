import { forwardRef, useEffect, useState, type HTMLAttributes } from 'react'
import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'
import { Button } from '../Button'
import { Card } from '../Card'
import { buildJobCardPeople, JobCardPeople } from '../JobCardSynteza/JobCardPeople'
import type { JobCardMenuHandlers } from '../JobCardSynteza/jobCardMenu'
import { JobCardAdvertisementSwitcher } from '../JobCardSynteza/JobCardAdvertisementSwitcher'
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
import { JobCardBranchInline, type JobCardBranch } from '../JobCardSimplify5/JobCardBranchInline'
import { JobCardStatsSimplify8 } from '../JobCardSimplify8/JobCardStatsSimplify8'
import { JobCardAdvertisementSimplify26Panel } from './JobCardAdvertisementSimplify26Panel'
import {
  JOB_CARD_SIMPLIFY_26_ADVERTISEMENT_HEADING_OFFSET,
  JOB_CARD_SIMPLIFY_26_PREVIEW_LABEL,
  JOB_CARD_SIMPLIFY_26_SECTION_PADDING,
} from './constants'

export type { JobCardBranch }

export interface JobCardSimplify26Props
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
  actions?: JobCardAction[]
  onViewStatisticsClick?: () => void
  onPreviewAdvertisement?: () => void
  onPreviewPublication?: (publication: JobPublication) => void
  onExtendPublication?: (publication: JobPublication) => void
  onCompleteAdvertisement?: (advertisement: JobAdvertisement) => void
  /** Re-open advertising after conscious decline (falls back to onExtendAndRepublish). */
  onRepublishAdvertisement?: () => void
}

export const JobCardSimplify26 = forwardRef<HTMLElement, JobCardSimplify26Props>(
  function JobCardSimplify26(
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
      onRepublishAdvertisement,
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
    const isQuietCard = selectedAdvertisement?.status === 'notAdvertising'

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
        data-variant="simplify-26"
        data-quiet={isQuietCard ? 'true' : undefined}
        className={cn('tm-flex', 'tm-flex-col', '!tm-rounded-xl', '!tm-p-0', className)}
        {...rest}
      >
        <div
          data-testid="job-card-layout"
          className="tm-flex tm-flex-col tm-gap-4 md:tm-flex-row md:tm-items-stretch md:tm-gap-0"
        >
          <div
            data-testid="job-card-recruitment"
            className={cn(
              'tm-min-w-0 tm-font-normal md:tm-flex-1',
              JOB_CARD_SIMPLIFY_26_SECTION_PADDING,
            )}
          >
            <div className="tm-flex tm-flex-col tm-gap-2">
              <div
                data-testid="job-card-title-row"
                className="tm-flex tm-items-center tm-justify-between tm-gap-3"
              >
                <div className="tm-flex tm-min-w-0 tm-flex-wrap tm-items-baseline tm-gap-x-2 tm-gap-y-1">
                  <Typography
                    variant="h3"
                    className="tm-mb-0 !tm-text-base !tm-font-normal tm-text-teamio-blue"
                  >
                    {title}
                  </Typography>
                  {branches?.length ? <JobCardBranchInline branches={branches} /> : null}
                </div>
                <div className="tm-flex tm-shrink-0 tm-items-center tm-gap-2">
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
                        label={JOB_CARD_SIMPLIFY_26_PREVIEW_LABEL}
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
              </div>
              {candidates ? (
                <div
                  data-testid="job-card-candidates"
                  className="tm-mt-3 tm-flex tm-w-full tm-overflow-hidden tm-rounded"
                >
                  <JobCardStatsSimplify8
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
            className={cn(
              'tm-relative tm-w-full tm-min-w-0 tm-overflow-visible md:tm-w-1/2 md:tm-flex-none md:tm-self-stretch md:tm-border-0 md:tm-border-l md:tm-border-solid md:tm-border-secondary',
              JOB_CARD_SIMPLIFY_26_SECTION_PADDING,
            )}
          >
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
                className={cn(
                  'tm-flex tm-flex-col tm-gap-2',
                  JOB_CARD_SIMPLIFY_26_ADVERTISEMENT_HEADING_OFFSET,
                )}
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
                <JobCardAdvertisementSimplify26Panel
                  key={selectedAdvertisement.id}
                  advertisement={selectedAdvertisement}
                  onCompleteAdvertisement={onCompleteAdvertisement}
                  onViewStatisticsClick={onViewStatisticsClick}
                  onPreviewAdvertisement={onPreviewAdvertisement}
                  onPreviewPublication={onPreviewPublication}
                  onExtendPublications={onExtendAndRepublish}
                  onExtendPublication={
                    onExtendPublication ??
                    (onExtendAndRepublish ? () => onExtendAndRepublish() : undefined)
                  }
                  onRepublishAdvertisement={onRepublishAdvertisement ?? onExtendAndRepublish}
                />
              </div>
            ) : null}
          </div>
        </div>
      </Card>
    )
  },
)

JobCardSimplify26.displayName = 'JobCardSimplify26'
