import { forwardRef, type SelectHTMLAttributes } from 'react'
import { cn } from '../../lib/cn'
import type { InputSize, StyleProps, ValidationState } from '../../lib/types'
import { isInvalid, validationBorderClass } from '../../lib/validation'
import { useResolvedFieldState } from '../FormGroup/FormGroupContext'

export interface SelectProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size' | 'color'>,
    StyleProps {
  size?: InputSize
  validationState?: ValidationState
  isDisabled?: boolean
  isRequired?: boolean
}

function sizeClasses(size: InputSize) {
  return size === 'small'
    ? ['tm-h-8', 'tm-px-3', 'tm-py-2', 'tm-text-sm']
    : ['tm-h-10', 'tm-px-3', 'tm-py-2', 'tm-text-base']
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  {
    size = 'medium',
    validationState,
    isDisabled,
    isRequired,
    disabled,
    required,
    id,
    className,
    children,
    'aria-describedby': ariaDescribedBy,
    ...rest
  },
  ref,
) {
  const resolved = useResolvedFieldState({
    validationState,
    isDisabled,
    isRequired,
    id,
    'aria-describedby': ariaDescribedBy,
  })
  const inactive = Boolean(disabled ?? resolved.isDisabled)
  const isReq = Boolean(required ?? resolved.isRequired)

  return (
    <select
      ref={ref}
      id={resolved.id}
      disabled={inactive}
      required={isReq}
      aria-invalid={isInvalid(resolved.validationState)}
      aria-describedby={resolved.describedBy}
      className={cn(
        'tm-w-full',
        ...sizeClasses(size),
        'tm-font-inherit',
        'tm-text-primary-default',
        'tm-border',
        validationBorderClass(resolved.validationState),
        'tm-bg-basic',
        'tm-rounded',
        'tm-transition-all',
        'focus:tm-outline-0',
        'focus-visible:tm-ring',
        'disabled:tm-text-primary-default',
        'disabled:tm-border-secondary',
        'disabled:tm-bg-basic',
        inactive && 'tm-opacity-50 tm-cursor-not-allowed',
        className,
      )}
      {...rest}
    >
      {children}
    </select>
  )
})

Select.displayName = 'Select'
