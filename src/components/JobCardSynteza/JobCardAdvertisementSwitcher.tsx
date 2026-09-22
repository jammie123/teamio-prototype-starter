import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'
import { Button } from '../Button'
import { Icon } from '../Icon'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../Tooltip'

export interface JobCardAdvertisementSwitcherProps extends StyleProps {
  title: string
  index: number
  total: number
  onPrev: () => void
  onNext: () => void
  hideTitle?: boolean
}

function SwitcherArrow({
  label,
  testId,
  onClick,
  icon,
}: {
  label: string
  testId: string
  onClick: () => void
  icon: 'chevron-left' | 'chevron-right'
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="tertiary"
          size="small"
          isCircle
          aria-label={label}
          data-testid={testId}
          onClick={onClick}
        >
          <Icon name={icon} />
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom">{label}</TooltipContent>
    </Tooltip>
  )
}

export function JobCardAdvertisementSwitcher({
  title,
  index,
  total,
  onPrev,
  onNext,
  hideTitle = false,
  className,
}: JobCardAdvertisementSwitcherProps) {
  return (
    <TooltipProvider delayDuration={200}>
      <div
        data-testid="job-card-advertisement-switcher"
        className={cn(
          'tm-flex',
          'tm-items-center',
          hideTitle ? 'tm-justify-end' : 'tm-justify-between',
          'tm-gap-2',
          className,
        )}
      >
        {hideTitle ? null : (
          <span
            data-testid="job-card-advertisement-title"
            className="tm-min-w-0 tm-truncate tm-text-sm tm-font-medium tm-text-primary-default"
          >
            {title}
          </span>
        )}
        <div className="tm-flex tm-shrink-0 tm-items-center tm-gap-1 tm-text-sm tm-text-secondary-default">
          <SwitcherArrow
            label="Zobrazit předchozí inzerát"
            testId="job-card-advertisement-switcher-prev"
            onClick={onPrev}
            icon="chevron-left"
          />
          <span data-testid="job-card-advertisement-switcher-index" className="tm-tabular-nums">
            {`${index + 1}/${total}`}
          </span>
          <SwitcherArrow
            label="Zobrazit další inzerát"
            testId="job-card-advertisement-switcher-next"
            onClick={onNext}
            icon="chevron-right"
          />
        </div>
      </div>
    </TooltipProvider>
  )
}

JobCardAdvertisementSwitcher.displayName = 'JobCardAdvertisementSwitcher'
