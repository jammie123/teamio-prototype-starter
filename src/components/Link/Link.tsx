import {
  forwardRef,
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  type MouseEventHandler,
  type Ref,
} from 'react'
import { cn } from '../../lib/cn'
import type {
  ChildrenProps,
  LinkTarget,
  LinkUnderline,
  LinkVariant,
  StyleProps,
} from '../../lib/types'

export interface LinkProps
  extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'color' | 'onClick'>,
    StyleProps,
    ChildrenProps {
  variant?: LinkVariant
  underlined?: LinkUnderline
  href?: string
  target?: LinkTarget
  isDisabled?: boolean
  onClick?: MouseEventHandler<HTMLAnchorElement | HTMLButtonElement>
}

function linkClassName({
  variant,
  underlined,
  isDisabled,
  className,
}: {
  variant: LinkVariant
  underlined: LinkUnderline
  isDisabled: boolean
  className?: string
}) {
  return cn(
    'tm-inline',
    'tm-bg-transparent',
    'tm-border-0',
    'tm-p-0',
    'tm-font-inherit',
    'tm-cursor-pointer',
    'tm-text-left',
    'focus-visible:tm-rounded-sm',
    'focus-visible:tm-outline-0',
    'focus-visible:tm-ring',
    variant === 'primary' && [
      'tm-text-action-link-default',
      'hover:tm-text-action-link-hover',
      'hover:tm-underline',
      'focus:tm-text-action-link-hover',
      'focus:tm-underline',
      'active:tm-text-action-link-active',
    ],
    variant === 'secondary' && [
      'tm-text-action-link-secondary-default',
      'hover:tm-text-action-link-secondary-hover',
      'hover:tm-underline',
      'focus:tm-text-action-link-secondary-hover',
      'focus:tm-underline',
      'active:tm-text-action-link-secondary-active',
    ],
    isDisabled &&
      'tm-text-action-link-disabled tm-no-underline tm-pointer-events-none !tm-cursor-not-allowed',
    underlined === 'never' && 'hover:tm-no-underline focus:tm-no-underline',
    className,
  )
}

function LinkImpl(
  {
    variant = 'primary',
    underlined = 'hover',
    href,
    onClick,
    className,
    children,
    isDisabled = false,
    rel,
    target,
    ...rest
  }: LinkProps,
  ref: Ref<HTMLAnchorElement | HTMLButtonElement>,
) {
  const classes = linkClassName({ variant, underlined, isDisabled, className })

  if (onClick || !href) {
    return (
      <button
        ref={ref as Ref<HTMLButtonElement>}
        type="button"
        onClick={onClick}
        className={classes}
        disabled={isDisabled}
        {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}
      >
        {children}
      </button>
    )
  }

  const linkRel = target === '_blank' && rel === undefined ? 'noopener noreferrer' : rel

  return (
    <a
      ref={ref as Ref<HTMLAnchorElement>}
      href={isDisabled ? undefined : href}
      className={classes}
      target={target}
      rel={linkRel}
      aria-disabled={isDisabled || undefined}
      tabIndex={isDisabled ? -1 : rest.tabIndex}
      {...rest}
    >
      {children}
    </a>
  )
}

export const Link = forwardRef(LinkImpl)

Link.displayName = 'Link'
