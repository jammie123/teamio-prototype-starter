import { useEffect, type HTMLAttributes } from 'react'
import { cn } from '../../lib/cn'
import type { ChildrenProps, StyleProps, ValidationState } from '../../lib/types'
import { validationMessageClass } from '../../lib/validation'
import { useFormGroupContext } from '../FormGroup/FormGroupContext'

export interface FormMessageProps
  extends StyleProps,
    ChildrenProps,
    Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'color'> {
  validationState?: ValidationState
}

export function FormMessage({
  validationState,
  className,
  children,
  id,
  ...rest
}: FormMessageProps) {
  const context = useFormGroupContext()
  const state = validationState ?? context?.validationState ?? 'default'
  const messageId = id ?? context?.messageId

  const registerMessage = context?.registerMessage

  useEffect(() => {
    if (!registerMessage) return
    registerMessage(true)
    return () => registerMessage(false)
  }, [registerMessage])

  const role = state === 'error' ? 'alert' : 'status'

  return (
    <div
      id={messageId}
      role={role}
      className={cn('tm-text-sm', validationMessageClass(state), className)}
      {...rest}
    >
      {children}
    </div>
  )
}
