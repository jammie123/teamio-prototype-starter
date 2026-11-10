# JobCardV20 Design Spec

**Date:** 2026-11-10  
**Status:** Approved by conversation (awaiting file review)

## Summary

`JobCardV20` is a catalog snapshot of `JobCardV14` with one layout change: advertisements move from a full-width band under the header into a **right column**. The right column is compact (status, dates, portals only). `AdvertisementAction` (views, Detail, Prodloužit, Náhled) is not rendered on the card.

V14 stays unchanged. V20 lives at `src/components/JobCardV20/` and is reviewed in Storybook, not in `App.tsx`.

## Approach

Copy the `JobCardV14` folder to `JobCardV20`, then change layout and drop advertisement actions from the widget. Do not import V14 internals (avoids later V14 tweaks leaking into this snapshot).

## Layout

Two columns inside the card, stretched to the same height, with a vertical divider.

```
[ ⋮ ]  Title                         |  Běží   26. 9. 2026 – 8. 2. 2027
       Assignee                      |  • prace.cz
       0 Neposouzený  8 Ve hře  19   |
       [note, if any]                |
```

| Zone | Content |
|------|---------|
| Far left | Kebab `JobCardActions` (same menu as V14) |
| Left column (`flex-1`) | Title, assignee under the title, pipeline under assignee, optional note under pipeline |
| Divider | `border-l` on the right column, full card height |
| Right column (`shrink-0 tm-w-80`) | Compact advertisements |

Pipeline sits **under** the title, not beside it. That frees the right side for ads.

Card uses `!tm-p-0`. Both columns pad themselves (`tm-px-4 tm-py-6`). `data-variant="v20"`.

## Advertisement column

`AdvertisementWidget` keeps header + publication list. It does **not** render `AdvertisementAction`.

- No top border on the first widget (the column divider replaces the V14 band separator).
- Multiple ads stack vertically in the right column. Widgets after the first use `border-t`.
- `showAdvertisementTitle` still shows the ad title above the status.
- Ending soon: keep `tm-bg-emotion-warning-background/80` on that widget.
- Not published: header only (same as V14).
- Empty list: “Nábor nemá žádný inzerát.” + optional “Vytvořit inzerát” in the right column.
- `showAdditionalAdvertisementsLink`: first ad only, then “Zobrazit další inzeráty (N)” in the right column.
- Unpublished job: same as V14 — portals render as ended.
- Any status other than `published` / `unpublished` (draft, archived, active): hide the right column and divider. Left column uses the full width. Same `showAdvertisements` rule as V14.

Prolong / edit / end publication remain in the kebab menu. They are not duplicated on the right.

## Props

Same as `JobCardV14`, except these V14-only action props are **omitted** because the UI is gone:

- `advertisementActionLayout`
- `showProlong`
- `onAdvertisementDetailClick`

Menu handlers (`onExtendAndRepublish`, `onEditAdvertisement`, `onCreateAdvertisement`, …) stay.

## Files

- New folder `src/components/JobCardV20/` copied from V14, then layout/widget/tests/stories renamed to V20.
- Barrel export from `src/components/index.ts` next to V17 (`JobCardV20` + widget types). Do not grow `App.tsx`.
- Storybook: `Jobs/Job Cards Variant/JobCardV20`.
- Keep the rest of the V14 story set (running, ended, ending soon, not published, highlights, note, multiple ads, additional ads, empty, unpublished). Drop the three V14 advertisement-action stories.

After the copy, delete `AdvertisementAction` (component, stories, tests) from V20. Nothing in V20 imports or renders it.

## Tests

- Title + assignee + pipeline are in the left column; pipeline is not beside the title.
- Advertisements are in the right column (`job-card-advertisements`), sibling of the left column, not under the header.
- Right column has a left border; widget has no V14-style full-width top band padding (`tm-pl-14`).
- Compact widget: status + portals present; `job-card-advertisement-action` is not in the DOM.
- Draft hides the right column.
- Empty ads, unpublished-as-ended, additional-ads link, ending-soon warning background — same behaviour as V14, in the right column.
- Note stays in the left column under the pipeline.

## Out of scope

- Changing `JobCardV14` or V15–V17
- Adding Detail / Prodloužit / view stats back onto the card
- Product listing page / `App.tsx`
- Responsive stacking of the two columns (desktop two-column only, same as the screenshot)
- Publishing to `@almacareer/teamio-ui-components`
