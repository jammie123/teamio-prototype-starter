import { cn } from '../../lib/cn'

export type JobCardSimplify20ChannelStatusTone = 'success' | 'warning' | 'gray'

const TONE_CLASS: Record<JobCardSimplify20ChannelStatusTone, string> = {
  success: 'tm-bg-emotion-success-emphasis',
  warning: 'tm-bg-emotion-warning-emphasis',
  gray: 'tm-bg-[#C2C8CE]',
}

export interface JobCardSimplify20ChannelStatusDotProps {
  tone: JobCardSimplify20ChannelStatusTone
  className?: string
}

export function JobCardSimplify20ChannelStatusDot({
  tone,
  className,
}: JobCardSimplify20ChannelStatusDotProps) {
  return (
    <span
      aria-hidden
      data-testid="job-card-simplify20-channel-status-dot"
      data-channel-status={tone}
      className={cn(
        'tm-pointer-events-none tm-z-[1] tm-absolute tm-right-0 tm-top-0',
        'tm-size-[10px] tm-translate-x-[15%] tm-translate-y-[-15%]',
        'tm-rounded-full tm-border-2 tm-border-solid tm-border-[#ffffff] tm-box-border',
        TONE_CLASS[tone],
        className,
      )}
    />
  )
}

JobCardSimplify20ChannelStatusDot.displayName = 'JobCardSimplify20ChannelStatusDot'
