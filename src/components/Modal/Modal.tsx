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

export type ModalSize = 'default' | 'wide' | 'full'

export const Modal = DialogPrimitive.Root
export const ModalTrigger = DialogPrimitive.Trigger
export const ModalPortal = DialogPrimitive.Portal

export const ModalOverlay = forwardRef<
  ElementRef<typeof DialogPrimitive.Overlay>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(function ModalOverlay({ className, ...rest }, ref) {
  return (
    <DialogPrimitive.Overlay
      ref={ref}
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

ModalOverlay.displayName = 'ModalOverlay'

export interface ModalContentProps
  extends ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  size?: ModalSize
  overlayClassName?: string
}

export const ModalContent = forwardRef<
  ElementRef<typeof DialogPrimitive.Content>,
  ModalContentProps
>(function ModalContent({ className, overlayClassName, size = 'default', children, ...rest }, ref) {
  return (
    <ModalPortal>
      <ModalOverlay className={overlayClassName} />
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          'tm-fixed',
          'tm-left-1/2',
          'tm-top-1/2',
          'tm-z-50',
          'tm-flex',
          'tm-max-h-[calc(100vh-2rem)]',
          'tm-w-[calc(100%_-_1rem)]',
          'tm--translate-x-1/2',
          'tm--translate-y-1/2',
          'tm-flex-col',
          'tm-overflow-hidden',
          'tm-font-poppins',
          'tm-text-primary-default',
          'tm-bg-basic',
          'tm-text-base',
          'tm-rounded-lg',
          'tm-shadow',
          'focus:tm-outline-0',
          size === 'wide' && 'tm-max-w-[900px]',
          size === 'full' && 'tm-max-w-[1600px] md:tm-w-[90%] lg:tm-w-[80%]',
          size === 'default' && 'tm-max-w-[600px]',
          className,
        )}
        {...rest}
      >
        {children}
      </DialogPrimitive.Content>
    </ModalPortal>
  )
})

ModalContent.displayName = 'ModalContent'

export const ModalTitle = forwardRef<
  ElementRef<typeof DialogPrimitive.Title>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(function ModalTitle({ className, ...rest }, ref) {
  return (
    // tm-pr-14 keeps the title clear of the absolutely positioned ModalClose.
    <div className={cn('tm-p-6', 'tm-pr-14')}>
      <DialogPrimitive.Title
        ref={ref}
        className={cn('tm-m-0', 'tm-font-inherit', 'tm-font-semibold', className)}
        {...rest}
      />
    </div>
  )
})

ModalTitle.displayName = 'ModalTitle'

export const ModalDescription = forwardRef<
  ElementRef<typeof DialogPrimitive.Description>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(function ModalDescription({ className, ...rest }, ref) {
  return (
    <DialogPrimitive.Description
      ref={ref}
      className={cn('tm-px-6', 'tm-py-0', 'tm-m-0', 'tm-text-secondary-default', className)}
      {...rest}
    />
  )
})

ModalDescription.displayName = 'ModalDescription'

export interface ModalBodyProps
  extends StyleProps,
    ChildrenProps,
    Omit<HTMLAttributes<HTMLDivElement>, 'color'> {}

export const ModalBody = forwardRef<HTMLDivElement, ModalBodyProps>(function ModalBody(
  { className, children, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn('tm-px-6', 'tm-py-0', 'tm-overflow-y-auto', 'tm-grow', className)}
      {...rest}
    >
      {children}
    </div>
  )
})

ModalBody.displayName = 'ModalBody'

export interface ModalFooterProps
  extends StyleProps,
    ChildrenProps,
    Omit<HTMLAttributes<HTMLDivElement>, 'color'> {}

export const ModalFooter = forwardRef<HTMLDivElement, ModalFooterProps>(function ModalFooter(
  { className, children, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn(
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

ModalFooter.displayName = 'ModalFooter'

export type ModalCloseProps = ComponentPropsWithoutRef<typeof DialogPrimitive.Close> & {
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

export const ModalClose = forwardRef<
  ElementRef<typeof DialogPrimitive.Close>,
  ModalCloseProps
>(function ModalClose({ asChild, className, children, ...rest }, ref) {
  // Custom content brings its own layout (e.g. a footer Button), so the absolute
  // header chrome only applies to the built-in icon close button.
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

ModalClose.displayName = 'ModalClose'

export type ModalProps = ComponentPropsWithoutRef<typeof DialogPrimitive.Root>
export type ModalTriggerProps = ComponentPropsWithoutRef<typeof DialogPrimitive.Trigger>
export type ModalTitleProps = ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
export type ModalDescriptionProps = ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
