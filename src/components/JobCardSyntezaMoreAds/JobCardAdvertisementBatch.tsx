import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'
import type { JobAdvertisement } from '../JobCardSynteza/types'
import { Icon } from '../Icon'
import { Tag } from '../Tag'
import { isAdvertisementRunning } from './advertisementBatch'

export interface JobCardAdvertisementBatchProps extends StyleProps {
  advertisements: JobAdvertisement[]
  onSelect: (advertisement: JobAdvertisement) => void
}

export function JobCardAdvertisementBatch({
  advertisements,
  onSelect,
  className,
}: JobCardAdvertisementBatchProps) {
  return (
    <div
      data-testid="job-card-advertisement-batch"
      className={cn('tm-flex', 'tm-flex-col', 'tm-gap-2', className)}
    >
      {advertisements.map((advertisement, index) => (
        <button
          key={advertisement.id}
          type="button"
          data-testid="job-card-advertisement-batch-item"
          className="tm-flex tm-w-full tm-items-center tm-justify-between tm-gap-3 tm-rounded tm-border tm-border-secondary tm-bg-basic tm-p-3 tm-text-left tm-font-inherit tm-cursor-pointer"
          onClick={(event) => {
            event.preventDefault()
            event.stopPropagation()
            onSelect(advertisement)
          }}
        >
          <span className="tm-min-w-0 tm-truncate tm-text-sm tm-font-medium tm-text-primary-default">
            {advertisement.title ?? `Inzerát ${index + 1}`}
          </span>
          <span className="tm-flex tm-shrink-0 tm-items-center tm-gap-2">
            {isAdvertisementRunning(advertisement) ? (
              <Tag
                color="success"
                isSubtle
                data-testid="job-card-advertisement-batch-status"
              >
                Běží
              </Tag>
            ) : null}
            <Icon name="chevron-right" />
          </span>
        </button>
      ))}
    </div>
  )
}

JobCardAdvertisementBatch.displayName = 'JobCardAdvertisementBatch'
