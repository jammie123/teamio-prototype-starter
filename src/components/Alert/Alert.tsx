import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '../../lib/cn'
import type { AlertVariant, ChildrenProps, StyleProps } from '../../lib/types'
import { Icon, type IconName } from '../Icon'

export interface AlertProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'color'>,
    StyleProps,
    ChildrenProps {
  variant?: AlertVariant
  isCentered?: boolean
  icon?: IconName | false
  onDismiss?: () => void
  dismissLabel?: string
}

function defaultIcon(variant: AlertVariant): IconName {
  switch (variant) {
    case 'success':
      return 'check'
    case 'warning':
      return 'warning'
    case 'error':
      return 'warning'
    case 'info':
    default:
      return 'info'
  }
}

function variantClasses(variant: AlertVariant) {
  switch (variant) {
    case 'success':
      return {
        root: 'tm-text-emotion-success-emphasis tm-bg-emotion-success-background tm-border-emotion-success-active',
        icon: 'tm-text-emotion-success-active',
      }
    case 'warning':
      return {
        root: 'tm-text-emotion-warning-emphasis tm-bg-emotion-warning-background tm-border-emotion-warning-active',
        icon: 'tm-text-emotion-warning-active',
      }
    case 'error':
      return {
        root: 'tm-text-emotion-danger-emphasis tm-bg-emotion-danger-background tm-border-emotion-danger-active',
        icon: 'tm-text-emotion-danger-active',
      }
    case 'info':
    default:
      return {
        root: 'tm-text-emotion-info-emphasis tm-bg-emotion-info-background tm-border-emotion-info-active',
        icon: 'tm-text-emotion-info-active',
      }
  }
}

export const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
  {
    variant = 'info',
    isCentered = false,
    icon,
    onDismiss,
    dismissLabel = 'Dismiss',
    className,
    children,
    ...rest
  },
  ref,
) {
  const colors = variantClasses(variant)
  const showIcon = icon !== false
  const iconName: IconName = typeof icon === 'string' ? icon : defaultIcon(variant)
  const liveRole = variant === 'warning' || variant === 'error' ? 'alert' : 'status'

  return (
    <div
      ref={ref}
      role={liveRole}
      className={cn(
        'tm-flex',
        'tm-border',
        'tm-rounded',
        'tm-p-4',
        'tm-gap-4',
        'tm-text-base',
        colors.root,
        isCentered ? 'tm-items-center' : 'tm-items-start',
        className,
      )}
      {...rest}
    >
      {showIcon ? (
        <Icon
          name={iconName}
          className={cn('tm--mt-px', 'tm-text-[1.5rem]', 'tm-shrink-0', colors.icon)}
        />
      ) : null}
      <div className="tm-grow">{children}</div>
      {onDismiss ? (
        <button
          type="button"
          aria-label={dismissLabel}
          onClick={onDismiss}
          className={cn(
            'tm-shrink-0',
            'tm-inline-flex',
            'tm-items-center',
            'tm-justify-center',
            'tm-rounded',
            'tm-p-1',
            'tm-text-[1.25rem]',
            'tm-bg-transparent',
            'tm-border-0',
            'tm-cursor-pointer',
            'focus:tm-outline-0',
            'focus-visible:tm-ring',
          )}
        >
          <Icon name="x" />
        </button>
      ) : null}
    </div>
  )
})

Alert.displayName = 'Alert'
