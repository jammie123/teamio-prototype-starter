import * as TabsPrimitive from '@radix-ui/react-tabs'
import { forwardRef, type ComponentPropsWithoutRef, type ElementRef } from 'react'
import { cn } from '../../lib/cn'
import { Icon } from '../Icon'
import { Pill } from '../Pill'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../Tooltip'

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
  /** Replaces the count pill with an info icon on hover and shows this tooltip on the icon. */
  info?: string
}

export const TabsTrigger = forwardRef<
  ElementRef<typeof TabsPrimitive.Trigger>,
  TabsTriggerProps
>(function TabsTrigger({ className, children, count, info, ...rest }, ref) {
  return (
    <TabsPrimitive.Trigger
      ref={ref}
      className={cn(
        'tm-group',
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
          className={cn('tm-flex-none', 'tm-tabular-nums', info && 'tm-group-hover:tm-hidden')}
        >
          <span className="tm-text-secondary-default">{count}</span>
        </Pill>
      ) : null}
      {count !== undefined && info ? (
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <span
                data-testid="tabs-trigger-info"
                className="tm-hidden tm-flex-none tm-group-hover:tm-inline-flex"
              >
                <Pill color="informative" className="tm-px-1">
                  <Icon name="info" />
                </Pill>
              </span>
            </TooltipTrigger>
            <TooltipContent side="bottom">{info}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
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
