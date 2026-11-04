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

/** Status of the advertisement: label in a tone color with an optional date below. */
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
        'tm-w-[220px]',
        'tm-min-w-[220px]',
        'tm-max-w-[220px]',
        'tm-shrink-0',
        'tm-flex-col',
        'tm-items-start',
        'tm-gap-0',
        'tm-whitespace-normal',
        'tm-text-sm',
        'tm-font-medium',
        LABEL_CLASS[tone],
        className,
      )}
    >
      <span data-testid="job-card-advertisement-heading-label">{label}</span>
      {dateInfo ? (
        <>
          <span aria-hidden="true">{' '}</span>
          <span
            data-testid="job-card-advertisement-heading-date"
            className="tm-font-normal tm-text-secondary-default"
          >
            {dateInfo}
          </span>
        </>
      ) : null}
    </div>
  )
}

AdvertisementHeader.displayName = 'AdvertisementHeader'
