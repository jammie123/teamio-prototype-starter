import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'
import { Card } from '../Card'
import type { JobCardMenuHandlers } from '../JobCardSynteza/jobCardMenu'
import type {
  JobAdvertisement,
  JobCandidateStat,
  JobCardAction,
  JobCardCandidates,
  JobCardNote,
  JobPublication,
} from '../JobCardSyntezaPipeline/types'
import type { JobCardBranch } from '../JobCardSimplify5/JobCardBranchInline'
import { JobCardSimplify23AdvertisementSection } from './JobCardSimplify23AdvertisementSection'
import { JobCardSimplify23RecruitmentSection } from './JobCardSimplify23RecruitmentSection'

export type { JobCardBranch }

export interface JobCardSimplify23Props
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
  onDeclineAdvertising?: () => void
  onRepublishAdvertisement?: () => void
}

export const JobCardSimplify23 = forwardRef<HTMLElement, JobCardSimplify23Props>(
  function JobCardSimplify23(
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
      onDeclineAdvertising,
      onRepublishAdvertisement,
      className,
      ...rest
    },
    ref,
  ) {
    return (
      <Card
        as="article"
        ref={ref}
        data-testid="job-card"
        data-variant="simplify-23"
        className={cn('tm-flex', 'tm-flex-col', '!tm-rounded-xl', '!tm-p-0', className)}
        {...rest}
      >
        <div
          data-testid="job-card-layout"
          className="tm-flex tm-flex-col tm-gap-4 md:tm-flex-row md:tm-items-stretch md:tm-gap-0"
        >
          <JobCardSimplify23RecruitmentSection
            title={title}
            owner={owner}
            hiringManagers={hiringManagers}
            branches={branches}
            candidates={candidates}
            onCandidatesClick={onCandidatesClick}
            advertisements={advertisements}
            note={note}
            onExpandNote={onExpandNote}
            actions={actions}
            onCreateAdvertisement={onCreateAdvertisement}
            onEditJob={onEditJob}
            onDuplicateJob={onDuplicateJob}
            onInviteColleagues={onInviteColleagues}
            onTransferJob={onTransferJob}
            onArchiveJob={onArchiveJob}
            onEditAdvertisement={onEditAdvertisement}
            onExtendAndRepublish={onExtendAndRepublish}
            onEndPublication={onEndPublication}
            onTopAdvertisement={onTopAdvertisement}
            onAddNote={onAddNote}
            onPreviewAdvertisement={onPreviewAdvertisement}
          />
          <JobCardSimplify23AdvertisementSection
            key={advertisements.map((advertisement) => advertisement.id).join('|')}
            advertisements={advertisements}
            onViewStatisticsClick={onViewStatisticsClick}
            onPreviewAdvertisement={onPreviewAdvertisement}
            onPreviewPublication={onPreviewPublication}
            onExtendPublication={onExtendPublication}
            onExtendAndRepublish={onExtendAndRepublish}
            onCompleteAdvertisement={onCompleteAdvertisement}
            onDeclineAdvertising={onDeclineAdvertising}
            onRepublishAdvertisement={onRepublishAdvertisement}
            onEditAdvertisement={onEditAdvertisement}
            onCreateAdvertisement={onCreateAdvertisement}
          />
        </div>
      </Card>
    )
  },
)

JobCardSimplify23.displayName = 'JobCardSimplify23'
