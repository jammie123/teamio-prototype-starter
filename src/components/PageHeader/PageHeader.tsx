import {
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
} from 'react'
import type { StyleProps } from '../../lib/types'
import { Typography } from '../Typography'
import {
  pageHeaderActionsClass,
  pageHeaderClass,
  pageHeaderRowClass,
  pageHeaderTabsClass,
  pageHeaderTitleClass,
} from './pageHeaderClass'

export interface PageHeaderProps
  extends StyleProps,
    Omit<HTMLAttributes<HTMLElement>, 'title'> {
  title: ReactNode
  actions?: ReactNode
  tabs?: ReactNode
}

export const PageHeader = forwardRef<HTMLElement, PageHeaderProps>(
  function PageHeader(
    { title, actions, tabs, className, 'aria-label': ariaLabel, ...rest },
    ref,
  ) {
    const resolvedAriaLabel =
      ariaLabel ?? (typeof title === 'string' ? title : undefined)

    return (
      <header
        ref={ref}
        data-testid="page-header"
        aria-label={resolvedAriaLabel}
        className={pageHeaderClass(className)}
        {...rest}
      >
        <div className={pageHeaderRowClass(Boolean(tabs))}>
          <Typography variant="h1" className={pageHeaderTitleClass()}>
            {title}
          </Typography>
          {actions ? <div className={pageHeaderActionsClass()}>{actions}</div> : null}
        </div>
        {tabs ? <div className={pageHeaderTabsClass()}>{tabs}</div> : null}
      </header>
    )
  },
)

PageHeader.displayName = 'PageHeader'
