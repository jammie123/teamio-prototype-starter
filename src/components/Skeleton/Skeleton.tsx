import type { CSSProperties, HTMLAttributes } from 'react'
import { cn } from '../../lib/cn'
import type { SkeletonVariant, StyleProps } from '../../lib/types'

export interface SkeletonProps extends StyleProps, Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  variant?: SkeletonVariant
  width?: number | string
  height?: number | string
  isCircle?: boolean
  count?: number
}

export function Skeleton({
  variant = 'light',
  width = 100,
  height = 18,
  isCircle = false,
  count = 1,
  className,
  style,
  ...rest
}: SkeletonProps) {
  const widthValue = typeof width === 'number' ? `${width}px` : width
  const heightValue = typeof height === 'number' ? `${height}px` : height
  const cssVars = {
    ...style,
    '--width': widthValue,
    '--height': heightValue,
  } as CSSProperties

  return (
    <>
      {Array.from({ length: count }, (_, index) => (
        <span
          key={index}
          aria-hidden="true"
          className={cn(
            'tm-relative',
            'tm-inline-flex',
            'tm-items-center',
            'tm-justify-center',
            'tm-max-w-full',
            'tm-w-[var(--width)]',
            'tm-h-[var(--height)]',
            variant === 'dark' ? 'tm-bg-skeleton-dark' : 'tm-bg-skeleton-light',
            'tm-bg-[length:200%_100%]',
            isCircle ? 'tm-rounded-full' : 'tm-rounded-sm',
            'tm-align-middle',
            'tm-overflow-hidden',
            'tm-animate-shimmer',
            className,
          )}
          style={cssVars}
          {...rest}
        />
      ))}
    </>
  )
}
