# JobPageHeader Prototype Defaults Design Spec

**Date:** 2026-11-27  
**Status:** Approved  
**Related:** `job-listing` prototype page header; epic `docs/epic-vypis-naboru.md`

## Summary

Align catalog `JobPageHeader` defaults with the header currently used on the `job-listing` prototype: five recruitment tabs with optional counts/info, and an optional total count in the title. The prototype then passes counts via props instead of overriding `tabs` / `title` with custom JSX.

## Goal

- Storybook / default `JobPageHeader` matches the live prototype header structure.
- Prototype drops custom `tabs` and title composition while keeping live counts.

## Decisions

- **Approach:** Bake default tab labels + `info` into `JobPageHeader`; expose `jobCount` and `tabCounts` for live numbers.
- **Tab values:** `open` | `published` | `unpublished` | `draft` | `archived` (same as prototype `JobListingTab`).
- **Escape hatch:** Existing `tabs` and `title` props remain for full overrides.
- **Actions:** Unchanged — `Přidat nábor` split button + `Hromadné akce` / `Vypnout hromadné úpravy`.
- **Out of scope:** Moving filter/list logic into the header; changing bulk or split-button behavior; new CSS modules.

## Default tabs

| Value | Label | Info |
| --- | --- | --- |
| `open` | Otevřený | Otevřený nábor, který má alespoň jeden inzerát |
| `published` | Zveřejněný | Otevřený nábor, na kterém běží vystavená inzerce |
| `unpublished` | Nezveřejněný | Otevřený nábor s ukončenou nebo vypršelou inzercí |
| `draft` | Rozpracovaný | — |
| `archived` | Archivní | — |

Default `TabsList` `aria-label`: `Filtry náborů`.

## Props API

Extend `JobPageHeaderProps` (still based on `PageHeaderProps` minus `title` / `actions` / `tabs`):

```ts
type JobPageHeaderTab = 'open' | 'published' | 'unpublished' | 'draft' | 'archived'

interface JobPageHeaderProps {
  title?: ReactNode
  /** When set and title is defaulted, renders: Nábory (N) with muted count. */
  jobCount?: number
  /** Counts for default tab triggers; ignored when `tabs` is provided. */
  tabCounts?: Partial<Record<JobPageHeaderTab, number>>
  actions?: ReactNode
  tabs?: ReactNode
  onAddJob?: () => void
  onAddBrigade?: () => void
  bulkActionsActive?: boolean
  onBulkActionsToggle?: () => void
}
```

### Title behavior

- If `title` is passed → use it as today.
- Else if `jobCount` is a number → `Nábory` + muted `({jobCount})` (same styling as prototype: `tm-font-normal tm-text-secondary-default`).
- Else → `Nábory`.
- Prefer `aria-label="Nábory"` when title includes the count fragment so the accessible name stays stable.

### Tabs behavior

- If `tabs` is passed → use it; `tabCounts` ignored.
- Else → default five triggers; each `count={tabCounts?.[value]}` when defined; `info` from the table above.

Export `JobPageHeaderTab` (and optionally a constant tab config) from the component barrel for consumers that need the value union.

## Storybook

- Update `Jobs/JobPageHeader/V1` stories so Default / BulkActionsActive / InPage wrap `Tabs` with `defaultValue="open"` (not `aktivni`).
- Show sample `jobCount` / `tabCounts` on at least one story (e.g. InPage or a Counts story).
- Keep play assertions for heading, bulk toggle, and split-button brigade option; update tab names.

## Tests

- Assert default tabs: Otevřený, Zveřejněný, Nezveřejněný, Rozpracovaný, Archivní.
- Assert `jobCount` appears in the heading as `(N)`.
- Assert `tabCounts` appear on triggers (via accessible names / count UI already used by `TabsTrigger`).
- Keep bulk-toggle and add-job / brigade coverage.

## Prototype wiring (`job-listing`)

In `JobListingPage`:

- Pass `jobCount={visibleCount}`.
- Pass `tabCounts` built from existing `jobsOnTab(tab, filter).length` for each tab value.
- Remove custom `title` JSX and custom `tabs` JSX.
- Keep local `TABS` (or equivalent) for `TabsContent` / page filtering; values must stay aligned with `JobPageHeaderTab`.
- Keep `bulkActionsActive` / `onBulkActionsToggle` as today.

## Acceptance criteria

- [ ] Catalog default header tabs and copy match the prototype.
- [ ] `jobCount` and `tabCounts` drive title and counts without a `tabs` override.
- [ ] Prototype listing page uses those props and no longer passes custom `tabs` / title markup.
- [ ] Stories and unit tests updated and passing.
- [ ] Actions / bulk behavior unchanged.
