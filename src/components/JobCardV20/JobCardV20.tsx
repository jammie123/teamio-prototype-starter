import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'
import { Card } from '../Card'
import { JobCardActions } from './JobCardActions'
import { JobCardAdvertisements } from './JobCardAdvertisements'
import { JobCardDraftMeta } from './JobCardDraftMeta'
import { JobCardHeader } from './JobCardHeader'
import { buildJobCardAdvertisements } from './lib/jobCardAdvertisements'
import { buildJobCardMenuSections, type JobCardMenuHandlers } from './jobCardMenu'
import { JobNote } from './JobNote'
import { JobPipeline } from './JobPipeline'
import type { JobAdvertisement, JobCandidateStat, JobCardCandidates, JobCardNote, JobStatus } from './types'

export interface JobCardV20Props
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
  /** Poznámka k náboru, pod pipeline v levém sloupci. */
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
 * Listing card for one recruitment (V20): title, assignees, candidate pipeline,
 * optional note, and the advertisement column (portals, dates, stats).
 */
export const JobCardV20 = forwardRef<HTMLElement, JobCardV20Props>(function JobCardV20(
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
  const menuSections = buildJobCardMenuSections({
    status,
    advertisements,
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
  const advertisementColumn = buildJobCardAdvertisements(status, advertisements, now)

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
        advertisementColumn.isMuted && '!tm-bg-basic/50',
        advertisementColumn.isMuted && '!tm-shadow-none',
        className,
      )}
      {...rest}
    >
      <div
        data-testid="job-card-layout-row"
        className="tm-flex tm-w-full tm-flex-col tm-items-stretch md:tm-flex-row"
      >
        <div
          className={cn(
            'tm-grid tm-min-w-0 tm-flex-1 tm-grid-cols-[minmax(0,1fr)_auto] tm-gap-3 tm-px-6 md:tm-flex md:tm-gap-2 md:tm-px-4',
            isDraft ? 'tm-items-center tm-py-3' : 'tm-py-6',
          )}
        >
          {menuSections.length ? (
            <JobCardActions
              sections={menuSections}
              className={cn(
                'tm-col-start-2 tm-row-start-1 tm-shrink-0 tm-border-0 tm-border-l tm-border-solid tm-border-secondary tm-pl-3 md:tm-border-l-0 md:tm-pl-0',
                isDraft ? 'tm-self-center' : 'tm-self-start tm--top-1',
              )}
            />
          ) : null}
          <div
            data-testid="job-card-main"
            className={cn(
              'tm-col-start-1 tm-row-start-1 tm-flex tm-min-w-0 tm-flex-1',
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
            />
            {isDraft ? (
              <JobCardDraftMeta lastChanged={lastChanged} onCompleteDraft={onCompleteDraft} />
            ) : (
              <>
                {candidates ? (
                  <div data-testid="job-card-pipeline" className="tm-shrink-0">
                    <JobPipeline candidates={candidates} onStatClick={onCandidatesClick} />
                  </div>
                ) : null}
                {note ? <JobNote note={note} onExpand={onExpandNote} className="tm-w-full" /> : null}
              </>
            )}
          </div>
        </div>

        {isDraft ? null : (
          <JobCardAdvertisements
            advertisements={advertisementColumn.advertisements}
            stats={advertisementColumn.stats}
            showAdvertisementTitle={showAdvertisementTitle}
            now={now}
            onExtendAndRepublish={onExtendAndRepublish}
            onViewStatisticsClick={onViewStatisticsClick}
            onAdvertisementDetailClick={onAdvertisementDetailClick}
            onAdvertisementPreviewClick={onAdvertisementPreviewClick}
            onHighlightAdvertisement={onHighlightAdvertisement}
            onCreateAdvertisement={onCreateAdvertisement}
          />
        )}
      </div>
    </Card>
  )
})

JobCardV20.displayName = 'JobCardV20'
