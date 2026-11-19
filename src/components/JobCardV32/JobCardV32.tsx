import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'
import { Card } from '../Card'
import { IconButton } from '../IconButton'
import { JobMenu } from '../JobMenu'
import type { JobCardMenuHandlers } from '../JobShared/jobCardMenu'
import { JobCardAdvertisements } from './JobCardAdvertisements'
import { JobCardDraftMeta } from './JobCardDraftMeta'
import { JobCardHeader } from './JobCardHeader'
import { buildJobCardAdvertisements } from './lib/jobCardAdvertisements'
import { JobNote } from './JobNote'
import { JobPipeline } from './JobPipeline'
import type { JobAdvertisement, JobCandidateStat, JobCardCandidates, JobCardNote, JobStatus } from './types'

export interface JobCardV32Props
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
 * Listing card for one recruitment (V32): title, assignees and actions,
 * advertisement status under the title, candidate pipeline on the right,
 * optional note underneath.
 */
export const JobCardV32 = forwardRef<HTMLElement, JobCardV32Props>(function JobCardV32(
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

  return (
    <Card
      as="article"
      ref={ref}
      data-testid="job-card"
      data-variant="v32"
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
            isDraft ? 'tm-items-center tm-py-3' : 'tm-py-6',
          )}
        >
          <div
            data-testid="job-card-main"
            className={cn(
              'tm-flex tm-min-w-0 tm-flex-1',
              isDraft
                ? 'tm-flex-col tm-items-stretch md:tm-flex-row md:tm-items-center'
                : 'tm-flex-col tm-gap-4',
            )}
          >
            <JobCardHeader
              title={title}
              department={department}
              owner={owner}
              hiringManagers={hiringManagers}
              onInviteColleagues={onInviteColleagues}
              isDraft={isDraft}
              actions={
                <>
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
              }
            />
            {isDraft ? (
              <JobCardDraftMeta lastChanged={lastChanged} onCompleteDraft={onCompleteDraft} />
            ) : (
              <>
                <div
                  data-testid="job-card-advertisement-row"
                  className="tm-flex tm-w-full tm-flex-col tm-items-stretch tm-gap-4 md:tm-flex-row md:tm-items-start"
                >
                  <JobCardAdvertisements
                    advertisements={advertisementColumn.advertisements}
                    stats={advertisementColumn.stats}
                    showAdvertisementTitle={showAdvertisementTitle}
                    now={now}
                    onExtendAndRepublish={onExtendAndRepublish}
                    onViewStatisticsClick={onViewStatisticsClick}
                    onAdvertisementDetailClick={onAdvertisementDetailClick}
                    onAdvertisementPreviewClick={onAdvertisementPreviewClick}
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
      </div>
    </Card>
  )
})

JobCardV32.displayName = 'JobCardV32'
