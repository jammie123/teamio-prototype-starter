import { cn } from '../../lib/cn'
import type { Simplify11ChannelVisualState } from './jobCardSimplify11Presentation'

/** Status dot on portal logo edge (notification-style placement). */
const STATUS_DOT_CLASS: Record<Simplify11ChannelVisualState, string> = {
  running: 'tm-bg-emotion-success-emphasis',
  endingSoon: 'tm-bg-emotion-warning-emphasis',
  expired: 'tm-bg-emotion-danger-emphasis',
  disabled: 'tm-bg-secondary',
}

export interface JobCardSimplify11ChannelStatusDotProps {
  visual: Simplify11ChannelVisualState
  className?: string
}

export function JobCardSimplify11ChannelStatusDot({
  visual,
  className,
}: JobCardSimplify11ChannelStatusDotProps) {
  return (
    <span
      aria-hidden
      data-testid="job-card-simplify11-channel-status-dot"
      data-channel-state={visual}
      className={cn(
        'tm-pointer-events-none tm-absolute tm-right-0 tm-top-0',
        'tm-size-[13px] tm-translate-x-[-14%] tm-translate-y-[218%] tm-rounded-full',
        'tm-border-2 tm-border-solid tm-border-[#ffffff]',
        'tm-box-border',
        STATUS_DOT_CLASS[visual],
        className,
      )}
    />
  )
}

JobCardSimplify11ChannelStatusDot.displayName = 'JobCardSimplify11ChannelStatusDot'
