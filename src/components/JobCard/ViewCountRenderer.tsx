import { cn } from '../../lib/cn'
import { Icon } from '../Icon'
import { formatCount } from './formatCount'

export interface ViewCountRendererProps {
  count: number
  testId?: string
  className?: string
  withIcon?: boolean
}

export function ViewCountRenderer({
  count,
  testId,
  className,
  withIcon = false,
}: ViewCountRendererProps) {
  const formattedCount = formatCount(count)

  if (!withIcon) {
    return (
      <span
        data-testid={testId}
        className={cn(
          'tm-tabular-nums',
          'tm-text-right',
          'tm-text-13',
          'tm-font-normal',
          'tm-text-primary-default',
          className,
        )}
      >
        {formattedCount}
      </span>
    )
  }

  return (
    <div
      data-testid={testId}
      className={cn(
        'tm-inline-grid',
        'tm-grid-cols-[auto_minmax(3ch,max-content)]',
        'tm-items-center',
        'tm-justify-items-end',
        'tm-justify-self-end',
        'tm-gap-1',
        'tm-tabular-nums',
        'tm-text-right',
        'tm-text-13',
        'tm-font-normal',
        'tm-text-primary-default',
        className,
      )}
    >
      <Icon name="eye" />
      {formattedCount}
    </div>
  )
}
