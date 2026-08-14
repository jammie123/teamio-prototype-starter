import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import { forwardRef, type ComponentPropsWithoutRef, type ElementRef } from 'react'
import { cn } from '../../lib/cn'

export const TooltipProvider = TooltipPrimitive.Provider
export const Tooltip = TooltipPrimitive.Root
export const TooltipTrigger = TooltipPrimitive.Trigger

export const TooltipContent = forwardRef<
  ElementRef<typeof TooltipPrimitive.Content>,
  ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(function TooltipContent({ className, sideOffset = 6, children, ...rest }, ref) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        ref={ref}
        sideOffset={sideOffset}
        className={cn(
          'tm-z-10',
          'tm-max-w-full',
          'tm-font-poppins',
          'tm-text-sm',
          'tm-leading-normal',
          'tm-px-3',
          'tm-py-2',
          'tm-text-primary-inverted-default',
          'tm-bg-inverted',
          'tm-rounded',
          className,
        )}
        {...rest}
      >
        {children}
        <TooltipPrimitive.Arrow width={13} height={8} className="tm-fill-teamio-dark" />
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  )
})

TooltipContent.displayName = 'TooltipContent'

export type TooltipProviderProps = ComponentPropsWithoutRef<typeof TooltipPrimitive.Provider>
export type TooltipProps = ComponentPropsWithoutRef<typeof TooltipPrimitive.Root>
export type TooltipTriggerProps = ComponentPropsWithoutRef<typeof TooltipPrimitive.Trigger>
export type TooltipContentProps = ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
