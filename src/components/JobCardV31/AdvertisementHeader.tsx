import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'
import type { AdvertisementTone } from './lib/advertisementModel'

export interface AdvertisementHeaderProps extends StyleProps {
  /** success = Běží, warning = Brzy končí, ended = Ukončeno, neutral = Zatím nevystavený. */
  tone: AdvertisementTone
  label: string
  /** From–to range next to the label (`1. 9. – 30. 9. 2026`). */
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

const BG_CLASS: Record<AdvertisementTone, string | undefined> = {
  success: 'tm-bg-emotion-success-default/20',
  warning: 'tm-bg-emotion-warning-default/30',
  ended: 'tm-bg-cover-light',
  neutral: undefined,
}

/** Status of the advertisement: label in a tone color with an optional date beside it. */
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
        'tm-w-full',
        'tm-min-w-0',
        'tm-flex-row',
        'tm-flex-wrap',
        'tm-items-start',
        'tm-justify-start',
        'tm-gap-8',
        'md:tm-items-baseline',
        'md:tm-gap-0',
        showHeadingLabel && dateInfo && 'md:tm-justify-between',
        'tm-whitespace-normal',
        'tm-text-sm',
        'tm-font-medium',
        'tm-px-3',
        'tm-py-1',
        'tm-rounded-full',
        BG_CLASS[tone],
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
          {' '}
          {dateInfo}
        </span>
      ) : null}
    </div>
  )
}

AdvertisementHeader.displayName = 'AdvertisementHeader'
