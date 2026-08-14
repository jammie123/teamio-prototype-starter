import { forwardRef, type TextareaHTMLAttributes } from 'react'
import { cn } from '../../lib/cn'
import type { InputSize, StyleProps, ValidationState } from '../../lib/types'
import { isInvalid, validationBorderClass } from '../../lib/validation'
import { useResolvedFieldState } from '../FormGroup/FormGroupContext'

export interface TextAreaProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'color'>,
    StyleProps {
  size?: InputSize
  validationState?: ValidationState
  isDisabled?: boolean
  isRequired?: boolean
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(function TextArea(
  {
    size = 'medium',
    rows = 3,
    validationState,
    isDisabled,
    isRequired,
    disabled,
    required,
    id,
    className,
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
    <textarea
      ref={ref}
      id={resolved.id}
      rows={rows}
      disabled={inactive}
      required={isReq}
      aria-invalid={isInvalid(resolved.validationState)}
      aria-describedby={resolved.describedBy}
      className={cn(
        'tm-w-full',
        'tm-px-3',
        'tm-py-2',
        size === 'small' ? 'tm-text-sm' : 'tm-text-base',
        'tm-font-inherit',
        'tm-text-primary-default',
        'tm-border',
        validationBorderClass(resolved.validationState),
        'tm-bg-basic',
        'tm-rounded',
        'tm-transition-all',
        'focus:tm-outline-0',
        'focus-visible:tm-ring',
        'placeholder:tm-text-secondary-default',
        'disabled:tm-text-primary-default',
        'disabled:tm-border-secondary',
        'disabled:tm-bg-basic',
        inactive && 'tm-opacity-50 tm-cursor-not-allowed',
        className,
      )}
      {...rest}
    />
  )
})

TextArea.displayName = 'TextArea'
