import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'
import { Button } from '../Button'

export interface DraftWidgetProps extends StyleProps {
  /** Pre-formatted Czech date (`3. 11. 2026`). */
  lastChanged?: string
  onContinue?: () => void
}

/** Replaces the pipeline on a draft job: date of the last change and the Pokračovat button. */
export function DraftWidget({ lastChanged, onContinue, className }: DraftWidgetProps) {
  return (
    <div
      data-testid="job-card-draft"
      className={cn('tm-flex', 'tm-flex-row', 'tm-items-center', 'tm-gap-4', className)}
    >
      {lastChanged ? (
        <span
          data-testid="job-card-last-changed"
          className="tm-whitespace-nowrap tm-text-sm tm-text-secondary-default"
        >
          {`Poslední změna: ${lastChanged}`}
        </span>
      ) : null}
      <Button
        variant="secondary"
        data-testid="job-card-continue-draft"
        className="tm-shrink-0"
        onClick={onContinue}
      >
        Pokračovat
      </Button>
    </div>
  )
}

DraftWidget.displayName = 'DraftWidget'
