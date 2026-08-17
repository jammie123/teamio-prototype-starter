import { useListItem } from '@floating-ui/react'
import { useContext, type AnchorHTMLAttributes, type ButtonHTMLAttributes, type MouseEvent } from 'react'
import { cn } from '../../lib/cn'
import type { ChildrenProps, StyleProps } from '../../lib/types'
import { DropdownContext } from '../Dropdown/DropdownContext'

export type OptionColor = 'primary' | 'danger'

export interface OptionProps extends StyleProps, ChildrenProps {
  color?: OptionColor
  href?: string
  rel?: string
  target?: AnchorHTMLAttributes<HTMLAnchorElement>['target']
  onClick?: (event: MouseEvent<HTMLElement>) => void
  isDisabled?: boolean
  isSelected?: boolean
  className?: string
}

function getOptionClass(color: OptionColor, isDisabled: boolean, isSelected: boolean) {
  const colorClass =
    color === 'danger'
      ? cn(
          'tm-text-emotion-danger-active',
          'hover:tm-text-emotion-danger-active',
          'focus:tm-text-emotion-danger-active',
          !isDisabled && 'hover:tm-bg-interactive-danger-hover',
          !isDisabled && 'active:tm-bg-interactive-danger-active',
          'focus-visible:tm-bg-interactive-danger-hover',
        )
      : cn(
          'tm-text-primary-default',
          'hover:tm-text-primary-default',
          'focus:tm-text-primary-default',
          !isDisabled && 'hover:tm-bg-interactive-hover',
          !isDisabled && 'active:tm-bg-interactive-active',
          'focus-visible:tm-bg-interactive-hover',
        )

  return cn(
    'tm-w-full',
    'tm-flex',
    'tm-gap-2',
    'tm-items-center',
    'tm-flex-none',
    'tm-p-2',
    'tm-rounded',
    'tm-text-left',
    'tm-font-poppins',
    'tm-text-sm',
    'tm-no-underline',
    'tm-outline-0',
    'tm-cursor-default',
    'tm-bg-transparent',
    'tm-border-0',
    isSelected && 'tm-bg-interactive-active',
    'hover:tm-no-underline',
    'focus:tm-no-underline',
    colorClass,
    isDisabled && 'tm-opacity-40',
  )
}

export function Option({
  color = 'primary',
  href,
  onClick,
  isDisabled = false,
  isSelected = false,
  children,
  className,
  rel,
  target,
  ...rest
}: OptionProps) {
  const { ref, index } = useListItem()
  const { activeIndex, getItemProps, onSelect } = useContext(DropdownContext)
  const isActive = activeIndex === index
  const optionClass = cn(getOptionClass(color, isDisabled, isSelected), className)

  if (href && !isDisabled) {
    return (
      <a
        href={href}
        ref={ref}
        role="option"
        aria-selected={isSelected}
        tabIndex={isActive ? 0 : -1}
        rel={rel}
        target={target}
        className={optionClass}
        {...getItemProps({
          onClick: (event) => {
            onSelect(index)
            onClick?.(event as MouseEvent<HTMLElement>)
          },
        })}
        {...rest}
      >
        {children}
      </a>
    )
  }

  if (onClick || !href) {
    const buttonProps = rest as ButtonHTMLAttributes<HTMLButtonElement>
    return (
      <button
        type="button"
        ref={ref}
        role="option"
        aria-selected={isSelected}
        tabIndex={isActive ? 0 : -1}
        disabled={isDisabled}
        className={optionClass}
        {...getItemProps({
          onClick: (event) => {
            if (isDisabled) return
            onSelect(index)
            onClick?.(event as MouseEvent<HTMLElement>)
          },
        })}
        {...buttonProps}
      >
        {children}
      </button>
    )
  }

  return (
    <div role="option" aria-selected={isSelected} className={optionClass} {...rest}>
      {children}
    </div>
  )
}

Option.displayName = 'Option'
