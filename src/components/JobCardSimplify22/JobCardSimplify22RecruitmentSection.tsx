import { cn } from '../../lib/cn'
import { buildJobCardPeople, JobCardPeople } from '../JobCardSynteza/JobCardPeople'
import type { JobCardMenuHandlers } from '../JobCardSynteza/jobCardMenu'
import { JobCardPreviewButton } from '../JobCardSimplify/JobCardPreviewButton'
import { JobMenu } from '../JobMenu'
import type {
  JobAdvertisement,
  JobCandidateStat,
  JobCardAction,
  JobCardCandidates,
  JobCardNote,
} from '../JobCardSyntezaPipeline/types'
import { Note } from '../Note'
import { Typography } from '../Typography'
import { JobCardBranchInline, type JobCardBranch } from '../JobCardSimplify5/JobCardBranchInline'
import { JobCardStatsSimplify8 } from '../JobCardSimplify8/JobCardStatsSimplify8'
import {
  JOB_CARD_SIMPLIFY_22_PREVIEW_LABEL,
  JOB_CARD_SIMPLIFY_22_SECTION_PADDING,
} from './constants'

export interface JobCardSimplify22RecruitmentSectionProps extends JobCardMenuHandlers {
  title: string
  owner?: string
  hiringManagers?: string[]
  branches?: JobCardBranch[]
  candidates?: JobCardCandidates
  onCandidatesClick?: (stat: JobCandidateStat) => void
  advertisements: JobAdvertisement[]
  note?: JobCardNote
  onExpandNote?: () => void
  actions?: JobCardAction[]
  onPreviewAdvertisement?: () => void
}

export function JobCardSimplify22RecruitmentSection({
  title,
  owner,
  hiringManagers,
  branches,
  candidates,
  onCandidatesClick,
  advertisements,
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
  onPreviewAdvertisement,
}: JobCardSimplify22RecruitmentSectionProps) {
  return (
    <div
      data-testid="job-card-recruitment"
      className={cn(
        'tm-min-w-0 tm-font-normal md:tm-flex-1',
        JOB_CARD_SIMPLIFY_22_SECTION_PADDING,
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
                  label={JOB_CARD_SIMPLIFY_22_PREVIEW_LABEL}
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
            <JobCardStatsSimplify8 candidates={candidates} onStatClick={onCandidatesClick} />
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
  )
}

JobCardSimplify22RecruitmentSection.displayName = 'JobCardSimplify22RecruitmentSection'
