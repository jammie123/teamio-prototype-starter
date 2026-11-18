import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'
import type { AdvertisementTone } from './lib/advertisementModel'

export interface AdvertisementHeaderProps extends StyleProps {
  /** success = Běží, warning = Brzy končí, ended = Ukončeno, neutral = Zatím nevystavený. */
  tone: AdvertisementTone
  label: string
  /** From–to range under the label (`1. 9. – 30. 9. 2026`). */
  dateInfo?: string
  /** Show the status label. Warning and ended tones always show it. */
  showLabel?: boolean
}

const LABEL_CLASS: Record<AdvertisementTone, string> = {
  success: 'tm-text-emotion-success-emphasis',
  warning: 'tm-text-emotion-warning-emphasis',
  ended: 'tm-text-secondary-default',
  neutral: 'tm-text-secondary-default',
}

/** Status of the advertisement: stacked label in a tone color with an optional date below. */
export function AdvertisementHeader({
  tone,
  label,
  dateInfo,
  showLabel = false,
  className,
}: AdvertisementHeaderProps) {
  const showHeadingLabel = showLabel || tone === 'warning' || tone === 'ended' || !dateInfo

  return (
    <div
      data-testid="job-card-advertisement-heading"
      data-tone={tone}
      className={cn(
        'tm-flex',
        'tm-min-w-0',
        'tm-shrink-0',
        'tm-flex-col',
        'tm-items-start',
        'tm-justify-center',
        'tm-gap-0',
        'tm-whitespace-normal',
        'tm-text-sm',
        'tm-leading-tight',
        LABEL_CLASS[tone],
        className,
      )}
    >
      {showHeadingLabel ? (
        <span data-testid="job-card-advertisement-heading-label" className="tm-text-sm tm-font-medium">
          {label}
        </span>
      ) : null}
      {dateInfo ? (
        <span
          data-testid="job-card-advertisement-heading-date"
          className="tm-text-sm tm-font-normal tm-text-secondary-default"
        >
          {dateInfo}
        </span>
      ) : null}
    </div>
  )
}

AdvertisementHeader.displayName = 'AdvertisementHeader'
