import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'
import { Card } from '../Card'
import { Checkbox } from '../Checkbox'
import { JobMenu } from '../JobMenu'
import type { JobCardMenuHandlers } from '../JobShared/jobCardMenu'
import { JobCardAdvertisements } from './JobCardAdvertisements'
import { JobCardHeader } from './JobCardHeader'
import { buildJobCardAdvertisements } from './lib/jobCardAdvertisements'
import { JobNote } from './JobNote'
import { JobPipeline } from './JobPipeline'
import type { JobAdvertisement, JobCandidateStat, JobCardCandidates, JobCardNote, JobStatus } from './types'

export interface JobCardV40Props
  extends StyleProps,
    JobCardMenuHandlers,
    Omit<HTMLAttributes<HTMLElement>, 'color' | 'title'> {
  title: string
  /** Prezentační jednotka, zobrazená za názvem náboru. */
  department?: string
  owner?: string
  hiringManagers?: string[]
  /**
   * published = running job, unpublished = ended by the recruiter ("Ukončené vystavování"),
   * archived = "Archivní" pill with ended advertisements, draft = compact row with last change.
   */
  status?: JobStatus
  candidates?: JobCardCandidates
  onCandidatesClick?: (stat: JobCandidateStat) => void
  advertisements?: JobAdvertisement[]
  showAdvertisementTitle?: boolean
  /** Poznámka k náboru, pod pipeline v levém sloupci. */
  note?: JobCardNote
  onExpandNote?: () => void
  /** Reference date for "Brzy končí" and "Expirováno"; defaults to today. */
  now?: Date
  onViewStatisticsClick?: () => void
  onAdvertisementDetailClick?: () => void
  onAdvertisementPreviewClick?: () => void
  /** Pre-formatted Czech date shown on a draft (`3. 11. 2026`). */
  lastChanged?: string
  /**
   * Hiring Manager view: pipeline shows K ohodnocení / Celkem, the advertisement column
   * is hidden, and the note is not shown. Preview stays in the header capsule.
   */
  isHiringManager?: boolean
  /** Shows a leading checkbox so the job can be included in bulk actions. */
  isBulkAction?: boolean
  isSelected?: boolean
  onBulkSelectChange?: (selected: boolean) => void
}

/**
 * Listing card for one recruitment (V40): title, assignees, candidate pipeline,
 * optional note, and the advertisement column (portals, dates, stats; 450px from md up).
 *
 * Advertisement states: running (date only), ending soon, expired up to 30 days ago (highlighted),
 * expired more than 30 days ago (muted) and ended by the recruiter ("Ukončené vystavování", muted).
 */
