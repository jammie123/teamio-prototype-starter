import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'
import { Button } from '../Button'
import { Card } from '../Card'
import { Icon } from '../Icon'
import { IconButton } from '../IconButton'
import { JobMenu } from '../JobMenu'
import { Link } from '../Link'
import type { JobCardMenuHandlers } from '../JobShared/jobCardMenu'
import { JobCardAdvertisements } from './JobCardAdvertisements'
import { JobCardDraftMeta } from './JobCardDraftMeta'
import { JobCardHeader } from './JobCardHeader'
import { buildJobCardAdvertisements } from './lib/jobCardAdvertisements'
import { JobNote } from './JobNote'
import { JobPipeline } from './JobPipeline'
import type { JobAdvertisement, JobCandidateStat, JobCardCandidates, JobCardNote, JobStatus } from './types'

export interface JobCardV33Props
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
  showAdvertisementTitle?: boolean
  /** Poznámka k náboru, pod řádkem inzerátu a pipeline. */
  note?: JobCardNote
  onExpandNote?: () => void
  /** Reference date for "Brzy končí"; defaults to today. */
  now?: Date
  onViewStatisticsClick?: () => void
  onAdvertisementDetailClick?: () => void
  onAdvertisementPreviewClick?: () => void
  /** Pre-formatted Czech date shown on a draft (`3. 11. 2026`). */
  lastChanged?: string
  onCompleteDraft?: () => void
}

/**
 * Listing card for one recruitment (V33): title, assignees and actions,
 * advertisement row beside the candidate pipeline, optional note underneath.
 */
export const JobCardV33 = forwardRef<HTMLElement, JobCardV33Props>(function JobCardV33(
  {
    title,
    department,
    owner,
    hiringManagers,
    status = 'published',
    candidates,
    onCandidatesClick,
    advertisements = [],
    showAdvertisementTitle = false,
    note,
    onExpandNote,
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
    lastChanged,
    onCompleteDraft,
    now,
    className,
    ...rest
  },
  ref,
) {
  const isDraft = status === 'draft'
  const advertisementColumn = buildJobCardAdvertisements(status, advertisements, now)
  const stats = advertisementColumn.stats
  const showPublishedStats = !isDraft && stats && stats.kind !== 'notPublished'
  const publicationAction = showPublishedStats
    ? stats.canProlong
      ? 'prolong'
      : stats.kind === 'ended'
        ? 'republish'
        : undefined
    : undefined

  const headerActions: ReactNode = (
    <>
      {showPublishedStats ? (
        <Link
          underlined="never"
          variant="secondary"
          data-testid="job-card-advertisement-detail-action"
          className="tm-inline-flex tm-shrink-0 tm-items-center tm-gap-1 tm-text-sm tm-font-normal"
          onClick={onAdvertisementDetailClick}
        >
          Detail inzerce
          <Icon name="chevron-right" className="tm-text-base tm-leading-none" aria-hidden />
        </Link>
      ) : null}
      {publicationAction === 'prolong' ? (
        <Button
          variant="primary"
          size="small"
          className="!tm-min-h-7 !tm-px-3"
          data-testid="job-card-disappearance-prolong"
          onClick={onExtendAndRepublish}
        >
          Prodloužit
        </Button>
      ) : null}
      {publicationAction === 'republish' ? (
        <Button
          variant="primary"
          size="small"
          className="!tm-min-h-7 !tm-px-3"
          data-testid="job-card-advertisement-republish"
          onClick={onExtendAndRepublish}
        >
          Znovuvystavit
        </Button>
      ) : null}
      {!isDraft && onAdvertisementPreviewClick ? (
        <IconButton
          icon="eye"
          aria-label="Náhled inzerátu"
          tooltip="Náhled"
          data-testid="job-card-preview-action"
          onClick={onAdvertisementPreviewClick}
        />
      ) : null}
      {onEditJob ? (
        <IconButton
          icon="edit"
          aria-label="Editovat nábor"
          tooltip="Editovat"
          data-testid="job-card-edit-action"
          onClick={onEditJob}
        />
      ) : null}
      <JobMenu
        advertisements={isDraft ? undefined : advertisements}
        label="Akce nad náborem a inzerátem"
        testId="job-card-actions-toggle"
        onEditJob={onEditJob}
        onDuplicateJob={onDuplicateJob}
        onInviteColleagues={onInviteColleagues}
        onTransferJob={onTransferJob}
        onArchiveJob={onArchiveJob}
        onExtendAndRepublish={isDraft ? undefined : onExtendAndRepublish}
        onEndPublication={isDraft ? undefined : onEndPublication}
        onTopAdvertisement={isDraft ? undefined : onTopAdvertisement}
      />
    </>
  )

  return (
    <Card
      as="article"
      ref={ref}
      data-testid="job-card"
      data-variant="v33"
      className={cn(
        'tm-flex',
        'tm-flex-col',
        '!tm-p-0',
        advertisementColumn.isMuted && '!tm-bg-basic/50',
        advertisementColumn.isMuted && '!tm-shadow-none',
        className,
      )}
      {...rest}
    >
      <div
        data-testid="job-card-layout-row"
        className="tm-flex tm-w-full tm-flex-col tm-items-stretch"
      >
        <div
          className={cn(
            'tm-flex tm-min-w-0 tm-flex-1 tm-gap-2 tm-px-6',
            isDraft ? 'tm-items-center tm-py-3' : 'tm-flex-col tm-gap-4 tm-py-6',
          )}
        >
          {isDraft ? (
            <div
              data-testid="job-card-main"
              className="tm-flex tm-min-w-0 tm-flex-1 tm-flex-col tm-items-stretch md:tm-flex-row md:tm-items-center"
            >
              <JobCardHeader
                title={title}
                department={department}
                owner={owner}
                hiringManagers={hiringManagers}
                onInviteColleagues={onInviteColleagues}
                isDraft
                actions={headerActions}
              />
              <JobCardDraftMeta lastChanged={lastChanged} onCompleteDraft={onCompleteDraft} />
            </div>
          ) : (
            <>
              <JobCardHeader
                title={title}
                department={department}
                owner={owner}
                hiringManagers={hiringManagers}
                onInviteColleagues={onInviteColleagues}
                actions={headerActions}
              />
              <div
                data-testid="job-card-main"
                className="tm-flex tm-min-w-0 tm-w-full tm-flex-row tm-flex-wrap tm-items-start tm-gap-4"
              >
                <JobCardAdvertisements
                  advertisements={advertisementColumn.advertisements}
                  stats={advertisementColumn.stats}
                  showAdvertisementTitle={showAdvertisementTitle}
                  now={now}
                  onExtendAndRepublish={onExtendAndRepublish}
                  onViewStatisticsClick={onViewStatisticsClick}
                  onAdvertisementPreviewClick={onAdvertisementPreviewClick}
                  onHighlightAdvertisement={onHighlightAdvertisement}
                  onCreateAdvertisement={onCreateAdvertisement}
                  className="tm-min-w-0 tm-flex-1"
                />
                {candidates ? (
                  <div data-testid="job-card-pipeline" className="tm-shrink-0">
                    <JobPipeline candidates={candidates} onStatClick={onCandidatesClick} />
                  </div>
                ) : null}
              </div>
              {note ? <JobNote note={note} onExpand={onExpandNote} className="tm-w-full" /> : null}
            </>
          )}
        </div>
      </div>
    </Card>
  )
})

JobCardV33.displayName = 'JobCardV33'
