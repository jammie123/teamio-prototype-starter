import type { ButtonSize, ButtonVariant } from '../../lib/types'
import { cn } from '../../lib/cn'

interface ButtonClassProps {
  variant?: ButtonVariant
  size?: ButtonSize
  isBlock?: boolean
  isCircle?: boolean
  isDisabled?: boolean
}

export function buttonClass({
  variant = 'primary',
  size = 'medium',
  isBlock = false,
  isCircle = false,
  isDisabled = false,
}: ButtonClassProps): string {
  const commonClasses = cn(
    'tm-inline-flex',
    'tm-items-center',
    'tm-justify-center',
    'tm-font-poppins',
    'tm-font-semibold',
    'tm-leading-[1.2]',
    'tm-border',
    'tm-rounded-full',
    'hover:tm-no-underline',
    'focus:tm-no-underline',
    'focus-visible:tm-ring',
    'focus-visible:tm-ring-offset-1',
    'focus-visible:tm-outline-0',
    isBlock && 'tm-w-full',
    size === 'medium' && 'tm-text-sm',
    size === 'medium' && !isCircle && 'tm-min-h-8 tm-px-4 tm-py-1 tm-gap-1',
    size === 'medium' && isCircle && 'tm-size-8',
    size === 'small' && 'tm-text-sm',
    size === 'small' && !isCircle && 'tm-min-h-6 tm-px-2 tm-gap-2',
    size === 'small' && isCircle && 'tm-size-6',
    size === 'large' && 'tm-text-base',
    size === 'large' && !isCircle && 'tm-min-h-10 tm-px-6 tm-gap-3',
    size === 'large' && isCircle && 'tm-size-10',
    isDisabled && 'tm-opacity-50 tm-cursor-not-allowed',
  )

  const text = 'tm-text-primary-default hover:tm-text-primary-default focus:tm-text-primary-default'

  switch (variant) {
    case 'primary':
      return cn(
        commonClasses,
        isDisabled
          ? 'tm-bg-action-primary-default tm-border-action-primary-default'
          : [
              text,
              'tm-bg-action-primary-default',
              'tm-border-action-primary-default',
              'hover:tm-bg-action-primary-hover',
              'hover:tm-border-action-primary-hover',
              'active:tm-bg-action-primary-active',
              'active:tm-border-action-primary-active',
            ],
      )
    case 'secondary':
      return cn(
        commonClasses,
        isDisabled
          ? 'tm-bg-basic tm-border-action-secondary-default'
          : [
              text,
              'tm-bg-basic',
              'tm-border-action-secondary-default',
              'hover:tm-bg-interactive-hover',
              'hover:tm-border-action-secondary-hover',
              'active:tm-bg-interactive-active',
              'active:tm-border-action-secondary-active',
            ],
      )
    case 'tertiary':
      return cn(
        commonClasses,
        isDisabled
          ? 'tm-bg-transparent tm-border-transparent'
          : [
              text,
              'tm-bg-transparent',
              'tm-border-transparent',
              'hover:tm-bg-teamio-dark/5',
              'active:tm-bg-teamio-dark/10',
            ],
      )
    case 'danger':
      return cn(
        commonClasses,
        isDisabled
          ? 'tm-bg-action-danger-default tm-border-action-danger-active'
          : [
              text,
              'tm-bg-action-danger-default',
              'tm-border-action-danger-active',
              'hover:tm-bg-action-danger-hover',
              'hover:tm-border-action-danger-active',
              'active:tm-bg-action-danger-active',
              'active:tm-border-action-danger-active',
            ],
      )
    default:
      return commonClasses
  }
}
