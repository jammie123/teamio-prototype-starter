import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'

export interface DividerProps extends StyleProps, HTMLAttributes<HTMLDivElement> {}

export const Divider = forwardRef<HTMLDivElement, DividerProps>(function Divider(
  { className, role = 'separator', ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      role={role}
      className={cn('tm-border-t', 'tm-border-secondary', className)}
      {...rest}
    />
  )
})

Divider.displayName = 'Divider'
