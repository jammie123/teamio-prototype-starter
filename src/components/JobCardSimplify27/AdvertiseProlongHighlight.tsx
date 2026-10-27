import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'
import { Button } from '../Button'
import { channelLogoPresentationClass } from '../JobCardSyntezaAds/JobCardPublicationPortal'
import { JobPortalLogo, jobPortalLogoTypeFromChannel } from '../JobPortalLogo'
import { JOB_CARD_SIMPLIFY_27_CHANNEL_LOGO_SIZE } from './constants'

export interface AdvertiseProlongHighlightProps extends StyleProps {
  channels: string[]
  title: string
  perex?: string
  onProlong?: () => void
  prolongLabel?: string
}

export function AdvertiseProlongHighlight({
  channels,
  title,
  perex,
  onProlong,
  prolongLabel = 'Prodloužit',
  className,
}: AdvertiseProlongHighlightProps) {
  return (
    <div
      data-testid="advertise-prolong-highlight"
      className={cn(
        'tm-flex tm-items-center tm-gap-3 tm-rounded tm-border tm-border-emotion-warning-active tm-bg-emotion-warning-background tm-p-3',
        className,
      )}
    >
      {channels.length > 0 ? (
        <ul className="tm-m-0 tm-flex tm-list-none tm-items-center tm-p-0">
          {channels.map((channel, index) => (
            <li
              key={`${channel}-${index}`}
              className={cn('tm-relative', index > 0 && '-tm-ml-2')}
              style={{ zIndex: index + 1 }}
            >
              <JobPortalLogo
                type={jobPortalLogoTypeFromChannel(channel)}
                title=""
                className={cn(
                  channelLogoPresentationClass(JOB_CARD_SIMPLIFY_27_CHANNEL_LOGO_SIZE),
                  'tm-ring-2 tm-ring-white',
                )}
              />
            </li>
          ))}
        </ul>
      ) : null}
      <div className="tm-min-w-0 tm-flex-1">
        <p className="tm-m-0 tm-text-sm tm-font-medium tm-text-primary-default">{title}</p>
        {perex ? (
          <p className="tm-m-0 tm-text-xs tm-text-secondary-default">{perex}</p>
        ) : null}
      </div>
      {onProlong ? (
        <Button
          variant="primary"
          size="small"
          className="!tm-min-h-7 !tm-shrink-0 !tm-px-3 !tm-py-1"
          data-testid="advertise-prolong-highlight-action"
          onClick={(event) => {
            event.preventDefault()
            event.stopPropagation()
            onProlong()
          }}
        >
          {prolongLabel}
        </Button>
      ) : null}
    </div>
  )
}

AdvertiseProlongHighlight.displayName = 'AdvertiseProlongHighlight'
