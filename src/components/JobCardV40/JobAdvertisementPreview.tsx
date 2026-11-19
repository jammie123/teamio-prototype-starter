import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'
import { Icon } from '../Icon'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../Tooltip'
import { JOB_CARD_HEADER_CAPSULE_CLASS } from './layout'

export interface JobAdvertisementPreviewProps extends StyleProps {
  onClick?: () => void
}

/** Header capsule: advertisement document icon; hover shows a tooltip, click opens the ad preview. */
export function JobAdvertisementPreview({ onClick, className }: JobAdvertisementPreviewProps) {
  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            role="button"
            tabIndex={0}
            aria-label="Náhled inzerátu"
            data-testid="job-card-header-advertisement-preview"
            className={cn(JOB_CARD_HEADER_CAPSULE_CLASS, 'tm-shrink-0 tm-cursor-pointer', className)}
            onClick={(event) => {
              event.stopPropagation()
              onClick?.()
            }}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault()
                onClick?.()
              }
            }}
          >
            <Icon name="advertisement-doc" size={16} aria-hidden />
          </div>
        </TooltipTrigger>
        <TooltipContent side="top">Náhled inzerátu</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

JobAdvertisementPreview.displayName = 'JobAdvertisementPreview'
