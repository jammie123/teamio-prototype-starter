import { useListItem } from '@floating-ui/react'
import {
  useContext,
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from 'react'
import { cn } from '../../lib/cn'
import type { ChildrenProps, StyleProps } from '../../lib/types'
import { DropdownContext } from '../Dropdown/DropdownContext'
import { Icon } from '../Icon'
import { optionClass, optionDescriptionClass, type OptionColor } from './optionClass'

export interface OptionProps extends StyleProps, ChildrenProps {
  color?: OptionColor
  description?: ReactNode
  href?: string
  rel?: string
  target?: AnchorHTMLAttributes<HTMLAnchorElement>['target']
  onClick?: (event: MouseEvent<HTMLElement>) => void
  isDisabled?: boolean
  isSelected?: boolean
  className?: string
}

function hasContent(description: ReactNode) {
  return description !== undefined && description !== null && description !== false
}

export function OptionContent({
  color = 'primary',
  description,
  children,
}: Pick<OptionProps, 'color' | 'description' | 'children'>) {
  if (!hasContent(description)) {
    return children
  }

  return (
    <span className="tm-flex tm-min-w-0 tm-flex-col tm-gap-0.5">
      <span>{children}</span>
      <span data-testid="option-description" className={optionDescriptionClass(color)}>
        {description}
      </span>
    </span>
  )
}

OptionContent.displayName = 'OptionContent'

export function Option({
  color = 'primary',
  description,
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
  const itemClass = cn(
    optionClass({ color, isDisabled, isSelected, hasDescription: hasContent(description) }),
    className,
  )
  const content = (
    <>
      <OptionContent color={color} description={description}>
        {children}
      </OptionContent>
      {isSelected && (
        <Icon
          name="check"
          data-testid="option-selected-icon"
          className="tm-ml-auto tm-shrink-0 tm-text-base"
        />
      )}
    </>
  )

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
        className={itemClass}
        {...getItemProps({
          onClick: (event) => {
            onSelect(index)
            onClick?.(event as MouseEvent<HTMLElement>)
          },
        })}
        {...rest}
      >
        {content}
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
        className={itemClass}
        {...getItemProps({
          onClick: (event) => {
            if (isDisabled) return
            onSelect(index)
            onClick?.(event as MouseEvent<HTMLElement>)
          },
        })}
        {...buttonProps}
      >
        {content}
      </button>
    )
  }

  return (
    <div role="option" aria-selected={isSelected} className={itemClass} {...rest}>
      {content}
    </div>
  )
}

Option.displayName = 'Option'
