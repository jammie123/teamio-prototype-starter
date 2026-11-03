import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'
import type { JobPublication } from '../JobCardSynteza/types'
import { JobCardSimplify11ChannelChip } from '../JobCardSimplify11/JobCardSimplify11ChannelChip'
import { JOB_CARD_SIMPLIFY_14V2_CHANNEL_CHIP_SIZE } from './constants'
import {
  formatSimplify14v2ChannelDateLabel,
  resolveSimplify11ChannelVisualState,
  resolveSimplify14v2ChannelDateLabelTone,
  SIMPLIFY_14V2_ENDED_STATUS_DOT_CLASS,
  simplify14v2ChannelDateLabelClassName,
} from './jobCardSimplify14v2Presentation'

export interface JobBoardItemProps extends StyleProps {
  publication: JobPublication
  showDate?: boolean
  now?: Date
  onExtendPublication?: (publication: JobPublication) => void
  onEnablePublication?: (publication: JobPublication) => void
}

export function JobBoardItem({
  publication,
  showDate = false,
  now,
  onExtendPublication,
  onEnablePublication,
  className,
}: JobBoardItemProps) {
  const tone = resolveSimplify14v2ChannelDateLabelTone(publication, now)
  const visual = resolveSimplify11ChannelVisualState(publication, now)

  return (
    <li
      data-testid="job-board-item"
      className={cn('tm-flex tm-w-10 tm-flex-col tm-items-center tm-gap-0.5', className)}
    >
      <JobCardSimplify11ChannelChip
        publication={publication}
        chipSize={JOB_CARD_SIMPLIFY_14V2_CHANNEL_CHIP_SIZE}
        now={now}
        statusDotClassName={visual === 'expired' ? SIMPLIFY_14V2_ENDED_STATUS_DOT_CLASS : undefined}
        onExtendPublication={onExtendPublication}
        onEnablePublication={onEnablePublication}
      />
      {showDate ? (
        <span
          data-testid="job-card-simplify14v2-channel-date"
          className={cn(
            'tm-max-w-full tm-truncate tm-text-center tm-text-[11px] tm-leading-tight tm-whitespace-nowrap',
            simplify14v2ChannelDateLabelClassName(tone),
          )}
        >
          {formatSimplify14v2ChannelDateLabel(publication, now)}
        </span>
      ) : null}
    </li>
  )
}

JobBoardItem.displayName = 'JobBoardItem'
