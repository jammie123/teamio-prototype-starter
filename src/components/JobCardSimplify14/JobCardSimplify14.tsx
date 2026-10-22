import { forwardRef, useState, type HTMLAttributes } from 'react'
import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'
import { Button } from '../Button'
import { Card } from '../Card'
import { Icon } from '../Icon'
import { buildJobCardPeople, JobCardPeople } from '../JobCardSynteza/JobCardPeople'
import type { JobCardMenuHandlers } from '../JobCardSynteza/jobCardMenu'
import { JobCardPreviewButton } from '../JobCardSimplify/JobCardPreviewButton'
import { JobMenu } from '../JobMenu'
import { JobCardAdvertisementBatch } from '../JobCardSyntezaMoreAds/JobCardAdvertisementBatch'
import type {
  JobAdvertisement,
  JobCandidateStat,
  JobCardAction,
  JobCardCandidates,
  JobCardNote,
  JobPublication,
} from '../JobCardSyntezaPipeline/types'
import { Link } from '../Link'
import { Note } from '../Note'
import { Typography } from '../Typography'
import { JobCardBranchInline, type JobCardBranch } from '../JobCardSimplify5/JobCardBranchInline'
import {
  JOB_CARD_SIMPLIFY_8_PREVIEW_LABEL,
  JOB_CARD_SIMPLIFY_8_SECTION_PADDING,
} from '../JobCardSimplify8/JobCardSimplify8'
import { JobCardStatsSimplify8 } from '../JobCardSimplify8/JobCardStatsSimplify8'
import { JobCardAdvertisementSimplify14Panel } from './JobCardAdvertisementSimplify14Panel'
import { resolveJobCardSimplify14PanelMode } from './jobCardSimplify14Presentation'

export const JOB_CARD_SIMPLIFY_14_PREVIEW_LABEL = JOB_CARD_SIMPLIFY_8_PREVIEW_LABEL
export const JOB_CARD_SIMPLIFY_14_SECTION_PADDING = JOB_CARD_SIMPLIFY_8_SECTION_PADDING

export type { JobCardBranch }

export interface JobCardSimplify14Props
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
  /** When several ads exist, pre-open this one instead of the batch list. */
  defaultOpenedAdvertisementId?: string
  note?: JobCardNote
  onExpandNote?: () => void
  /** Extra job actions appended after the built-in ones. */
  actions?: JobCardAction[]
  onViewStatisticsClick?: () => void
  onPreviewAdvertisement?: () => void
  onPreviewPublication?: (publication: JobPublication) => void
  onExtendPublication?: (publication: JobPublication) => void
  onCompleteAdvertisement?: (advertisement: JobAdvertisement) => void
  /** Conscious choice to stop advertising (state 3). */
  onDeclineAdvertising?: () => void
  /** Re-open advertising after notAdvertising (falls back to onExtendAndRepublish). */
  onRepublishAdvertisement?: () => void
  /** Turn a disabled channel back on from the channel detail. */
  onEnablePublication?: (publication: JobPublication) => void
}

export const JobCardSimplify14 = forwardRef<HTMLElement, JobCardSimplify14Props>(
  function JobCardSimplify14(
    {
      title,
      owner,
      hiringManagers,
      branches,
      candidates,
      onCandidatesClick,
      advertisements = [],
      defaultOpenedAdvertisementId,
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
      onDeclineAdvertising,
      onRepublishAdvertisement,
      onEnablePublication,
      className,
      ...rest
    },
    ref,
  ) {
    const hasBatch = advertisements.length > 1
    const [openedAdvertisementId, setOpenedAdvertisementId] = useState<string | null>(
      hasBatch ? (defaultOpenedAdvertisementId ?? null) : (advertisements[0]?.id ?? null),
    )

    const openedAdvertisement = hasBatch
      ? advertisements.find((advertisement) => advertisement.id === openedAdvertisementId)
      : advertisements[0]

    const openedMode = openedAdvertisement
      ? resolveJobCardSimplify14PanelMode(openedAdvertisement)
      : undefined
    const isQuietCard =
      openedAdvertisement?.status === 'notAdvertising' || openedMode === 'allDisabled'

    const advertisementPanelProps = {
      onCompleteAdvertisement,
      onViewStatisticsClick,
      onPreviewAdvertisement,
      onPreviewPublication,
      onExtendPublications: onExtendAndRepublish,
      onExtendPublication:
        onExtendPublication ??
        (onExtendAndRepublish ? () => onExtendAndRepublish() : undefined),
      onDeclineAdvertising,
      onRepublishAdvertisement: onRepublishAdvertisement ?? onExtendAndRepublish,
      onEnablePublication,
    }

    function renderAdvertisements() {
      if (advertisements.length === 0) {
        return (
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
        )
      }

      if (hasBatch && !openedAdvertisement) {
        return (
          <JobCardAdvertisementBatch
            advertisements={advertisements}
            onSelect={(advertisement) => {
              setOpenedAdvertisementId(advertisement.id)
            }}
          />
        )
      }

      if (!openedAdvertisement) {
        return null
      }

      return (
        <div
          data-testid="job-card-advertisement-panel"
          className="tm-flex tm-flex-col tm-gap-3"
        >
          {hasBatch ? (
            <Link
              className="tm-inline-flex tm-items-center tm-gap-1 tm-text-sm"
              data-testid="job-card-advertisement-batch-back"
              onClick={(event) => {
                event.preventDefault()
                event.stopPropagation()
                setOpenedAdvertisementId(null)
              }}
            >
              <Icon name="chevron-left" />
              Zpět na inzeráty
            </Link>
          ) : null}
          <JobCardAdvertisementSimplify14Panel
            key={openedAdvertisement.id}
            advertisement={openedAdvertisement}
            {...advertisementPanelProps}
          />
        </div>
      )
    }

    return (
      <Card
        as="article"
        ref={ref}
        data-testid="job-card"
        data-quiet={isQuietCard ? 'true' : undefined}
        className={cn(
          'tm-flex',
          'tm-flex-col',
          '!tm-rounded-xl',
          '!tm-p-0',
          isQuietCard && 'tm-bg-cover-light',
          className,
        )}
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
              JOB_CARD_SIMPLIFY_14_SECTION_PADDING,
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
                        label={JOB_CARD_SIMPLIFY_14_PREVIEW_LABEL}
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
                  className="tm-flex tm-w-full tm-overflow-hidden tm-rounded"
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
              'tm-relative tm-w-full tm-min-w-0 tm-overflow-visible md:tm-w-2/5 md:tm-flex-none md:tm-self-stretch md:tm-border-0 md:tm-border-l md:tm-border-solid md:tm-border-secondary',
              JOB_CARD_SIMPLIFY_14_SECTION_PADDING,
            )}
          >
            {renderAdvertisements()}
          </div>
        </div>
      </Card>
    )
  },
)

JobCardSimplify14.displayName = 'JobCardSimplify14'
