import { forwardRef, type ElementType, type HTMLAttributes } from 'react'
import { cn } from '../../lib/cn'
import type { CardElement, ChildrenProps, StyleProps } from '../../lib/types'

export interface CardProps
  extends StyleProps,
    ChildrenProps,
    Omit<HTMLAttributes<HTMLElement>, 'color'> {
  as?: CardElement
}

export const Card = forwardRef<HTMLElement, CardProps>(function Card(
  { as = 'section', className, children, ...rest },
  ref,
) {
  const Component = as as ElementType

  return (
    <Component
      ref={ref}
      className={cn(
        'tm-rounded',
        'tm-border',
        'tm-border-secondary',
        'tm-bg-basic',
        'tm-p-4',
        'tm-shadow-xs',
        className,
      )}
      {...rest}
    >
      {children}
    </Component>
  )
})

Card.displayName = 'Card'
