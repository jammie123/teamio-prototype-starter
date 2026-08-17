# HeaderTop Design Spec

**Date:** 2026-08-14  
**Status:** Approved

## Summary

`HeaderTop` is the Teamio application top bar: a **static** (not fixed) horizontal strip with search on the left and action controls on the right. It is composed in the prototype starter from shared primitives; it does not depend on `@almacareer/teamio-ui-components`.

## Layout

| Zone | Content |
|------|---------|
| Left | Pill-shaped search field (search icon + placeholder „Hledat uchazeče“) |
| Right | „Přidat“ tertiary control → dropdown; vertical divider; mail icon button; notification icon button; user medallion (name + company + chevron) → dropdown |

## Decisions

- **User medallion:** name + company + chevron only — **no Avatar**
- **Dropdowns:** Port shared `Dropdown` / `DropdownToggle` / `DropdownBody` / `OptionList` / `Option` (Floating UI), then compose `HeaderTop`
- **Mail / notifications:** Tertiary circle icon buttons with optional unread `Pill`; click callbacks only — **no panels**
- **Position:** Static (normal document flow), not fixed
- **Out of scope:** Avatar, ButtonGroup, fixed header tokens, message/notification panels, Input `iconStart` API

## Props API

```ts
interface HeaderTopMenuItem {
  id: string
  label: string
  onClick?: (event: MouseEvent<HTMLElement>) => void
  href?: string
  isDisabled?: boolean
  color?: 'primary' | 'danger'
}

interface HeaderTopUser {
  name: string
  company: string
}

interface HeaderTopProps {
  user: HeaderTopUser
  addMenuItems?: HeaderTopMenuItem[]
  userMenuItems?: HeaderTopMenuItem[]
  searchValue?: string
  defaultSearchValue?: string
  onSearchChange?: (value: string) => void
  searchPlaceholder?: string // default "Hledat uchazeče"
  messagesCount?: number
  notificationsCount?: number
  onMessagesClick?: () => void
  onNotificationsClick?: () => void
  addLabel?: string // default "Přidat"
  className?: string
}
```

### Menu defaults

- `addMenuItems` omitted → Nábor, Uchazeč, Brigáda
- `userMenuItems` omitted → Nastavení, Akademie
- Explicit `[]` → empty menu body

## Behavior & a11y

- Search: controlled or uncontrolled; `type="search"`; Czech aria-label default
- Dropdowns: Floating UI click + dismiss (outside / Escape); autoClose on select; list keyboard navigation
- Mail / notifications: `aria-label` „Zprávy“ / „Notifikace“; Pill when count > 0
- User trigger: entire medallion is the toggle; `aria-haspopup="menu"`

## Phase 1 primitives

- Add `@floating-ui/react`
- Extend Icon: `mail`, `notification`, `plus-circle`
- `Dropdown`, `DropdownToggle` (variants: `button-tertiary`, `button-tertiary-circle`, `custom`), `DropdownBody`
- `OptionList`, `Option`

## Phase 2

- `HeaderTop` under `Complex components/HeaderTop` in Storybook
- Stories: Default, WithBadges, WithLeftMenu, Interactive
- Tests for a11y labels, menus, search, badges, icon clicks
