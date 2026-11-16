import { forwardRef, type ReactNode } from 'react'
import { Button, type ButtonProps } from '../Button'
import { Icon, type IconName } from '../Icon'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../Tooltip'

export interface IconButtonProps extends Omit<ButtonProps, 'children' | 'isCircle' | 'aria-label'> {
  /** Name of the icon rendered inside the circle. */
  icon: IconName
  /** Accessible name of the button (icon-only buttons have no visible text). */
  'aria-label': string
  /** Tooltip content shown on hover and focus. Omit for a button without a tooltip. */
  tooltip?: ReactNode
  tooltipSide?: 'top' | 'right' | 'bottom' | 'left'
  iconSize?: number
}

/** Circular icon-only button (tertiary by default) with an optional tooltip. */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { icon, tooltip, tooltipSide = 'top', iconSize, variant = 'tertiary', ...rest },
  ref,
) {
  const button = (
    <Button ref={ref} variant={variant} isCircle {...rest}>
      <Icon name={icon} size={iconSize} aria-hidden />
    </Button>
  )

  if (!tooltip) {
    return button
  }

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>{button}</TooltipTrigger>
        <TooltipContent side={tooltipSide}>{tooltip}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
})

IconButton.displayName = 'IconButton'
