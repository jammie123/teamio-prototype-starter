import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'

export interface JobCardDraftMetaProps extends StyleProps {
  /** Pre-formatted Czech date (`3. 11. 2026`). */
  lastChanged: string
}

/** Last-change date shown under the draft job title. */
export function JobCardDraftMeta({ lastChanged, className }: JobCardDraftMetaProps) {
  return (
    <div data-testid="job-card-draft-meta" className={cn('tm-flex tm-items-center', className)}>
      <span
        data-testid="job-card-last-changed"
        className="tm-flex tm-flex-row tm-items-baseline tm-gap-1.5 tm-whitespace-nowrap tm-text-sm tm-leading-tight tm-text-secondary-default"
      >
        <span>Poslední změna</span>
        <span>{lastChanged}</span>
      </span>
    </div>
  )
}

JobCardDraftMeta.displayName = 'JobCardDraftMeta'
