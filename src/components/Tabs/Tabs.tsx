import * as TabsPrimitive from '@radix-ui/react-tabs'
import { forwardRef, type ComponentPropsWithoutRef, type ElementRef } from 'react'
import { cn } from '../../lib/cn'
import { Pill } from '../Pill'

export const Tabs = TabsPrimitive.Root

export const TabsList = forwardRef<
  ElementRef<typeof TabsPrimitive.List>,
  ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(function TabsList({ className, ...rest }, ref) {
  return (
    <TabsPrimitive.List
      ref={ref}
      className={cn(
        'tm-flex',
        'tm-flex-wrap',
        'tm-items-center',
        'tm-gap-2',
        'tm-justify-start',
        'tm-m-0',
        'tm--mx-2',
        'tm-p-0',
        'tm-border-none',
        className,
      )}
      {...rest}
    />
  )
})

TabsList.displayName = 'TabsList'

export interface TabsTriggerProps extends ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> {
  count?: number
}

export const TabsTrigger = forwardRef<
  ElementRef<typeof TabsPrimitive.Trigger>,
  TabsTriggerProps
>(function TabsTrigger({ className, children, count, ...rest }, ref) {
  return (
    <TabsPrimitive.Trigger
      ref={ref}
      className={cn(
        'tm-relative',
        'tm-inline-flex',
        'tm-items-center',
        'tm-gap-2',
        'tm-p-2',
        'tm-m-0',
        'tm-border-0',
        'tm-bg-transparent',
        'tm-cursor-pointer',
        'tm-font-poppins',
        'tm-text-base',
        'tm-font-semibold',
        'tm-text-secondary-default',
        'hover:tm-text-primary-default',
        'active:tm-text-primary-default',
        'focus:tm-outline-0',
        'focus-visible:tm-ring',
        'data-[state=active]:tm-text-primary-default',
        'data-[state=active]:after:tm-absolute',
        'data-[state=active]:after:tm-left-2',
        'data-[state=active]:after:tm-right-2',
        'data-[state=active]:after:tm-bottom-[-1px]',
        'data-[state=active]:after:tm-h-0.5',
        'data-[state=active]:after:tm-bg-teamio-pink',
        'data-[state=active]:after:tm-content-[\'\']',
        'data-[state=active]:after:tm-rounded-b-none',
        'disabled:tm-cursor-not-allowed',
        'disabled:tm-opacity-50',
        className,
      )}
      {...rest}
    >
      {children}
      {count !== undefined ? (
        <Pill
          color="tertiary"
          data-testid="tabs-trigger-count"
          className="tm-flex-none tm-tabular-nums"
        >
          <span className="tm-text-secondary-default">{count}</span>
        </Pill>
      ) : null}
    </TabsPrimitive.Trigger>
  )
})

TabsTrigger.displayName = 'TabsTrigger'

export const TabsContent = forwardRef<
  ElementRef<typeof TabsPrimitive.Content>,
  ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(function TabsContent({ className, ...rest }, ref) {
  return (
    <TabsPrimitive.Content
      ref={ref}
      className={cn('tm-mt-4', 'tm-font-poppins', 'tm-text-base', 'tm-text-primary-default', className)}
      {...rest}
    />
  )
})

TabsContent.displayName = 'TabsContent'

export type TabsProps = ComponentPropsWithoutRef<typeof TabsPrimitive.Root>
export type TabsListProps = ComponentPropsWithoutRef<typeof TabsPrimitive.List>
export type TabsContentProps = ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
