import type { ReactNode } from 'react'
import { Button } from '../Button'

export interface JobCardExpiredPublicationsSimplify9RowProps {
  children: ReactNode
  onExtendAll?: () => void
}

/** Bordered single-row shell for ended publications (JobCard Simplify 9). */
export function JobCardExpiredPublicationsSimplify9Row({
  children,
  onExtendAll,
}: JobCardExpiredPublicationsSimplify9RowProps) {
  return (
    <div
      data-testid="job-card-advertisement-ended-row"
      className="tm-flex tm-flex-wrap tm-items-center tm-gap-3 tm-rounded tm-border tm-border-secondary tm-p-3"
    >
      <div className="tm-flex tm-min-w-0 tm-flex-1 tm-flex-wrap tm-items-center tm-gap-x-3 tm-gap-y-2">
        {children}
      </div>
      {onExtendAll ? (
        <Button
          variant="secondary"
          size="small"
          className="!tm-min-h-7 !tm-shrink-0 !tm-px-3 !tm-py-1"
          data-testid="job-card-advertisement-ended-extend"
          onClick={(event) => {
            event.preventDefault()
            event.stopPropagation()
            onExtendAll()
          }}
        >
          Prodloužit
        </Button>
      ) : null}
    </div>
  )
}

JobCardExpiredPublicationsSimplify9Row.displayName = 'JobCardExpiredPublicationsSimplify9Row'
