import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'
import { Pill } from '../Pill'
import { JobAdvertisementPreview } from './JobAdvertisementPreview'
import { JobAssignee, type JobAssigneePerson } from './JobAssignee'
import { JobCardDraftMeta } from './JobCardDraftMeta'

export interface JobCardHeaderProps extends StyleProps {
  title: string
  /** Prezentační jednotka, zobrazená za názvem náboru. */
  department?: string
  owner?: string
  hiringManagers?: string[]
  colleagues?: JobAssigneePerson[]
  onInviteColleagues?: () => void
  onAdvertisementPreviewClick?: () => void
  lastChanged?: string
  /** Draft rows are compact: the title is vertically centered with the assignees. */
  isDraft?: boolean
  /** Shows the "Archivní" pill after the title. */
  isArchived?: boolean
}

/** Title row of the job card: title, optional department, Náhled icon and assignee pill. */
export function JobCardHeader({
  title,
  department,
  owner,
  hiringManagers,
  colleagues,
  onInviteColleagues,
  onAdvertisementPreviewClick,
  lastChanged,
  isDraft = false,
  isArchived = false,
  className,
}: JobCardHeaderProps) {
  return (
    <div
      data-testid="job-card-title-heading-row"
      className={cn(
        'tm-flex tm-min-w-0 tm-w-full tm-flex-col tm-gap-3 md:tm-flex-row',
        isDraft ? 'tm-flex-1 md:tm-items-center' : 'md:tm-items-start',
        className,
      )}
    >
      <div className="tm-flex tm-min-w-0 tm-w-full tm-flex-col tm-gap-1 md:tm-flex-1">
        <div className="tm-flex tm-min-w-0 tm-flex-wrap tm-items-baseline tm-gap-x-2">
          <h3
            data-testid="job-card-title"
            className="tm-mb-0 tm-min-w-0 tm-text-lg tm-font-medium tm-leading-tight tm-text-teamio-blue"
          >
            {title}
          </h3>
          {department ? (
            <span className="tm-inline-flex tm-items-baseline tm-gap-x-2">
              <span
                data-testid="job-card-department-separator"
                className="tm-text-sm tm-text-secondary-default"
                aria-hidden
              >
                ·
              </span>
              <span
                data-testid="job-card-department"
                className="tm-text-sm tm-text-secondary-default"
              >
                {department}
              </span>
            </span>
          ) : null}
          {isArchived ? (
            <Pill color="tertiary" data-testid="job-card-archived-pill">
              Archivní
            </Pill>
          ) : null}
        </div>
        {isDraft && lastChanged ? <JobCardDraftMeta lastChanged={lastChanged} /> : null}
      </div>
      <div
        data-testid="job-card-header-actions"
        className="tm-flex tm-shrink-0 tm-items-center tm-gap-2 md:tm-ml-auto"
      >
        <JobAdvertisementPreview onClick={onAdvertisementPreviewClick} />
        <JobAssignee
          owner={owner}
          hiringManagers={hiringManagers}
          colleagues={colleagues}
          onInviteMore={onInviteColleagues}
          className="tm-shrink-0"
        />
      </div>
    </div>
  )
}

JobCardHeader.displayName = 'JobCardHeader'
