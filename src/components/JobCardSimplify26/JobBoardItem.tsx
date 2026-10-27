import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'
import {
  JobCardSimplify19ChannelStatusDot,
  type JobCardSimplify19ChannelStatusTone,
} from '../JobCardSimplify19/JobCardSimplify19ChannelStatusDot'
import { channelLogoPresentationClass } from '../JobCardSyntezaAds/JobCardPublicationPortal'
import type { JobPublicationStatus } from '../JobCardSynteza/types'
import { JobPortalLogo, jobPortalLogoTypeFromChannel } from '../JobPortalLogo'
import { JOB_CARD_SIMPLIFY_26_CHANNEL_LOGO_SIZE } from './constants'

export interface JobBoardItemProps extends StyleProps {
  channel: string
  date?: string
  /** Drives the Simplify 19 status dot on the portal logo. */
  status: JobPublicationStatus
}

function statusTone(status: JobPublicationStatus): JobCardSimplify19ChannelStatusTone {
  if (status === 'endingSoon') {
    return 'warning'
  }

  if (status === 'expired' || status === 'disabled') {
    return 'gray'
  }

  return 'success'
}

export function JobBoardItem({ channel, date, status, className }: JobBoardItemProps) {
  return (
    <li
      data-testid="job-board-item"
      data-status={status}
      className={cn('tm-flex tm-w-[8rem] tm-shrink-0 tm-items-start tm-gap-2', className)}
    >
      <span className="tm-relative tm-inline-flex tm-shrink-0">
        <JobPortalLogo
          type={jobPortalLogoTypeFromChannel(channel)}
          title=""
          className={channelLogoPresentationClass(JOB_CARD_SIMPLIFY_26_CHANNEL_LOGO_SIZE)}
        />
        <JobCardSimplify19ChannelStatusDot tone={statusTone(status)} />
      </span>
      <span className="tm-flex tm-min-w-0 tm-flex-1 tm-flex-col">
        <span className="tm-truncate tm-text-sm tm-text-primary-default">{channel}</span>
        {date ? (
          <span
            data-testid="job-board-item-date"
            className="tm-truncate tm-text-xs tm-text-secondary-default"
          >
            {date}
          </span>
        ) : null}
      </span>
    </li>
  )
}

JobBoardItem.displayName = 'JobBoardItem'
