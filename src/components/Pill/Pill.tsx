import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '../../lib/cn'
import type { ChildrenProps, StyleProps } from '../../lib/types'
import { Icon } from '../Icon'

export type PillColor =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'informative'
  | 'success'
  | 'warning'
  | 'danger'
  | 'pink'

export interface PillProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, 'color'>,
    StyleProps,
    ChildrenProps {
  color?: PillColor
  onDismiss?: () => void
  dismissLabel?: string
}

function colorClasses(color: PillColor) {
  switch (color) {
    case 'secondary':
      return 'tm-text-primary-inverted-default tm-bg-action-secondary-default'
    case 'tertiary':
      return 'tm-text-primary-default tm-bg-teamio-dark/5'
    case 'informative':
      return 'tm-text-primary-inverted-default tm-bg-emotion-info-active'
    case 'success':
      return 'tm-text-primary-inverted-default tm-bg-emotion-success-active'
    case 'warning':
      return 'tm-text-primary-inverted-default tm-bg-emotion-warning-active'
    case 'pink':
      return 'tm-text-primary-inverted-default tm-bg-teamio-pink'
    case 'danger':
    case 'primary':
    default:
      return 'tm-text-primary-inverted-default tm-bg-emotion-danger-active'
  }
}

export const Pill = forwardRef<HTMLSpanElement, PillProps>(function Pill(
  {
    color = 'primary',
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
        'tm-justify-center',
        'tm-items-center',
        'tm-gap-0.5',
        'tm-min-w-5',
        'tm-h-5',
        'tm-px-1.5',
        'tm-font-poppins',
        'tm-font-semibold',
        'tm-text-xs',
        'tm-leading-none',
        'tm-rounded-full',
        colorClasses(color),
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
            'tm-p-0',
            'tm-bg-transparent',
            'tm-border-0',
            'tm-cursor-pointer',
            'tm-text-[0.875em]',
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

Pill.displayName = 'Pill'
