import { forwardRef, Fragment, type HTMLAttributes, type MouseEventHandler, type ReactNode } from 'react'
import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'
import { Icon } from '../Icon'
import { Link } from '../Link'

export interface BreadcrumbItem {
  label: ReactNode
  /** Makes the item an active link. Without `href` and `onClick` the item is plain text. */
  href?: string
  /** Makes the item an active link handled in the app (e.g. client-side navigation). */
  onClick?: MouseEventHandler<HTMLAnchorElement | HTMLButtonElement>
}

export interface BreadcrumbsProps
  extends StyleProps,
    Omit<HTMLAttributes<HTMLElement>, 'children'> {
  /**
   * Path to the current page, from the root. The last item is the current page and is always
   * rendered as inactive text, even when it has `href` or `onClick`.
   */
  items: BreadcrumbItem[]
}

/**
 * Breadcrumb trail: earlier items are active links, the last one is the current page (inactive,
 * marked with `aria-current="page"`). Items are separated by a chevron.
 */
export const Breadcrumbs = forwardRef<HTMLElement, BreadcrumbsProps>(function Breadcrumbs(
  { items, className, 'aria-label': ariaLabel = 'Drobečková navigace', ...rest },
  ref,
) {
  const lastIndex = items.length - 1

  return (
    <nav
      ref={ref}
      aria-label={ariaLabel}
      data-testid="breadcrumbs"
      className={cn('tm-font-poppins', 'tm-text-sm', className)}
      {...rest}
    >
      <ol className="tm-m-0 tm-flex tm-list-none tm-flex-wrap tm-items-center tm-gap-1 tm-p-0">
        {items.map((item, index) => {
          const isCurrent = index === lastIndex
          const isLink = !isCurrent && Boolean(item.href || item.onClick)

          return (
            <Fragment key={index}>
              <li className="tm-m-0 tm-flex tm-items-center tm-p-0">
                {isLink ? (
                  <Link href={item.href} onClick={item.onClick}>
                    {item.label}
                  </Link>
                ) : (
                  <span
                    aria-current={isCurrent ? 'page' : undefined}
                    className="tm-text-secondary-default"
                  >
                    {item.label}
                  </span>
                )}
              </li>
              {isCurrent ? null : (
                <li
                  aria-hidden
                  role="presentation"
                  className="tm-m-0 tm-flex tm-items-center tm-p-0 tm-text-secondary-default"
                >
                  <Icon name="chevron-right" />
                </li>
              )}
            </Fragment>
          )
        })}
      </ol>
    </nav>
  )
})

Breadcrumbs.displayName = 'Breadcrumbs'
