import {
  forwardRef,
  useCallback,
  useState,
  type HTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from 'react'
import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'
import { Icon, type IconName } from '../Icon'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../Tooltip'
import { TeamioLogo, type Edition } from '../TeamioLogo'
import { leftMenuItemClass } from './leftMenuItemClass'

export interface LeftMenuItemData {
  id: string
  label: string
  icon?: IconName
  href?: string
  onClick?: (event: MouseEvent<HTMLElement>) => void
  isActive?: boolean
  isDisabled?: boolean
}

export type LeftMenuPosition = 'fixed' | 'static'

export interface LeftMenuProps
  extends StyleProps,
    Omit<HTMLAttributes<HTMLElement>, 'children' | 'onToggle'> {
  items: LeftMenuItemData[]
  /** Marks the matching item as active unless the item sets `isActive` itself. */
  activeItemId?: string
  /** Client edition. Currently only changes the logo; unknown values fall back to `default`. */
  edition?: Edition
  /** Replaces the default Teamio logo in the header. */
  logo?: ReactNode
  /** Optional slot pinned to the bottom of the menu. */
  footer?: ReactNode
  isCollapsible?: boolean
  isCollapsed?: boolean
  defaultCollapsed?: boolean
  onCollapsedChange?: (isCollapsed: boolean) => void
  position?: LeftMenuPosition
  collapseLabel?: string
  expandLabel?: string
}

export const LeftMenu = forwardRef<HTMLElement, LeftMenuProps>(function LeftMenu(
  {
    items,
    activeItemId,
    edition = 'default',
    logo,
    footer,
    isCollapsible = true,
    isCollapsed,
    defaultCollapsed = false,
    onCollapsedChange,
    position = 'fixed',
    collapseLabel = 'Sbalit navigaci',
    expandLabel = 'Rozbalit navigaci',
    className,
    'aria-label': ariaLabel = 'Hlavní navigace',
    ...rest
  },
  ref,
) {
  const [uncontrolledCollapsed, setUncontrolledCollapsed] = useState(defaultCollapsed)
  const isControlled = isCollapsed !== undefined
  const collapsed = isCollapsible && (isControlled ? isCollapsed : uncontrolledCollapsed)

  const handleToggle = useCallback(() => {
    const next = !collapsed

    if (!isControlled) {
      setUncontrolledCollapsed(next)
    }

    onCollapsedChange?.(next)
  }, [collapsed, isControlled, onCollapsedChange])

  return (
    <nav
      ref={ref}
      aria-label={ariaLabel}
      data-testid="left-menu"
      data-collapsed={collapsed ? 'true' : 'false'}
      className={cn(
        'tm-flex',
        'tm-flex-col',
        'tm-bg-teamio-violet',
        'tm-font-poppins',
        collapsed ? 'tm-w-left-menu-collapsed' : 'tm-w-left-menu',
        position === 'fixed' ? 'tm-fixed tm-inset-y-0 tm-left-0 tm-z-10' : 'tm-h-full',
        className,
      )}
      {...rest}
    >
      <div
        className={cn(
          'tm-flex',
          'tm-shrink-0',
          'tm-gap-2',
          'tm-py-4',
          collapsed
            ? 'tm-flex-col tm-items-center tm-px-2'
            : 'tm-items-center tm-justify-between tm-px-4',
        )}
      >
        {logo ?? <TeamioLogo edition={edition} variant={collapsed ? 'compact' : 'full'} />}

        {isCollapsible ? (
          <button
            type="button"
            onClick={handleToggle}
            aria-expanded={!collapsed}
            aria-label={collapsed ? expandLabel : collapseLabel}
            className={cn(
              'tm-inline-flex',
              'tm-size-8',
              'tm-shrink-0',
              'tm-items-center',
              'tm-justify-center',
              'tm-rounded',
              'tm-border-0',
              'tm-bg-transparent',
              'tm-cursor-pointer',
              'tm-text-lg',
              'tm-text-secondary-inverted-default',
              'hover:tm-bg-basic/10',
              'hover:tm-text-primary-inverted-default',
              'focus:tm-outline-0',
              'focus-visible:tm-ring',
            )}
          >
            <Icon name={collapsed ? 'chevrons-right' : 'chevrons-left'} />
          </button>
        ) : null}
      </div>

      <TooltipProvider delayDuration={200}>
        <ul
          className={cn(
            'tm-flex',
            'tm-flex-col',
            'tm-gap-1',
            'tm-flex-1',
            'tm-overflow-y-auto',
            'tm-m-0',
            'tm-list-none',
            'tm-py-2',
            collapsed ? 'tm-px-2' : 'tm-px-3',
          )}
        >
          {items.map((item) => {
            const isActive = item.isActive ?? item.id === activeItemId

            return (
              <li key={item.id} className="tm-m-0 tm-p-0">
                <LeftMenuItem item={item} isActive={isActive} isCollapsed={collapsed} />
              </li>
            )
          })}
        </ul>
      </TooltipProvider>

      {footer ? (
        <div className={cn('tm-shrink-0', 'tm-py-3', collapsed ? 'tm-px-2' : 'tm-px-3')}>
          {footer}
        </div>
      ) : null}
    </nav>
  )
})

LeftMenu.displayName = 'LeftMenu'

interface LeftMenuItemProps {
  item: LeftMenuItemData
  isActive: boolean
  isCollapsed: boolean
}

function LeftMenuItem({ item, isActive, isCollapsed }: LeftMenuItemProps) {
  const { label, icon, href, onClick, isDisabled = false } = item
  const className = leftMenuItemClass({ isActive, isDisabled, isCollapsed })

  const content = (
    <>
      {icon ? <Icon name={icon} className="tm-shrink-0 tm-text-xl" /> : null}
      <span className={cn('tm-truncate', isCollapsed && 'tm-sr-only')}>{label}</span>
    </>
  )

  const sharedProps = {
    className,
    'data-testid': 'left-menu-item',
    'data-item-id': item.id,
    'aria-current': isActive ? ('page' as const) : undefined,
  }

  const control =
    href && !isDisabled ? (
      <a href={href} onClick={onClick} {...sharedProps}>
        {content}
      </a>
    ) : (
      <button type="button" onClick={onClick} disabled={isDisabled} {...sharedProps}>
        {content}
      </button>
    )

  if (!isCollapsed) {
    return control
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>{control}</TooltipTrigger>
      <TooltipContent side="right">{label}</TooltipContent>
    </Tooltip>
  )
}
