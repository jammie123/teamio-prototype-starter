import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'
import type { AdvertisementTone } from './lib/advertisementModel'

export interface AdvertisementHeaderProps extends StyleProps {
  /** success = Běží, warning = Brzy končí, ended = Ukončeno, neutral = Zatím nevystavený. */
  tone: AdvertisementTone
  label: string
  /** Date range or single date under the label. */
  dateInfo?: string
}

const LABEL_CLASS: Record<AdvertisementTone, string> = {
  success: 'tm-text-emotion-success-emphasis',
  warning: 'tm-text-emotion-warning-emphasis',
  ended: 'tm-text-secondary-default',
  neutral: 'tm-text-secondary-default',
}

const LABEL_WEIGHT: Record<AdvertisementTone, string> = {
  success: 'tm-font-normal',
  warning: 'tm-font-semibold',
  ended: 'tm-font-medium',
  neutral: 'tm-font-medium',
}

/** Status of the advertisement stacked: label in a tone color with the date below in secondary color. */
export function AdvertisementHeader({ tone, label, dateInfo, className }: AdvertisementHeaderProps) {
  return (
    <div
      data-testid="job-card-advertisement-heading"
      data-tone={tone}
      className={cn(
        'tm-flex',
        'tm-min-w-0',
        'tm-flex-col',
        'tm-items-start',
        'tm-gap-0',
        'tm-whitespace-normal',
        'tm-leading-tight',
        LABEL_CLASS[tone],
        className,
      )}
    >
      <span
        data-testid="job-card-advertisement-heading-label"
        className={cn('tm-text-base', LABEL_WEIGHT[tone])}
      >
        {label}
      </span>
      {dateInfo ? (
        <span
          data-testid="job-card-advertisement-heading-date"
          className="tm-text-sm tm-font-normal tm-text-secondary-default"
        >
          {' '}
          {dateInfo}
        </span>
      ) : null}
    </div>
  )
}

AdvertisementHeader.displayName = 'AdvertisementHeader'
