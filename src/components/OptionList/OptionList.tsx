import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '../../lib/cn'
import type { ChildrenProps, StyleProps } from '../../lib/types'

export interface OptionListProps
  extends StyleProps,
    ChildrenProps,
    Omit<HTMLAttributes<HTMLDivElement>, 'children'> {}

export const OptionList = forwardRef<HTMLDivElement, OptionListProps>(function OptionList(
  { children, className, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      data-testid="option-list"
      role="listbox"
      className={cn('tm-flex', 'tm-flex-col', 'tm-gap-y-0.5', className)}
      {...rest}
    >
      {children}
    </div>
  )
})

OptionList.displayName = 'OptionList'
