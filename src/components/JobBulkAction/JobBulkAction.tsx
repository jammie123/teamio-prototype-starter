import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'
import { Button } from '../Button'
import { Checkbox } from '../Checkbox'
import { IconButton } from '../IconButton'

function selectedJobsLabel(count: number) {
  const noun = count === 1 ? 'nábor' : count >= 2 && count <= 4 ? 'nábory' : 'náborů'
  return `Vybráno: ${count} ${noun}`
}

export interface JobBulkActionProps
  extends StyleProps,
    Omit<HTMLAttributes<HTMLDivElement>, 'color' | 'children'> {
  /** Number of currently selected jobs. */
  selectedCount?: number
  /** Number of selectable jobs in the current view. */
  totalCount?: number
  onSelectAllChange?: (checked: boolean) => void
  onArchive?: () => void
  onTransfer?: () => void
  onTurnOff?: () => void
}

/**
 * Bar shown above the job listing while bulk editing is on: select-all, selected
 * count, Archivovat, Předat nábor and a tertiary close IconButton. Archive and
 * transfer stay disabled until a job is selected.
 */
export const JobBulkAction = forwardRef<HTMLDivElement, JobBulkActionProps>(function JobBulkAction(
  {
    selectedCount = 0,
    totalCount = 0,
    onSelectAllChange,
    onArchive,
    onTransfer,
    onTurnOff,
    className,
    ...rest
  },
  ref,
) {
  const allSelected = totalCount > 0 && selectedCount >= totalCount
  const someSelected = selectedCount > 0 && !allSelected
  const actionsDisabled = selectedCount === 0

  return (
    <div
      ref={ref}
      role="group"
      aria-label="Hromadné akce"
      data-testid="job-bulk-action"
      className={cn(
        'tm-flex',
        'tm-w-full',
        'tm-flex-wrap',
        'tm-items-center',
        'tm-gap-3',
        'tm-rounded-md',
        'tm-border',
        'tm-border-solid',
        'tm-border-secondary',
        'tm-bg-basic',
        'tm-px-4',
        'tm-py-4',
        'tm-shadow-md',
        className,
      )}
      {...rest}
    >
      <div className="tm-flex tm-min-w-0 tm-items-center tm-gap-3">
        <Checkbox
          data-testid="job-bulk-action-select-all"
          aria-label="Vybrat vše"
          checked={allSelected}
          indeterminate={someSelected}
          isDisabled={totalCount === 0}
          onChange={(event) => onSelectAllChange?.(event.target.checked)}
        />
        <span
          role="status"
          data-testid="job-bulk-action-count"
          className="tm-text-sm tm-text-primary-default"
        >
          {selectedJobsLabel(selectedCount)}
        </span>
      </div>
      <div
        data-testid="job-bulk-action-actions"
        className="tm-ml-auto tm-flex tm-flex-wrap tm-items-center tm-gap-3"
      >
        <Button
          variant="secondary"
          data-testid="job-bulk-action-archive"
          isDisabled={actionsDisabled}
          onClick={onArchive}
        >
          Archivovat
        </Button>
        <Button
          variant="secondary"
          data-testid="job-bulk-action-transfer"
          isDisabled={actionsDisabled}
          onClick={onTransfer}
        >
          Předat nábor
        </Button>
        <IconButton
          variant="tertiary"
          icon="x"
          data-testid="job-bulk-action-turn-off"
          aria-label="Vypnout hromadné úpravy"
          tooltip="Vypnout hromadné úpravy"
          onClick={onTurnOff}
        />
      </div>
    </div>
  )
})

JobBulkAction.displayName = 'JobBulkAction'
