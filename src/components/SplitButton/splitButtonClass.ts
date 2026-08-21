import type { ButtonSize } from '../../lib/types'
import { cn } from '../../lib/cn'
import { buttonClass } from '../Button/buttonClass'

export function splitButtonClass(className?: string) {
  return cn('tm-inline-flex tm-items-stretch', className)
}

export function splitButtonMainClass() {
  return cn('tm-rounded-r-none tm-pr-3')
}

export function splitButtonChevronExtras() {
  return cn(
    'tm-rounded-l-none',
    'tm-border-l',
    'tm-border-l-teamio-dark/15',
    'tm-px-2',
    'tm-min-w-8',
  )
}

export function splitButtonDropdownClass() {
  return cn('tm-inline-flex tm-items-stretch')
}

export function splitButtonChevronClass({
  variant,
  size,
  isDisabled,
}: {
  variant: 'primary' | 'secondary'
  size: ButtonSize
  isDisabled: boolean
}) {
  return cn(buttonClass({ variant, size, isDisabled }), splitButtonChevronExtras())
}
