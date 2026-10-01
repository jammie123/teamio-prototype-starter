import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'
import { Card } from '../Card'
import { Checkbox } from '../Checkbox'
import type { JobModalAdvertisement } from './types'

export interface JobAdvertisementChoiceCardProps extends StyleProps {
  advertisement: JobModalAdvertisement
  checked: boolean
  onSelect: (advertisementId: string) => void
}

export function JobAdvertisementChoiceCard({
  advertisement,
  checked,
  onSelect,
  className,
}: JobAdvertisementChoiceCardProps) {
  return (
    <Card
      as="div"
      data-testid="job-advertisement-choice-card"
      className={cn('tm-cursor-pointer', className)}
      onClick={() => onSelect(advertisement.id)}
    >
      <span className="tm-flex tm-items-start tm-gap-3">
        <span className="tm-flex tm-min-w-0 tm-flex-1 tm-flex-col tm-gap-1">
          <span className="tm-text-sm tm-font-medium tm-text-primary-default">
            {advertisement.title}
          </span>
          <span className="tm-text-13 tm-text-secondary-default">{advertisement.createdAt}</span>
        </span>
        <Checkbox
          checked={checked}
          aria-label={advertisement.title}
          onChange={() => onSelect(advertisement.id)}
          onClick={(event) => event.stopPropagation()}
          className="tm-shrink-0"
        />
      </span>
    </Card>
  )
}

JobAdvertisementChoiceCard.displayName = 'JobAdvertisementChoiceCard'
