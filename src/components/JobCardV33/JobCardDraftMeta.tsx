import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'
import { Button } from '../Button'
import { JOB_CARD_SIDE_COLUMN_WIDTH } from './layout'

export interface JobCardDraftMetaProps extends StyleProps {
  /** Pre-formatted Czech date (`3. 11. 2026`). */
  lastChanged?: string
  onCompleteDraft?: () => void
}

/** Right part of a draft row: date of the last change and the Dokončit button. */
export function JobCardDraftMeta({ lastChanged, onCompleteDraft, className }: JobCardDraftMetaProps) {
  return (
    <div
      data-testid="job-card-draft-meta"
      className={cn(
        'tm-ml-4 tm-flex tm-w-full tm-shrink-0 tm-items-center tm-justify-between tm-border-0 tm-border-t tm-border-solid tm-border-secondary tm-pt-3 md:tm-border-t-0 md:tm-border-l md:tm-pt-0 md:tm-pl-4',
        JOB_CARD_SIDE_COLUMN_WIDTH,
        className,
      )}
    >
      {lastChanged ? (
        <span
          data-testid="job-card-last-changed"
          className="tm-flex tm-flex-col tm-whitespace-nowrap tm-text-sm tm-leading-tight tm-text-secondary-default"
        >
          <span>Poslední změna</span>
          <span>{lastChanged}</span>
        </span>
      ) : null}
      <Button variant="primary" data-testid="job-card-complete-draft" onClick={onCompleteDraft}>
        Dokončit
      </Button>
    </div>
  )
}

JobCardDraftMeta.displayName = 'JobCardDraftMeta'
