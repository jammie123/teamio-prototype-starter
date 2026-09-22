import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'
import { Button } from '../Button'
import { Icon } from '../Icon'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../Tooltip'

export const JOB_CARD_PREVIEW_LABEL = 'Zobrazit náhled inzerátu'

export interface JobCardPreviewButtonProps extends StyleProps {
  onPreviewAdvertisement?: () => void
}

export function JobCardPreviewButton({
  onPreviewAdvertisement,
  className,
}: JobCardPreviewButtonProps) {
  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className={cn('tm-inline-flex tm-flex-none', className)}>
            <Button
              variant="tertiary"
              isCircle
              aria-label={JOB_CARD_PREVIEW_LABEL}
              data-testid="job-card-preview-toggle"
              onClick={onPreviewAdvertisement}
            >
              <Icon name="search" strokeWidth={2.5} />
            </Button>
          </span>
        </TooltipTrigger>
        <TooltipContent side="bottom">{JOB_CARD_PREVIEW_LABEL}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

JobCardPreviewButton.displayName = 'JobCardPreviewButton'
