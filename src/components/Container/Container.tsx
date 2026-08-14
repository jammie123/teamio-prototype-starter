import { forwardRef, type CSSProperties, type HTMLAttributes } from 'react'
import { cn } from '../../lib/cn'
import type { ChildrenProps, StyleProps } from '../../lib/types'

export interface ContainerProps
  extends StyleProps,
    ChildrenProps,
    HTMLAttributes<HTMLDivElement> {
  maxWidth?: string
  isCentered?: boolean
  hasPadding?: boolean
}

export const Container = forwardRef<HTMLDivElement, ContainerProps>(function Container(
  {
    maxWidth,
    isCentered = false,
    hasPadding = true,
    children,
    className,
    style,
    ...rest
  },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn(
        '[--container-px:1rem]',
        'sm:[--container-px:2.125rem]',
        'tm-max-w-[calc(var(--container-max-width,100%)+2*var(--container-px,0px))]',
        hasPadding && 'tm-px-[var(--container-px)]',
        isCentered && 'tm-mx-auto',
        className,
      )}
      style={
        {
          ...style,
          ...(maxWidth ? { '--container-max-width': maxWidth } : {}),
        } as CSSProperties
      }
      {...rest}
    >
      {children}
    </div>
  )
})

Container.displayName = 'Container'
