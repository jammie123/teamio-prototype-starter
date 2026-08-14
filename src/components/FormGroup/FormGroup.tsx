import { useId, useMemo, useState, type HTMLAttributes } from 'react'
import { cn } from '../../lib/cn'
import type { ChildrenProps, StyleProps, ValidationState } from '../../lib/types'
import { FormGroupContext } from './FormGroupContext'

export interface FormGroupProps
  extends StyleProps,
    ChildrenProps,
    Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  validationState?: ValidationState
  isDisabled?: boolean
  isRequired?: boolean
  id?: string
}

export function FormGroup({
  validationState = 'default',
  isDisabled = false,
  isRequired = false,
  id,
  className,
  children,
  ...rest
}: FormGroupProps) {
  const reactId = useId()
  const controlId = id ?? `tm-control-${reactId}`
  const messageId = `tm-message-${reactId}`
  const [hasMessage, setHasMessage] = useState(false)

  const value = useMemo(
    () => ({
      controlId,
      messageId,
      validationState,
      isDisabled,
      isRequired,
      hasMessage,
      registerMessage: setHasMessage,
    }),
    [controlId, messageId, validationState, isDisabled, isRequired, hasMessage],
  )

  return (
    <div
      className={cn(
        'tm-w-full',
        'tm-flex',
        'tm-flex-col',
        'tm-items-start',
        'tm-gap-1',
        // No group-level dimming: disabled controls already render their own
        // opacity layer, so stacking would double-dim them.
        className,
      )}
      {...rest}
    >
      <FormGroupContext.Provider value={value}>{children}</FormGroupContext.Provider>
    </div>
  )
}
