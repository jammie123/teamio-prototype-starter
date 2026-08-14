import type { ValidationState } from './types'

export function validationBorderClass(state: ValidationState = 'default'): string {
  switch (state) {
    case 'success':
      return '!tm-border-emotion-success-active'
    case 'warning':
      return '!tm-border-emotion-warning-active'
    case 'error':
      return '!tm-border-emotion-danger-active'
    default:
      return 'tm-border-secondary'
  }
}

export function validationMessageClass(state: ValidationState = 'default'): string {
  switch (state) {
    case 'success':
      return 'tm-text-emotion-success-active'
    case 'warning':
      return 'tm-text-emotion-warning-active'
    case 'error':
      return 'tm-text-emotion-danger-active'
    default:
      return 'tm-text-secondary-default'
  }
}

export function isInvalid(state: ValidationState = 'default'): boolean | undefined {
  return state === 'error' ? true : undefined
}
