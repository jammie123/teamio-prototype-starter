import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'
import { Button } from '../Button'
import { Card } from '../Card'
import { Icon } from '../Icon'
import { JobMenu } from '../JobMenu'
import type { JobCardMenuHandlers } from '../JobShared/jobCardMenu'
import { JobCardAdvertisements } from './JobCardAdvertisements'
import { JobCardDraftMeta } from './JobCardDraftMeta'
import { JobCardHeader } from './JobCardHeader'
import { buildJobCardAdvertisements } from './lib/jobCardAdvertisements'
import { JobNote } from './JobNote'
import { JobPipeline } from './JobPipeline'
import type { JobAdvertisement, JobCandidateStat, JobCardCandidates, JobCardNote, JobStatus } from './types'

export interface JobCardV41Props
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
   * archived = "Archivní" pill with ended advertisements, draft = compact row with Dokončit.
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
  onCompleteDraft?: () => void
  /**
   * Hiring Manager view: pipeline shows K ohodnocení / Celkem and the advertisement column
   * is replaced by a single Náhled button under the job. The note is not shown.
   */
  isHiringManager?: boolean
}

/**
 * Listing card for one recruitment (V41): title, assignees, candidate pipeline,
 * optional note, and the advertisement column (portals, dates, stats; 450px from md up).
 *
 * Advertisement states: running (date only), ending soon, expired up to 30 days ago (highlighted),
 * expired more than 30 days ago (muted) and ended by the recruiter ("Ukončené vystavování", muted).
 */
export const JobCardV41 = forwardRef<HTMLElement, JobCardV41Props>(function JobCardV41(
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
    isHiringManager = false,
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
  const showHiringManagerPreview = hasAdvertisementStatus && isHiringManager
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
      data-variant="v41"
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
            'tm-grid tm-min-w-0 tm-flex-1 tm-grid-cols-[minmax(0,1fr)_auto] tm-gap-3 tm-px-6 md:tm-flex md:tm-gap-2 md:tm-px-4',
            isDraft ? 'tm-items-center tm-py-3' : 'tm-py-6',
          )}
        >
          <JobMenu
            advertisements={showAdMenuActions ? advertisements : []}
            label="Akce nad náborem a inzerátem"
            testId="job-card-actions-toggle"
            className={cn(
              'tm-col-start-2 tm-row-start-1 tm-shrink-0 tm-border-0 tm-border-l tm-border-solid tm-border-secondary tm-pl-3 md:tm-border-l-0 md:tm-pl-0',
              isDraft ? 'tm-self-center' : 'tm-self-start tm--top-1',
            )}
            onEditJob={onEditJob}
            onDuplicateJob={onDuplicateJob}
            onInviteColleagues={onInviteColleagues}
            onTransferJob={onTransferJob}
            onArchiveJob={onArchiveJob}
            onExtendAndRepublish={showAdMenuActions ? onExtendAndRepublish : undefined}
            onEndPublication={showAdMenuActions ? onEndPublication : undefined}
            onTopAdvertisement={showAdMenuActions ? onTopAdvertisement : undefined}
          />
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
              isArchived={isArchived}
            />
            {isDraft ? (
              <JobCardDraftMeta lastChanged={lastChanged} onCompleteDraft={onCompleteDraft} />
            ) : (
              <>
                {candidates ? (
                  <div data-testid="job-card-pipeline" className="tm-shrink-0">
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
                {showHiringManagerPreview ? (
                  <div
                    data-testid="job-card-hm-preview"
                    className="tm-flex tm-w-full tm-justify-start"
                  >
                    <Button
                      variant="secondary"
                      aria-label="Náhled inzerátu"
                      data-testid="job-card-advertisement-preview-action"
                      onClick={onAdvertisementPreviewClick}
                    >
                      <Icon name="advertisement-preview" size={16} aria-hidden />
                      Náhled
                    </Button>
                  </div>
                ) : null}
              </>
            )}
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

JobCardV41.displayName = 'JobCardV41'
