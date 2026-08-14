import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from 'react'
import { cn } from '../../lib/cn'
import type { StyleProps, ValidationState } from '../../lib/types'
import { isInvalid } from '../../lib/validation'
import { useResolvedFieldState } from '../FormGroup/FormGroupContext'

export interface RadioProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size' | 'color'>,
    StyleProps {
  validationState?: ValidationState
  isDisabled?: boolean
  isRequired?: boolean
  children?: ReactNode
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio(
  {
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
    useFormGroupControlId: false,
  })
  const generatedId = useId()
  const state = resolved.validationState
  const inactive = Boolean(disabled ?? resolved.isDisabled)
  const isReq = Boolean(required ?? resolved.isRequired)
  const inputId = resolved.id ?? generatedId
  const error = state === 'error'

  return (
    <span
      className={cn(
        'tm-inline-flex',
        'tm-items-baseline',
        'tm-gap-2',
        inactive && 'tm-opacity-50',
        className,
      )}
    >
      <span className={cn('tm-inline-flex', 'tm-items-center')}>
        {'\u200B'}
        <input
          ref={ref}
          id={inputId}
          type="radio"
          disabled={inactive}
          required={isReq}
          aria-invalid={isInvalid(state)}
          aria-describedby={resolved.describedBy}
          className={cn(
            '!tm-relative',
            '!tm-opacity-100',
            '!tm-m-0',
            '!tm-outline-0',
            'tm-w-[1.125rem]',
            'tm-h-[1.125rem]',
            'tm-appearance-none',
            'tm-inline-grid',
            'tm-place-content-center',
            'tm-text-secondary-default',
            'tm-border-2',
            error ? '!tm-border-emotion-danger-active' : 'tm-border-current',
            'tm-rounded-full',
            'tm-bg-basic',
            'tm-bg-contain',
            'before:tm-w-2',
            'before:tm-h-2',
            'before:tm-bg-action-selected-active',
            'before:tm-rounded-full',
            'before:tm-scale-0',
            'before:tm-transition-transform',
            'focus:tm-outline-0',
            'focus-visible:tm-ring',
            'checked:tm-text-action-selected-active',
            'checked:before:tm-scale-100',
            inactive && 'tm-cursor-not-allowed',
          )}
          {...rest}
        />
      </span>
      {children ? <label htmlFor={inputId}>{children}</label> : null}
    </span>
  )
})

Radio.displayName = 'Radio'
