import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '../../lib/cn'
import type { ChildrenProps, StyleProps } from '../../lib/types'
import { Icon } from '../Icon'

export type TagColor = 'neutral' | 'informative' | 'success' | 'warning' | 'danger'

export interface TagProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, 'color'>,
    StyleProps,
    ChildrenProps {
  color?: TagColor
  isSubtle?: boolean
  onDismiss?: () => void
  dismissLabel?: string
}

function colorClasses(color: TagColor, isSubtle: boolean) {
  if (isSubtle) {
    switch (color) {
      case 'informative':
        return 'tm-text-emotion-info-emphasis tm-bg-emotion-info-background'
      case 'success':
        return 'tm-text-emotion-success-emphasis tm-bg-emotion-success-background'
      case 'warning':
        return 'tm-text-emotion-warning-emphasis tm-bg-emotion-warning-background'
      case 'danger':
        return 'tm-text-emotion-danger-emphasis tm-bg-emotion-danger-background'
      case 'neutral':
      default:
        return 'tm-text-secondary-default tm-bg-cover-dark'
    }
  }

  switch (color) {
    case 'informative':
      return 'tm-text-primary-inverted-default tm-bg-emotion-info-active'
    case 'success':
      return 'tm-text-primary-inverted-default tm-bg-emotion-success-active'
    case 'warning':
      return 'tm-text-primary-inverted-default tm-bg-emotion-warning-hover'
    case 'danger':
      return 'tm-text-primary-inverted-default tm-bg-emotion-danger-active'
    case 'neutral':
    default:
      return 'tm-text-primary-inverted-default tm-bg-text-secondary-default'
  }
}

export const Tag = forwardRef<HTMLSpanElement, TagProps>(function Tag(
  {
    color = 'neutral',
    isSubtle = false,
    onDismiss,
    dismissLabel = 'Dismiss',
    className,
    children,
    ...rest
  },
  ref,
) {
  return (
    <span
      ref={ref}
      className={cn(
        'tm-inline-flex',
        'tm-items-center',
        'tm-gap-1',
        'tm-min-h-6',
        'tm-px-2',
        'tm-py-0.5',
        'tm-font-poppins',
        'tm-text-sm',
        'tm-font-normal',
        'tm-border-0',
        'tm-rounded-full',
        colorClasses(color, isSubtle),
        className,
      )}
      {...rest}
    >
      {children}
      {onDismiss ? (
        <button
          type="button"
          aria-label={dismissLabel}
          onClick={onDismiss}
          className={cn(
            'tm-inline-flex',
            'tm-items-center',
            'tm-justify-center',
            'tm-rounded-full',
            'tm-p-0.5',
            'tm-bg-transparent',
            'tm-border-0',
            'tm-cursor-pointer',
            'tm-text-[1em]',
            'focus:tm-outline-0',
            'focus-visible:tm-ring',
          )}
        >
          <Icon name="x" />
        </button>
      ) : null}
    </span>
  )
})

Tag.displayName = 'Tag'
