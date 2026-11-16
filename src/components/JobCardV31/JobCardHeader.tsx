import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'
import { JobAssignee } from './JobAssignee'

export interface JobCardHeaderProps extends StyleProps {
  title: string
  /** Prezentační jednotka, zobrazená za názvem náboru. */
  department?: string
  owner?: string
  hiringManagers?: string[]
  onInviteColleagues?: () => void
  /** Draft rows are compact: the title is vertically centered with the assignees. */
  isDraft?: boolean
  /** Icon buttons and the menu, rendered right of the assignees. */
  actions?: ReactNode
}

/** Title row of the job card: title, optional department, the assignee avatars and actions. */
export function JobCardHeader({
  title,
  department,
  owner,
  hiringManagers,
  onInviteColleagues,
  isDraft = false,
  actions,
  className,
}: JobCardHeaderProps) {
  return (
    <div
      data-testid="job-card-title-heading-row"
      className={cn(
        'tm-flex tm-min-w-0 tm-w-full tm-gap-3',
        isDraft ? 'tm-flex-1 tm-items-center' : 'tm-items-start',
        className,
      )}
    >
      <div className="tm-flex tm-min-w-0 tm-flex-1 tm-flex-wrap tm-items-baseline tm-gap-x-2">
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
      </div>
      <div className="tm-ml-auto tm-flex tm-shrink-0 tm-items-center tm-gap-3">
        <JobAssignee owner={owner} hiringManagers={hiringManagers} onInviteMore={onInviteColleagues} />
        {actions ? (
          <div data-testid="job-card-header-actions" className="tm-flex tm-items-center tm-gap-1">
            {actions}
          </div>
        ) : null}
      </div>
    </div>
  )
}

JobCardHeader.displayName = 'JobCardHeader'
