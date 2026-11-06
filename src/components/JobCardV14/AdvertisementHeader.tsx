import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'
import type { AdvertisementTone } from './lib/advertisementModel'

export interface AdvertisementHeaderProps extends StyleProps {
  /** success = Běží, warning = Brzy končí, ended = Ukončeno, neutral = Zatím nevystavený. */
  tone: AdvertisementTone
  label: string
  /** Date range or single date next to the label. */
  dateInfo?: string
}

const LABEL_CLASS: Record<AdvertisementTone, string> = {
  success: 'tm-text-emotion-success-emphasis',
  warning: 'tm-text-emotion-warning-emphasis',
  ended: 'tm-text-secondary-default',
  neutral: 'tm-text-secondary-default',
}

/** Status of the advertisement: label in a tone color with an optional date beside it. */
export function AdvertisementHeader({
  tone,
  label,
  dateInfo,
  className,
}: AdvertisementHeaderProps) {
  return (
    <div
      data-testid="job-card-advertisement-heading"
      data-tone={tone}
      className={cn(
        'tm-flex',
        'tm-min-w-0',
        'tm-flex-row',
        'tm-flex-wrap',
        'tm-items-baseline',
        'tm-gap-5',
        'tm-whitespace-normal',
        'tm-text-sm',
        'tm-font-medium',
        LABEL_CLASS[tone],
        className,
      )}
    >
      <span data-testid="job-card-advertisement-heading-label" className="tm-text-base">
        {label}
      </span>
      {dateInfo ? (
        <span
          data-testid="job-card-advertisement-heading-date"
          className="tm-font-normal tm-text-secondary-default"
        >
          {' '}
          {dateInfo}
        </span>
      ) : null}
    </div>
  )
}

AdvertisementHeader.displayName = 'AdvertisementHeader'
