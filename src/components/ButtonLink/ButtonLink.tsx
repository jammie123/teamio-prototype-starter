import {
  forwardRef,
  type AnchorHTMLAttributes,
  type KeyboardEvent,
  type MouseEvent,
} from 'react'
import { cn } from '../../lib/cn'
import type {
  ButtonSize,
  ButtonVariant,
  ChildrenProps,
  LinkTarget,
  StyleProps,
} from '../../lib/types'
import { buttonClass } from '../Button/buttonClass'

export interface ButtonLinkProps
  extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'color'>,
    StyleProps,
    ChildrenProps {
  href: string
  target?: LinkTarget
  variant?: ButtonVariant
  size?: ButtonSize
  isBlock?: boolean
  isCircle?: boolean
  isDisabled?: boolean
}

export const ButtonLink = forwardRef<HTMLAnchorElement, ButtonLinkProps>(function ButtonLink(
  {
    href,
    target,
    rel,
    variant = 'primary',
    size = 'medium',
    isBlock = false,
    isCircle = false,
    isDisabled = false,
    className,
    children,
    download,
    onClick,
    onKeyDown,
    ...rest
  },
  ref,
) {
  const classes = cn(
    buttonClass({ variant, size, isBlock, isCircle, isDisabled }),
    className,
  )
  const linkRel = target === '_blank' && rel === undefined ? 'noopener noreferrer' : rel

  const preventActivation = (event: MouseEvent | KeyboardEvent) => {
    if (!isDisabled) return
    event.preventDefault()
    event.stopPropagation()
  }

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (isDisabled) {
      preventActivation(event)
      return
    }
    onClick?.(event)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLAnchorElement>) => {
    if (isDisabled && (event.key === 'Enter' || event.key === ' ')) {
      preventActivation(event)
      return
    }
    onKeyDown?.(event)
  }

  return (
    <a
      {...rest}
      ref={ref}
      href={isDisabled ? undefined : href}
      target={isDisabled ? undefined : target}
      rel={isDisabled ? undefined : linkRel}
      download={isDisabled ? undefined : download}
      className={classes}
      aria-disabled={isDisabled || undefined}
      tabIndex={isDisabled ? -1 : rest.tabIndex}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      {children}
    </a>
  )
})

ButtonLink.displayName = 'ButtonLink'
