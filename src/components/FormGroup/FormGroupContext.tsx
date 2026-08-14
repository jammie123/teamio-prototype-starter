import { createContext, useContext } from 'react'
import type { ValidationState } from '../../lib/types'

export interface FormGroupContextValue {
  controlId: string
  messageId: string
  validationState: ValidationState
  isDisabled: boolean
  isRequired: boolean
  hasMessage: boolean
  registerMessage: (registered: boolean) => void
}

export const FormGroupContext = createContext<FormGroupContextValue | null>(null)

export function useFormGroupContext(): FormGroupContextValue | null {
  return useContext(FormGroupContext)
}

export function useResolvedFieldState(options: {
  validationState?: ValidationState
  isDisabled?: boolean
  isRequired?: boolean
  id?: string
  'aria-describedby'?: string
  // Single-control fields (Input, TextArea, Select) adopt the group control id so
  // FormLabel can point at them. Checkbox and Radio must opt out: a group can hold
  // several of them and sharing one id would emit duplicates.
  useFormGroupControlId?: boolean
}) {
  const context = useFormGroupContext()
  const adoptsGroupControlId = options.useFormGroupControlId ?? true
  const validationState = options.validationState ?? context?.validationState ?? 'default'
  const isDisabled = options.isDisabled ?? context?.isDisabled ?? false
  const isRequired = options.isRequired ?? context?.isRequired ?? false
  const id = options.id ?? (adoptsGroupControlId ? context?.controlId : undefined)
  const describedBy =
    options['aria-describedby'] ??
    (context?.hasMessage ? context.messageId : undefined)

  return { context, validationState, isDisabled, isRequired, id, describedBy }
}
