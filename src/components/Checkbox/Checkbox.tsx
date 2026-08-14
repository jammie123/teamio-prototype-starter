import {
  forwardRef,
  useEffect,
  useId,
  useRef,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react'
import { cn } from '../../lib/cn'
import type { StyleProps, ValidationState } from '../../lib/types'
import { isInvalid } from '../../lib/validation'
import { useResolvedFieldState } from '../FormGroup/FormGroupContext'

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size' | 'color'>,
    StyleProps {
  validationState?: ValidationState
  isDisabled?: boolean
  isRequired?: boolean
  indeterminate?: boolean
  children?: ReactNode
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  {
    validationState,
    isDisabled,
    isRequired,
    indeterminate = false,
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
  const localRef = useRef<HTMLInputElement | null>(null)
  const state = resolved.validationState
  const inactive = Boolean(disabled ?? resolved.isDisabled)
  const isReq = Boolean(required ?? resolved.isRequired)
  const inputId = resolved.id ?? generatedId
  const error = state === 'error'

  useEffect(() => {
    const node = localRef.current
    if (node) node.indeterminate = indeterminate
  }, [indeterminate])

  const setRefs = (node: HTMLInputElement | null) => {
    localRef.current = node
    if (typeof ref === 'function') ref(node)
    else if (ref) ref.current = node
  }

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
          ref={setRefs}
          id={inputId}
          type="checkbox"
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
            'tm-text-secondary-default',
            'tm-border-2',
            error ? '!tm-border-emotion-danger-active' : 'tm-border-current',
            'tm-rounded-[.25rem]',
            'tm-bg-basic',
            'tm-bg-contain',
            'focus:tm-outline-0',
            'focus-visible:tm-ring',
            'checked:tm-text-action-selected-active',
            'checked:tm-bg-current',
            'checked:tm-bg-checkbox-checked',
            'indeterminate:tm-text-action-selected-active',
            'indeterminate:tm-bg-current',
            'indeterminate:tm-bg-checkbox-indeterminate',
            inactive && 'tm-cursor-not-allowed',
          )}
          {...rest}
        />
      </span>
      {children ? <label htmlFor={inputId}>{children}</label> : null}
    </span>
  )
})

Checkbox.displayName = 'Checkbox'
