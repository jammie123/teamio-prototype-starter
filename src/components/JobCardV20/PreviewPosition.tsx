import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'
import { Button } from '../Button'
import { Icon } from '../Icon'

export const PREVIEW_POSITION_LABEL = 'Zobrazit náhled'

export interface PreviewPositionProps extends StyleProps {
  onClick?: () => void
}

/** Icon-only button that opens the preview of the position. */
export function PreviewPosition({ onClick, className }: PreviewPositionProps) {
  return (
    <Button
      variant="tertiary"
      isCircle
      aria-label={PREVIEW_POSITION_LABEL}
      title={PREVIEW_POSITION_LABEL}
      data-testid="job-card-preview-position"
      className={cn('tm-shrink-0', className)}
      onClick={onClick}
    >
      <Icon name="position-preview" size={20} aria-hidden />
    </Button>
  )
}

PreviewPosition.displayName = 'PreviewPosition'
