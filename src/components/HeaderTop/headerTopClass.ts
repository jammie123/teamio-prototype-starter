import { cn } from '../../lib/cn'

export function headerTopClass(className?: string) {
  return cn(
    'tm-flex',
    'tm-w-full',
    'tm-items-center',
    'tm-justify-between',
    'tm-gap-4',
    'tm-bg-basic',
    'tm-px-4',
    'tm-py-3',
    'tm-font-poppins',
    className,
  )
}

export function headerTopSearchClass() {
  return cn(
    'tm-w-full',
    'tm-max-w-md',
    'tm-rounded-full',
    'tm-border-transparent',
    'tm-bg-cover-light',
    'tm-pl-10',
    'hover:tm-border-transparent',
    'focus:tm-border-transparent',
  )
}

export function headerTopActionsClass() {
  return cn('tm-flex', 'tm-shrink-0', 'tm-items-center', 'tm-gap-2')
}

export function headerTopUserToggleClass() {
  return cn(
    'tm-gap-2',
    'tm-rounded-full',
    'tm-px-2',
    'tm-py-1',
    'hover:tm-bg-teamio-dark/5',
  )
}

export function headerTopChevronClass() {
  return cn(
    'tm-inline-flex',
    'tm-size-6',
    'tm-shrink-0',
    'tm-items-center',
    'tm-justify-center',
    'tm-rounded-full',
    'tm-bg-teamio-dark/5',
    'tm-text-sm',
    'tm-text-primary-default',
  )
}

export function headerTopIconButtonWrapClass() {
  return cn('tm-relative', 'tm-inline-flex')
}

export function headerTopBadgeClass() {
  return cn(
    'tm-absolute',
    'tm--right-0.5',
    'tm--top-0.5',
    'tm-min-w-4',
    'tm-h-4',
    'tm-px-1',
    'tm-text-[0.625rem]',
    'tm-pointer-events-none',
  )
}
