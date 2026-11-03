import sparkleAiPending from './sparkle-ai-pending.png'
import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'

export interface ScoreSummarySparklePendingProps extends StyleProps {
  /** Pixel size of the sparkle cluster (asset is 16×16). */
  size?: number
}

export function ScoreSummarySparklePending({
  size = 16,
  className,
}: ScoreSummarySparklePendingProps) {
  return (
    <img
      src={sparkleAiPending}
      alt=""
      aria-hidden="true"
      data-testid="score-summary-badge-sparkle"
      width={size}
      height={size}
      className={cn(
        'tm-block tm-shrink-0 tm-animate-sparkle-pulse motion-reduce:tm-animate-none',
        className,
      )}
    />
  )
}

ScoreSummarySparklePending.displayName = 'ScoreSummarySparklePending'
