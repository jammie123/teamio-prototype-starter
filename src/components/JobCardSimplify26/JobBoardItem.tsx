import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'
import { JobPortalLogo, jobPortalLogoTypeFromChannel } from '../JobPortalLogo'
import type { JobPublicationStatus } from '../JobCardSynteza/types'

export interface JobBoardItemProps extends StyleProps {
  channel: string
  date?: string
  /** Stored for later visual states. It does not change the item appearance yet. */
  status: JobPublicationStatus
}

export function JobBoardItem({ channel, date, status, className }: JobBoardItemProps) {
  return (
    <li
      data-testid="job-board-item"
      data-status={status}
      className={cn('tm-flex tm-min-w-0 tm-items-start tm-gap-2', className)}
    >
      <JobPortalLogo
        type={jobPortalLogoTypeFromChannel(channel)}
        title=""
        className="tm-size-6"
      />
      <span className="tm-flex tm-min-w-0 tm-flex-col">
        <span className="tm-truncate tm-text-sm tm-text-primary-default">{channel}</span>
        {date ? (
          <span data-testid="job-board-item-date" className="tm-text-xs tm-text-secondary-default">
            {date}
          </span>
        ) : null}
      </span>
    </li>
  )
}

JobBoardItem.displayName = 'JobBoardItem'
