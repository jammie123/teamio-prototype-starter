import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'
import { Button } from '../Button'
import { Icon } from '../Icon'

export interface AdvertiseDisappearanceNoticeProps extends StyleProps {
  message: string
  onProlong?: () => void
  prolongLabel?: string
}

export function AdvertiseDisappearanceNotice({
  message,
  onProlong,
  prolongLabel = 'Prodloužit',
  className,
}: AdvertiseDisappearanceNoticeProps) {
  return (
    <div
      data-testid="job-card-disappearance-notice"
      className={cn(
        'tm-flex tm-items-center tm-gap-3 tm-rounded tm-bg-emotion-warning-background tm-px-3 tm-py-2',
        className,
      )}
    >
      <Icon name="clock" size={20} className="tm-shrink-0 tm-text-emotion-warning-emphasis" />
      <p className="tm-m-0 tm-min-w-0 tm-flex-1 tm-text-sm tm-text-primary-default">{message}</p>
      <Button
        variant="primary"
        size="small"
        className="!tm-min-h-8 !tm-shrink-0 !tm-px-4"
        data-testid="job-card-disappearance-prolong"
        onClick={(event) => {
          event.preventDefault()
          event.stopPropagation()
          onProlong?.()
        }}
      >
        {prolongLabel}
      </Button>
    </div>
  )
}

AdvertiseDisappearanceNotice.displayName = 'AdvertiseDisappearanceNotice'
