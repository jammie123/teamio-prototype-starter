import { cn } from '../../lib/cn'
import { Icon } from '../Icon'
import { Tooltip, TooltipContent, TooltipTrigger } from '../Tooltip'
import { formatCount } from './formatCount'

export interface ViewCountRendererProps {
  count: number
  testId?: string
  className?: string
}

export function ViewCountRenderer({ count, testId, className }: ViewCountRendererProps) {
  const formattedCount = formatCount(count)
  const label = `Počet zhlédnutí: ${formattedCount}`

  return (
    <Tooltip delayDuration={0}>
      <TooltipTrigger asChild>
        <button
          type="button"
          data-testid={testId}
          aria-label={label}
          className={cn(
            'tm-inline-flex',
            'tm-items-center',
            'tm-gap-1',
            'tm-border-0',
            'tm-bg-transparent',
            'tm-p-0',
            'tm-text-13',
            'tm-font-normal',
            'tm-text-primary-default',
            'tm-cursor-default',
            'focus-visible:tm-rounded-sm',
            'focus-visible:tm-outline-0',
            'focus-visible:tm-ring',
            className,
          )}
        >
          <Icon name="eye" />
          {formattedCount}
        </button>
      </TooltipTrigger>
      <TooltipContent>Počet zhlédnutí</TooltipContent>
    </Tooltip>
  )
}