export const JobCardV40 = forwardRef<HTMLElement, JobCardV40Props>(function JobCardV40(
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
    isHiringManager = false,
    isBulkAction = false,
    isSelected = false,
    onBulkSelectChange,
    now,
    className,
    ...rest
  },
  ref,
) {
  const isDraft = status === 'draft'
  const isArchived = status === 'archived'
  const hasAdvertisementStatus = status === 'published' || status === 'unpublished' || isArchived
  const showAdvertisements = hasAdvertisementStatus && !isHiringManager
  const showAdMenuActions = hasAdvertisementStatus && !isArchived && !isDraft
  const advertisementColumn = buildJobCardAdvertisements(
    hasAdvertisementStatus ? status : 'published',
    hasAdvertisementStatus ? advertisements : [],
    now,
  )
  const isMuted = hasAdvertisementStatus && advertisementColumn.isMuted
  const hasNote = Boolean(note?.text.trim())

  return (
    <Card
      as="article"
      ref={ref}
      data-testid="job-card"
      data-variant="v40"
      className={cn(
        'tm-flex',
        'tm-flex-col',
        '!tm-p-0',
        isMuted && '!tm-bg-basic/50',
        isMuted && '!tm-shadow-none',
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
            'tm-flex tm-min-w-0 tm-flex-1 tm-flex-col tm-gap-3 tm-px-6 md:tm-flex-row md:tm-gap-2 md:tm-px-4',
            isDraft ? 'tm-items-stretch tm-py-3 md:tm-items-center' : 'tm-py-6',
          )}
        >
          <div
            data-testid="job-card-toolbar"
            className={cn(
              'tm-flex tm-w-full tm-shrink-0 tm-items-center tm-justify-end md:tm-contents',
              isDraft ? 'md:tm-self-center' : 'md:tm-self-start',
            )}
          >
            {isBulkAction ? (
              <Checkbox
                data-testid="job-card-bulk-select"
                aria-label={`Vybrat nábor ${title}`}
                checked={isSelected}
                onChange={(event) => onBulkSelectChange?.(event.target.checked)}
                className={cn(
                  'tm-mr-auto tm-shrink-0 md:tm-mr-0',
                  isDraft ? 'tm-self-center' : 'tm-self-start',
                )}
              />
            ) : null}
            <div
              className={cn(
                'tm-flex tm-size-8 tm-shrink-0 tm-items-center tm-justify-center',
                isDraft ? 'tm-self-center' : 'tm-self-start md:tm--top-1',
              )}
            >
              <JobMenu
                advertisements={showAdMenuActions ? advertisements : []}
                label="Akce nad náborem a inzerátem"
                testId="job-card-actions-toggle"
                onEditJob={onEditJob}
                onDuplicateJob={onDuplicateJob}
                onInviteColleagues={onInviteColleagues}
                onTransferJob={onTransferJob}
                onArchiveJob={onArchiveJob}
                onExtendAndRepublish={showAdMenuActions ? onExtendAndRepublish : undefined}
                onEndPublication={showAdMenuActions ? onEndPublication : undefined}
                onHighlightAdvertisement={showAdMenuActions ? onHighlightAdvertisement : undefined}
                onTopAdvertisement={showAdMenuActions ? onTopAdvertisement : undefined}
              />
            </div>
          </div>
          <div
            data-testid="job-card-main"
            className={cn(
              'tm-flex tm-min-w-0 tm-w-full tm-flex-1',
              isDraft ? 'tm-flex-col tm-items-stretch' : 'tm-flex-col tm-gap-4',
            )}
          >
            <JobCardHeader
              title={title}
              department={department}
              owner={owner}
              hiringManagers={hiringManagers}
              onInviteColleagues={onInviteColleagues}
              onAdvertisementPreviewClick={onAdvertisementPreviewClick}
              lastChanged={lastChanged}
              isDraft={isDraft}
              isArchived={isArchived}
            />
            {!isDraft ? (
              <>
                {candidates ? (
                  <div data-testid="job-card-pipeline" className="tm-w-full tm-shrink-0">
                    <JobPipeline
                      candidates={candidates}
                      onStatClick={onCandidatesClick}
                      isHiringManager={isHiringManager}
                    />
                  </div>
                ) : null}
                {hasNote && !isHiringManager ? (
                  <JobNote note={note as JobCardNote} onExpand={onExpandNote} className="tm-w-full" />
                ) : null}
              </>
            ) : null}
          </div>
        </div>

        {showAdvertisements ? (
          <JobCardAdvertisements
            advertisements={advertisementColumn.advertisements}
            stats={advertisementColumn.stats}
            endedBy={advertisementColumn.endedBy}
            showAdvertisementTitle={showAdvertisementTitle}
            now={now}
            onExtendAndRepublish={onExtendAndRepublish}
            onViewStatisticsClick={onViewStatisticsClick}
            onAdvertisementDetailClick={onAdvertisementDetailClick}
            onAdvertisementPreviewClick={onAdvertisementPreviewClick}
            onHighlightAdvertisement={onHighlightAdvertisement}
            onCreateAdvertisement={isArchived ? undefined : onCreateAdvertisement}
          />
        ) : null}
      </div>
    </Card>
  )
})

JobCardV40.displayName = 'JobCardV40'
