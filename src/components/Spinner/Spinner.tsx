import type { HTMLAttributes } from 'react'
import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'

export interface SpinnerProps extends StyleProps, Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  label?: string
}

export function Spinner({ label = 'Loading', className, ...rest }: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label={label}
      className={cn(
        'tm-relative',
        'tm-inline-block',
        'tm-h-[1em]',
        'tm-w-[1em]',
        'before:tm-absolute',
        'before:tm-inset-0',
        'before:tm-rounded-full',
        'before:tm-border-2',
        'before:tm-border-current',
        'before:tm-opacity-20',
        'after:tm-absolute',
        'after:tm-inset-0',
        'after:tm-animate-spin',
        'after:tm-rounded-full',
        'after:tm-border-2',
        'after:tm-border-current',
        'after:tm-border-b-transparent',
        'after:tm-border-r-transparent',
        className,
      )}
      {...rest}
    />
  )
}
