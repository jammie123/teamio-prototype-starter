import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cn } from '../../lib/cn'
import type { ButtonSize, ButtonVariant, ChildrenProps, StyleProps } from '../../lib/types'
import { buttonClass } from './buttonClass'

export interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'color'>,
    StyleProps,
    ChildrenProps {
  variant?: ButtonVariant
  size?: ButtonSize
  isBlock?: boolean
  isCircle?: boolean
  isDisabled?: boolean
  isLoading?: boolean
}

function ButtonSpinner() {
  return (
    <span
      data-testid="button-spinner"
      aria-hidden="true"
      className={cn(
        'tm-relative',
        'tm-inline-block',
        'tm-h-[1em]',
        'tm-w-[1em]',
        'before:tm-absolute',
        'before:tm-inset-0',
        'before:tm-rounded-full',
        'before:tm-border-2',
        'before:tm-border-current',
        'before:tm-opacity-20',
        'after:tm-absolute',
        'after:tm-inset-0',
        'after:tm-animate-spin',
        'after:tm-rounded-full',
        'after:tm-border-2',
        'after:tm-border-current',
        'after:tm-border-b-transparent',
        'after:tm-border-r-transparent',
      )}
    />
  )
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    type = 'button',
    variant = 'primary',
    size = 'medium',
    isBlock = false,
    isCircle = false,
    isDisabled = false,
    isLoading = false,
    className,
    children,
    disabled,
    ...rest
  },
  ref,
) {
  const inactive = isDisabled || isLoading || Boolean(disabled)

  return (
    <button
      ref={ref}
      type={type}
      disabled={inactive}
      aria-busy={isLoading || undefined}
      className={cn(
        buttonClass({ variant, size, isBlock, isCircle, isDisabled: inactive }),
        className,
      )}
      {...rest}
    >
      {isLoading ? <ButtonSpinner /> : null}
      {children}
    </button>
  )
})

Button.displayName = 'Button'
