import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'
import { Card } from '../Card'
import { JobCardAdvertisementSwitcher } from '../JobCardSynteza/JobCardAdvertisementSwitcher'
import type { JobAdvertisement } from '../JobCardSynteza/types'
import { Tag } from '../Tag'
import { countRunningAdvertisements, formatRunningAdsLabel } from './formatRunningAdsLabel'

export interface JobCardRunningAdsBatchProps extends StyleProps {
  advertisements: JobAdvertisement[]
  title: string
  index: number
  total: number
  onPrev: () => void
  onNext: () => void
}

export function JobCardRunningAdsBatch({
  advertisements,
  title,
  index,
  total,
  onPrev,
  onNext,
  className,
}: JobCardRunningAdsBatchProps) {
  const runningLabel = formatRunningAdsLabel(countRunningAdvertisements(advertisements))

  return (
    <Card
      as="div"
      data-testid="job-card-running-ads-batch"
      className={cn(
        'tm-flex',
        'tm-flex-row',
        'tm-items-center',
        'tm-gap-2',
        '!tm-p-3',
        className,
      )}
    >
      <span
        data-testid="job-card-advertisement-title"
        className="tm-min-w-0 tm-truncate tm-text-sm tm-font-medium tm-text-primary-default"
      >
        {title}
      </span>
      {runningLabel ? (
        <Tag
          color="success"
          isSubtle
          className="tm-shrink-0"
          data-testid="job-card-running-ads-count"
        >
          {runningLabel}
        </Tag>
      ) : null}
      <JobCardAdvertisementSwitcher
        title={title}
        hideTitle
        index={index}
        total={total}
        onPrev={onPrev}
        onNext={onNext}
        className="tm-ml-auto tm-shrink-0"
      />
    </Card>
  )
}

JobCardRunningAdsBatch.displayName = 'JobCardRunningAdsBatch'
