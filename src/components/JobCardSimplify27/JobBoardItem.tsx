import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'
import {
  JobCardSimplify19ChannelStatusDot,
  type JobCardSimplify19ChannelStatusTone,
} from '../JobCardSimplify19/JobCardSimplify19ChannelStatusDot'
import { channelLogoPresentationClass } from '../JobCardSyntezaAds/JobCardPublicationPortal'
import type { JobPublicationStatus } from '../JobCardSynteza/types'
import { JobPortalLogo, jobPortalLogoTypeFromChannel } from '../JobPortalLogo'
import {
  JOB_CARD_SIMPLIFY_27_CHANNEL_LOGO_SIZE,
  JOB_CARD_SIMPLIFY_27_MIXED_DATE_ITEM_WIDTH,
} from './constants'

const MIXED_DATE_ITEM_WIDTH_CLASS = {
  '10.5rem': 'tm-w-[10.5rem]',
} as const satisfies Record<typeof JOB_CARD_SIMPLIFY_27_MIXED_DATE_ITEM_WIDTH, string>
import type { Simplify27DateLayout } from './jobCardSimplify27Presentation'

export interface JobBoardItemProps extends StyleProps {
  channel: string
  date?: string
  dateLayout?: Simplify27DateLayout
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

export function JobBoardItem({
  channel,
  date,
  dateLayout = 'hidden',
  status,
  className,
}: JobBoardItemProps) {
  const showDate = dateLayout === 'beside' && Boolean(date)

  return (
    <li
      data-testid="job-board-item"
      data-status={status}
      data-date-layout={dateLayout}
      className={cn(
        'tm-flex tm-shrink-0 tm-items-start tm-gap-2',
        dateLayout === 'beside' ? MIXED_DATE_ITEM_WIDTH_CLASS[JOB_CARD_SIMPLIFY_27_MIXED_DATE_ITEM_WIDTH] : 'tm-w-auto',
        className,
      )}
    >
      <span className="tm-relative tm-inline-flex tm-shrink-0">
        <JobPortalLogo
          type={jobPortalLogoTypeFromChannel(channel)}
          title=""
          className={channelLogoPresentationClass(JOB_CARD_SIMPLIFY_27_CHANNEL_LOGO_SIZE)}
        />
        <JobCardSimplify19ChannelStatusDot tone={statusTone(status)} />
      </span>
      <span
        className={cn(
          'tm-flex tm-min-w-0',
          dateLayout === 'beside' ? 'tm-flex-row tm-items-baseline tm-gap-1' : 'tm-flex-col',
        )}
      >
        <span className="tm-text-sm tm-text-primary-default">{channel}</span>
        {showDate ? (
          <span
            data-testid="job-board-item-date"
            className="tm-whitespace-nowrap tm-text-xs tm-text-secondary-default"
          >
            {date}
          </span>
        ) : null}
      </span>
    </li>
  )
}

JobBoardItem.displayName = 'JobBoardItem'
