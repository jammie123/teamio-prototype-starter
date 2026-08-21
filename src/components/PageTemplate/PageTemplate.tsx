import {
  forwardRef,
  useCallback,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from 'react'
import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'
import { HeaderTop, type HeaderTopProps } from '../HeaderTop'
import { LeftMenu, type LeftMenuProps } from '../LeftMenu'
import {
  pageTemplateBodyClass,
  pageTemplateClass,
  pageTemplateColumnClass,
  pageTemplateMainClass,
} from './pageTemplateClass'

export interface PageTemplateProps
  extends StyleProps,
    Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  leftMenu: LeftMenuProps
  headerTop: HeaderTopProps
  pageHeader?: ReactNode
  children?: ReactNode
}

export const PageTemplate = forwardRef<HTMLDivElement, PageTemplateProps>(
  function PageTemplate(
    { leftMenu, headerTop, pageHeader, children, className, ...rest },
    ref,
  ) {
    const {
      isCollapsed: controlledCollapsed,
      defaultCollapsed = false,
      onCollapsedChange,
      position: _ignoredPosition,
      isCollapsible = true,
      ...leftMenuRest
    } = leftMenu

    const [uncontrolledCollapsed, setUncontrolledCollapsed] =
      useState(defaultCollapsed)
    const isControlled = controlledCollapsed !== undefined
    const collapsed =
      isCollapsible &&
      (isControlled ? controlledCollapsed : uncontrolledCollapsed)

    const handleCollapsedChange = useCallback(
      (next: boolean) => {
        if (!isControlled) {
          setUncontrolledCollapsed(next)
        }
        onCollapsedChange?.(next)
      },
      [isControlled, onCollapsedChange],
    )

    return (
      <div
        ref={ref}
        data-testid="page-template"
        className={pageTemplateClass(className)}
        {...rest}
      >
        <LeftMenu
          {...leftMenuRest}
          isCollapsible={isCollapsible}
          isCollapsed={isControlled ? controlledCollapsed : collapsed}
          defaultCollapsed={defaultCollapsed}
          onCollapsedChange={handleCollapsedChange}
          position="fixed"
        />
        <div
          data-testid="page-template-column"
          className={pageTemplateColumnClass(collapsed)}
        >
          <HeaderTop {...headerTop} />
          <main
            data-testid="page-template-content"
            className={cn(pageTemplateMainClass(Boolean(pageHeader)))}
          >
            {pageHeader}
            {pageHeader ? (
              <div data-testid="page-template-body" className={pageTemplateBodyClass()}>
                {children}
              </div>
            ) : (
              children
            )}
          </main>
        </div>
      </div>
    )
  },
)

PageTemplate.displayName = 'PageTemplate'
