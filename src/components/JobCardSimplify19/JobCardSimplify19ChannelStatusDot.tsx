import { cn } from '../../lib/cn'

export type JobCardSimplify19ChannelStatusTone = 'success' | 'warning' | 'gray'
export type JobCardChannelStatusDotPlacement = 'top' | 'bottom'

const TONE_CLASS: Record<JobCardSimplify19ChannelStatusTone, string> = {
  success: 'tm-bg-emotion-success-emphasis',
  warning: 'tm-bg-emotion-warning-emphasis',
  gray: 'tm-bg-[#C2C8CE]',
}

const PLACEMENT_CLASS: Record<JobCardChannelStatusDotPlacement, string> = {
  top: 'tm-top-0 tm-translate-y-[-15%]',
  bottom: 'tm-bottom-0 tm-translate-y-[15%]',
}

export interface JobCardSimplify19ChannelStatusDotProps {
  tone: JobCardSimplify19ChannelStatusTone
  placement?: JobCardChannelStatusDotPlacement
  className?: string
}

export function JobCardSimplify19ChannelStatusDot({
  tone,
  placement = 'top',
  className,
}: JobCardSimplify19ChannelStatusDotProps) {
  return (
    <span
      aria-hidden
      data-testid="job-card-simplify19-channel-status-dot"
      data-channel-status={tone}
      data-channel-status-placement={placement}
      className={cn(
        'tm-pointer-events-none tm-z-[1] tm-absolute tm-right-0',
        'tm-size-[10px] tm-translate-x-[15%]',
        'tm-rounded-full tm-border-2 tm-border-solid tm-border-[#ffffff] tm-box-border',
        PLACEMENT_CLASS[placement],
        TONE_CLASS[tone],
        className,
      )}
    />
  )
}

JobCardSimplify19ChannelStatusDot.displayName = 'JobCardSimplify19ChannelStatusDot'
