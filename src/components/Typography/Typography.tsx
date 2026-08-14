import { forwardRef, type ElementType, type HTMLAttributes } from 'react'
import { cn } from '../../lib/cn'
import type { ChildrenProps, StyleProps, TypographyElement, TypographyVariant } from '../../lib/types'

const variantClass: Record<TypographyVariant, string> = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  h6: 'h6',
  body: '',
  caption: 'tm-text-sm tm-text-secondary-default',
}

const defaultElement: Record<TypographyVariant, TypographyElement> = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  h6: 'h6',
  body: 'p',
  caption: 'span',
}

export interface TypographyProps
  extends StyleProps,
    ChildrenProps,
    Omit<HTMLAttributes<HTMLElement>, 'color'> {
  as?: TypographyElement
  variant?: TypographyVariant
}

export const Typography = forwardRef<HTMLElement, TypographyProps>(function Typography(
  { as, variant = 'body', className, children, ...rest },
  ref,
) {
  const Component = (as ?? defaultElement[variant]) as ElementType

  return (
    <Component
      ref={ref}
      className={cn(variantClass[variant], className)}
      {...rest}
    >
      {children}
    </Component>
  )
})

Typography.displayName = 'Typography'
