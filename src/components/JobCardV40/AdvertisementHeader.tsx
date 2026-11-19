import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'
import type { AdvertisementTone } from './lib/advertisementModel'

export interface AdvertisementHeaderProps extends StyleProps {
  /** success = Běží, warning = Brzy končí / Expirováno před N dny, ended = Expirováno / Ukončené vystavování, neutral = Zatím nevystavený. */
  tone: AdvertisementTone
  /** Omitted (and not rendered) while the advertisement runs; the date is enough then. */
  label?: string
  /** From–to range next to the label (`1. 9. – 30. 9. 2026`). */
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

/**
 * Status of the advertisement: label in a tone color with an optional date beside it.
 * Running advertisements carry no label, so only the date is shown.
 */
export function AdvertisementHeader({ tone, label, dateInfo, className }: AdvertisementHeaderProps) {
  if (!label && !dateInfo) {
    return null
  }

  return (
    <div
      data-testid="job-card-advertisement-heading"
      data-tone={tone}
      className={cn(
        'tm-flex',
        'tm-w-full',
        'tm-min-w-0',
        'tm-flex-row',
        'tm-flex-wrap',
        'tm-items-start',
        'tm-justify-start',
        'tm-gap-8',
        'md:tm-items-baseline',
        'md:tm-gap-0',
        label && dateInfo && 'md:tm-justify-between',
        'tm-whitespace-normal',
        'tm-text-sm',
        LABEL_CLASS[tone],
        className,
      )}
    >
      {label ? (
        <span
          data-testid="job-card-advertisement-heading-label"
          className={cn('tm-text-sm', LABEL_WEIGHT[tone])}
        >
          {label}
        </span>
      ) : null}
      {dateInfo ? (
        <span
          data-testid="job-card-advertisement-heading-date"
          className="tm-text-sm tm-font-normal tm-text-secondary-default"
        >
          {label ? ' ' : null}
          {dateInfo}
        </span>
      ) : null}
    </div>
  )
}

AdvertisementHeader.displayName = 'AdvertisementHeader'
