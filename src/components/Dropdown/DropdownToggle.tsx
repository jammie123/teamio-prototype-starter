import { useContext, type HTMLAttributes, type ReactNode } from 'react'
import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'
import { buttonClass } from '../Button/buttonClass'
import { Icon } from '../Icon'
import { DropdownContext } from './DropdownContext'

export type DropdownToggleVariant =
  | 'button-tertiary'
  | 'button-tertiary-circle'
  | 'custom'

export interface DropdownToggleProps
  extends StyleProps,
    Omit<HTMLAttributes<HTMLElement>, 'color'> {
  children: ReactNode
  variant?: DropdownToggleVariant
  showIndicator?: boolean
}

function toggleClass(variant: DropdownToggleVariant | undefined) {
  switch (variant) {
    case 'button-tertiary':
      return buttonClass({ variant: 'tertiary' })
    case 'button-tertiary-circle':
      return buttonClass({ variant: 'tertiary', isCircle: true })
    case 'custom':
      return 'focus-visible:tm-rounded-sm'
    default:
      return 'focus-visible:tm-rounded-sm'
  }
}

export function DropdownToggle({
  variant,
  showIndicator = false,
  children,
  className,
  ...rest
}: DropdownToggleProps) {
  const { getReferenceProps, floatingProps } = useContext(DropdownContext)
  const { refs } = floatingProps

  return (
    <summary
      ref={refs.setReference}
      role="button"
      data-testid="dropdown-toggle"
      className={cn(
        'tm-inline-flex',
        'tm-items-center',
        'tm-cursor-pointer',
        'tm-select-none',
        'tm-list-none',
        'marker:tm-hidden',
        '[&::-webkit-details-marker]:tm-hidden',
        'focus-visible:tm-outline-none',
        'focus-visible:tm-ring',
        toggleClass(variant),
        className,
      )}
      {...getReferenceProps({
        onClick(event) {
          event.preventDefault()
        },
      })}
      {...rest}
    >
      {children}
      {showIndicator ? (
        <Icon
          name="chevron-down"
          className={cn(
            'tm-text-[1em]',
            variant === undefined || variant === 'custom' ? 'tm-ml-[.375rem]' : '-tm-mr-1',
          )}
        />
      ) : null}
    </summary>
  )
}

DropdownToggle.displayName = 'DropdownToggle'
