# PageTemplate Design Spec

**Date:** 2026-08-17  
**Status:** Approved

## Summary

`PageTemplate` is the basic Teamio application page shell: a **fixed** `LeftMenu`, a static `HeaderTop`, and a padded content `<main>` filled by the page. It lives in the prototype starter under Storybook category **Page** as **Page Template**.

## Layout

| Zone | Content |
|------|---------|
| Left | `LeftMenu` with `position="fixed"` |
| Top (right column) | `HeaderTop` in document flow |
| Main (right column) | `<main>` with padding; `children` only — no built-in `Container` |

Content column left margin tracks menu width: `tm-ml-left-menu` (15rem) or `tm-ml-left-menu-collapsed` (4.5rem).

## Decisions

- **API:** Prop objects `leftMenu` + `headerTop` + `children` (not React slots)
- **Storybook:** `Page/Page Template`
- **Menu position:** Always forced to `fixed` inside this template
- **Collapse sync:** Template tracks effective collapsed state (controlled or uncontrolled) so the content offset stays correct
- **Content:** Padded `<main>` only; pages supply tables, cards, `Container`, etc.
- **Out of scope:** Mobile drawer, breadcrumbs, page title slot, changes to LeftMenu/HeaderTop APIs, publish to `@almacareer/teamio-ui-components`

## Props API

```ts
interface PageTemplateProps {
  leftMenu: LeftMenuProps
  headerTop: HeaderTopProps
  children?: ReactNode
  className?: string
}
```

`leftMenu.position` is ignored (always `fixed`). Collapse props on `leftMenu` (`isCollapsed`, `defaultCollapsed`, `onCollapsedChange`) are respected and mirrored for the content margin.

## Storybook

Stories: Default, WithTable, WithCards, Collapsed, Interactive. Fullscreen layout; Czech sample copy.

## Tests

- Renders LeftMenu, HeaderTop, and children
- Content column margin matches expanded / collapsed state
- Forwards `onCollapsedChange` when the menu is toggled
