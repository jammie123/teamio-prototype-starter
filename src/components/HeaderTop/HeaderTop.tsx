import {
  forwardRef,
  useState,
  type ChangeEvent,
  type HTMLAttributes,
  type MouseEvent,
} from 'react'
import type { StyleProps } from '../../lib/types'
import { Button } from '../Button'
import { Dropdown, DropdownBody, DropdownToggle } from '../Dropdown'
import { Icon } from '../Icon'
import { Input } from '../Input'
import { Option, OptionList } from '../OptionList'
import { Pill } from '../Pill'
import {
  headerTopActionsClass,
  headerTopBadgeClass,
  headerTopChevronClass,
  headerTopClass,
  headerTopIconButtonWrapClass,
  headerTopSearchClass,
  headerTopUserToggleClass,
} from './headerTopClass'

export interface HeaderTopMenuItem {
  id: string
  label: string
  onClick?: (event: MouseEvent<HTMLElement>) => void
  href?: string
  isDisabled?: boolean
  color?: 'primary' | 'danger'
}

export interface HeaderTopUser {
  name: string
  company: string
}

export interface HeaderTopProps
  extends StyleProps,
    Omit<HTMLAttributes<HTMLElement>, 'children'> {
  user: HeaderTopUser
  addMenuItems?: HeaderTopMenuItem[]
  userMenuItems?: HeaderTopMenuItem[]
  searchValue?: string
  defaultSearchValue?: string
  onSearchChange?: (value: string) => void
  searchPlaceholder?: string
  messagesCount?: number
  notificationsCount?: number
  onMessagesClick?: () => void
  onNotificationsClick?: () => void
  addLabel?: string
  messagesLabel?: string
  notificationsLabel?: string
}

const DEFAULT_ADD_MENU_ITEMS: HeaderTopMenuItem[] = [
  { id: 'nabor', label: 'Nábor' },
  { id: 'uchazec', label: 'Uchazeč' },
  { id: 'brigada', label: 'Brigáda' },
]

const DEFAULT_USER_MENU_ITEMS: HeaderTopMenuItem[] = [
  { id: 'nastaveni', label: 'Nastavení' },
  { id: 'akademie', label: 'Akademie' },
]

function resolveMenuItems(
  items: HeaderTopMenuItem[] | undefined,
  defaults: HeaderTopMenuItem[],
): HeaderTopMenuItem[] {
  return items === undefined ? defaults : items
}

function MenuOptions({ items }: { items: HeaderTopMenuItem[] }) {
  return (
    <OptionList>
      {items.map((item) => (
        <Option
          key={item.id}
          href={item.href}
          onClick={item.onClick}
          isDisabled={item.isDisabled}
          color={item.color}
        >
          {item.label}
        </Option>
      ))}
    </OptionList>
  )
}

export const HeaderTop = forwardRef<HTMLElement, HeaderTopProps>(function HeaderTop(
  {
    user,
    addMenuItems,
    userMenuItems,
    searchValue,
    defaultSearchValue = '',
    onSearchChange,
    searchPlaceholder = 'Hledat uchazeče',
    messagesCount = 0,
    notificationsCount = 0,
    onMessagesClick,
    onNotificationsClick,
    addLabel = 'Přidat',
    messagesLabel = 'Zprávy',
    notificationsLabel = 'Notifikace',
    className,
    'aria-label': ariaLabel = 'Horní lišta',
    ...rest
  },
  ref,
) {
  const isSearchControlled = searchValue !== undefined
  const [uncontrolledSearch, setUncontrolledSearch] = useState(defaultSearchValue)
  const search = isSearchControlled ? searchValue : uncontrolledSearch

  const resolvedAddItems = resolveMenuItems(addMenuItems, DEFAULT_ADD_MENU_ITEMS)
  const resolvedUserItems = resolveMenuItems(userMenuItems, DEFAULT_USER_MENU_ITEMS)

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    const next = event.target.value
    if (!isSearchControlled) {
      setUncontrolledSearch(next)
    }
    onSearchChange?.(next)
  }

  return (
    <header
      ref={ref}
      aria-label={ariaLabel}
      data-testid="header-top"
      className={headerTopClass(className)}
      {...rest}
    >
      <div className="tm-relative tm-min-w-0 tm-flex-1 tm-max-w-md">
        <Icon
          name="search"
          className="tm-pointer-events-none tm-absolute tm-left-3 tm-top-1/2 tm-z-10 tm--translate-y-1/2 tm-text-secondary-default"
        />
        <Input
          type="search"
          value={search}
          onChange={handleSearchChange}
          placeholder={searchPlaceholder}
          aria-label={searchPlaceholder}
          className={headerTopSearchClass()}
        />
      </div>

      <div className={headerTopActionsClass()}>
        <Dropdown placement="bottom-end">
          <DropdownToggle variant="button-tertiary" aria-label={addLabel}>
            <Icon name="plus-circle" className="tm-text-lg" />
            {addLabel}
          </DropdownToggle>
          <DropdownBody>
            <MenuOptions items={resolvedAddItems} />
          </DropdownBody>
        </Dropdown>

        <div
          role="separator"
          aria-orientation="vertical"
          className="tm-mx-1 tm-h-6 tm-w-px tm-shrink-0 tm-bg-secondary"
        />

        <div className={headerTopIconButtonWrapClass()}>
          <Button
            type="button"
            variant="tertiary"
            isCircle
            aria-label={messagesLabel}
            onClick={onMessagesClick}
          >
            <Icon name="mail" className="tm-text-lg" />
          </Button>
          {messagesCount > 0 ? (
            <Pill color="danger" className={headerTopBadgeClass()} aria-hidden>
              {messagesCount > 99 ? '99+' : messagesCount}
            </Pill>
          ) : null}
        </div>

        <div className={headerTopIconButtonWrapClass()}>
          <Button
            type="button"
            variant="tertiary"
            isCircle
            aria-label={notificationsLabel}
            onClick={onNotificationsClick}
          >
            <Icon name="notification" className="tm-text-lg" />
          </Button>
          {notificationsCount > 0 ? (
            <Pill color="danger" className={headerTopBadgeClass()} aria-hidden>
              {notificationsCount > 99 ? '99+' : notificationsCount}
            </Pill>
          ) : null}
        </div>

        <Dropdown placement="bottom-end">
          <DropdownToggle
            variant="custom"
            aria-haspopup="menu"
            aria-label={`${user.name}, ${user.company}`}
            className={headerTopUserToggleClass()}
          >
            <span className="tm-flex tm-min-w-0 tm-flex-col tm-items-end tm-text-right">
              <span className="tm-truncate tm-text-sm tm-font-semibold tm-leading-tight tm-text-primary-default">
                {user.name}
              </span>
              <span className="tm-truncate tm-text-xs tm-leading-tight tm-text-secondary-default">
                {user.company}
              </span>
            </span>
            <span className={headerTopChevronClass()} aria-hidden>
              <Icon name="chevron-down" />
            </span>
          </DropdownToggle>
          <DropdownBody>
            <MenuOptions items={resolvedUserItems} />
          </DropdownBody>
        </Dropdown>
      </div>
    </header>
  )
})

HeaderTop.displayName = 'HeaderTop'
