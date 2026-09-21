import * as DialogPrimitive from '@radix-ui/react-dialog'
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementRef,
  type HTMLAttributes,
} from 'react'
import { cn } from '../../lib/cn'
import type { ChildrenProps, StyleProps } from '../../lib/types'
import { Icon } from '../Icon'

export const Drawer = DialogPrimitive.Root
export const DrawerTrigger = DialogPrimitive.Trigger
export const DrawerPortal = DialogPrimitive.Portal

export const DrawerOverlay = forwardRef<
  ElementRef<typeof DialogPrimitive.Overlay>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(function DrawerOverlay({ className, ...rest }, ref) {
  return (
    <DialogPrimitive.Overlay
      ref={ref}
      data-drawer-overlay=""
      className={cn(
        'tm-fixed',
        'tm-inset-0',
        'tm-z-40',
        'tm-bg-inverted/20',
        className,
      )}
      {...rest}
    />
  )
})

DrawerOverlay.displayName = 'DrawerOverlay'

export const DrawerContent = forwardRef<
  ElementRef<typeof DialogPrimitive.Content>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(function DrawerContent({ className, children, ...rest }, ref) {
  return (
    <DrawerPortal>
      <DrawerOverlay />
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          'tm-fixed',
          'tm-inset-y-0',
          'tm-right-0',
          'tm-z-50',
          'tm-flex',
          'tm-h-full',
          'tm-w-full',
          'sm:tm-w-[480px]',
          'tm-flex-col',
          'tm-overflow-hidden',
          'tm-font-poppins',
          'tm-text-primary-default',
          'tm-bg-basic',
          'tm-text-base',
          'tm-shadow-lg',
          'focus:tm-outline-0',
          className,
        )}
        {...rest}
      >
        {children}
      </DialogPrimitive.Content>
    </DrawerPortal>
  )
})

DrawerContent.displayName = 'DrawerContent'

export const DrawerTitle = forwardRef<
  ElementRef<typeof DialogPrimitive.Title>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(function DrawerTitle({ className, ...rest }, ref) {
  return (
    <div className={cn('tm-shrink-0', 'tm-p-6', 'tm-pr-14')}>
      <DialogPrimitive.Title
        ref={ref}
        className={cn('tm-m-0', 'tm-font-inherit', 'tm-font-semibold', className)}
        {...rest}
      />
    </div>
  )
})

DrawerTitle.displayName = 'DrawerTitle'

export const DrawerDescription = forwardRef<
  ElementRef<typeof DialogPrimitive.Description>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(function DrawerDescription({ className, ...rest }, ref) {
  return (
    <DialogPrimitive.Description
      ref={ref}
      className={cn('tm-px-6', 'tm-py-0', 'tm-m-0', 'tm-text-secondary-default', className)}
      {...rest}
    />
  )
})

DrawerDescription.displayName = 'DrawerDescription'

export interface DrawerBodyProps
  extends StyleProps,
    ChildrenProps,
    Omit<HTMLAttributes<HTMLDivElement>, 'color'> {}

export const DrawerBody = forwardRef<HTMLDivElement, DrawerBodyProps>(function DrawerBody(
  { className, children, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn('tm-px-6', 'tm-py-0', 'tm-overflow-y-auto', 'tm-grow', 'tm-min-h-0', className)}
      {...rest}
    >
      {children}
    </div>
  )
})

DrawerBody.displayName = 'DrawerBody'

export interface DrawerFooterProps
  extends StyleProps,
    ChildrenProps,
    Omit<HTMLAttributes<HTMLDivElement>, 'color'> {}

export const DrawerFooter = forwardRef<HTMLDivElement, DrawerFooterProps>(function DrawerFooter(
  { className, children, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn(
        'tm-shrink-0',
        'tm-bg-basic',
        'tm-p-6',
        'tm-flex',
        'tm-flex-col',
        'tm-gap-3',
        'sm:tm-flex-row',
        'sm:tm-gap-x-4',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  )
})

DrawerFooter.displayName = 'DrawerFooter'

export type DrawerCloseProps = ComponentPropsWithoutRef<typeof DialogPrimitive.Close> & {
  'aria-label': string
}

const closeIconChromeClasses = [
  'tm-absolute',
  'tm-right-4',
  'tm-top-4',
  'tm-inline-flex',
  'tm-items-center',
  'tm-justify-center',
  'tm-rounded',
  'tm-border-0',
  'tm-bg-transparent',
  'tm-p-2',
  'tm-text-xl',
  'tm-text-primary-default',
  'tm-cursor-pointer',
  'focus:tm-outline-0',
  'focus-visible:tm-ring',
]

export const DrawerClose = forwardRef<
  ElementRef<typeof DialogPrimitive.Close>,
  DrawerCloseProps
>(function DrawerClose({ asChild, className, children, ...rest }, ref) {
  const isCustomContent = asChild === true || children !== undefined

  return (
    <DialogPrimitive.Close
      ref={ref}
      asChild={asChild}
      className={isCustomContent ? className : cn(...closeIconChromeClasses, className)}
      {...rest}
    >
      {children ?? <Icon name="x" />}
    </DialogPrimitive.Close>
  )
})

DrawerClose.displayName = 'DrawerClose'

export type DrawerProps = ComponentPropsWithoutRef<typeof DialogPrimitive.Root>
export type DrawerTriggerProps = ComponentPropsWithoutRef<typeof DialogPrimitive.Trigger>
export type DrawerContentProps = ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
export type DrawerTitleProps = ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
export type DrawerDescriptionProps = ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
