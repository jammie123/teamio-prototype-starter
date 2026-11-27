# EPIC: Výpis náborů

| Pole | Hodnota |
| --- | --- |
| **Typ** | Epic |
| **Název** | Výpis náborů |
| **Oblast** | Jobs / Recruiting list |
| **Zdroj** | Storybook katalog (`Jobs/Přehled výpisu náborů`, `Jobs/Job Card`, související komponenty) |
| **Cíl** | Sestavit stránku výpisu náborů jako jednu funkční plochu: taby, header, filtrace, seznam karet, hromadné akce a související dialogy. |

## Shrnutí

Uživatel (recruiter / hiring manager) na jedné stránce prochází nábory, filtruje a řadí je, otevírá akce nad náborem i inzercí, hromadně vybírá karty a potvrzuje změny v modalech.

## Scope stránky

| Část stránky | Komponenta (katalog) | Storybook |
| --- | --- | --- |
| Tabová navigace | `Tabs` (Otevřené, Zveřejněné, Nezveřejněné, Rozpracované, Archivní; countery po filtraci) | `Components / Tabs` · WithCounts |
| Header | `JobPageHeader` | `Jobs / JobPageHeader / V1` |
| Filtrace + sorting | `JobsFilterV2` | `Jobs / JobsFilter / V2` |
| Seznam karet | `JobCardV40` (+ empty state) | `Jobs / Job Card`, `Jobs / EmptyJobSearch` |
| Hromadné akce | `JobBulkAction` + checkbox na kartě | `Jobs / JobBulkAction` |
| Dialogy | `Modal` + `JobModal*` | `Components / Modal`, `Jobs / JobModals/*` |

## Acceptance criteria (epic)

- [ ] Stránka skládá taby, header, filtr, výpis karet a empty state do jednoho flow.
- [ ] Countery tabů se přepočítají po filtraci; poslední tab se pamatuje.
- [ ] Filtrace a sorting ovlivňují seznam; reset vyčistí aktivní filtry.
- [ ] Karty pokrývají stavy náboru i inzerce a role Recruiter / Hiring Manager.
- [ ] Hromadný režim zapne checkboxy na kartách a lištu `JobBulkAction`.
- [ ] Akce nad náborem / inzercí otevírají odpovídající modaly postavené na `Modal`.

## Child issues

| ID | Issue | Priorita |
| --- | --- | --- |
| VN-1 | Job Card (výpis + subkomponenty) | P0 |
| VN-2 | JobFilter (`JobsFilterV2`) | P0 |
| VN-3 | BulkAction (`JobBulkAction`) | P1 |
| VN-4 | Modal (foundation + Job modaly) | P1 |

---

## VN-1 · Job Card

| Pole | Hodnota |
| --- | --- |
| **Typ** | Issue (pod epicem) |
| **Komponenta** | `JobCardV40` |
| **Storybook** | `Jobs / Job Card` (`JobCardV40.mdx`) |
| **Popis** | Karta jednoho náboru ve výpisu — levý sloupec (název, lidé, pipeline, poznámka) a pravý sloupec inzerce (450 px od `md`). |

### Složení karty

| Část | Subkomponenta | Poznámka |
| --- | --- | --- |
| Job menu | `JobMenu` | Akce nad náborem; položky bez handleru se nevykreslí; akce inzerátu dle stavu inzerce. |
| Hlavička | `JobCardHeader`, `JobAssignee`, `JobAdvertisementPreview` | Název, prezentační jednotka, pill „Archivní“, ikona Náhled, zapojení lidé. |
| Pipeline | `JobPipeline` | Recruiter vs Hiring Manager (`isHiringManager`). |
| Poznámka | `JobNote` | Jen když `note.text` není prázdný; ne u Hiring Managera. |
| Advertise | `AdvertisementWidget` → `AdvertisementHeader`, `PublicationList` / `PublicationItem`, `PublicationHoverCard`, `AdvertisementStats`, `AdvertisementEmptyState` | Pravý sloupec. |

Layout: pod `md` se sloupce skládají pod sebe a menu přeskočí nahoru.

### Stavy karty (`status`)

| `status` | Chování |
| --- | --- |
| `published` | Aktivní nábor s inzercí (výchozí). |
| `unpublished` | „Ukončené vystavování“, ztlumená karta. |
| `archived` | Pill „Archivní“, bez akcí inzerátu v menu, bez tlačítka pro nový inzerát. |
| `draft` | Kompaktní řádek: název + „Poslední změna“; bez pipeline, poznámky a inzerce. |

### Stavy inzerce

Stav z `buildAdvertisementModel` (prahy: `ENDING_SOON_DAYS = 7`, `RECENTLY_ENDED_DAYS = 7`).

| Stav | Hlavička | Karta | Akce ve statistikách |
| --- | --- | --- | --- |
| Běží | datum, bez labelu | aktivní | žádná (`Prodloužit` u ukončeného portálu) |
| Končí brzy (≤ 7 dní) | `Končí za N dní` + datum | aktivní | `Prodloužit` |
| Expirováno ≤ 7 dní | `Expirováno před N dny` | aktivní | `Znovuvystavit` |
| Expirováno > 7 dní | `Expirováno` | ztlumená | `Znovuvystavit` |
| Ukončené vystavování | `Ukončené vystavování` | ztlumená | `Znovuvystavit` |
| Bez inzerce | `AdvertisementEmptyState` | aktivní | – |

> **Poznámka k zadání:** zadání může mluvit o hranici 10 dní; aktuální kód a Storybook používají **7 dní**.

### Pohledy a režimy

- **Hiring Manager** (`isHiringManager`): pipeline `K ohodnocení` / `Celkem`; bez inzerce a poznámky.
- **Hromadné akce** (`isBulkAction`, `isSelected`, `onBulkSelectChange`): checkbox vlevo (jen V40).
- **Prezentační jednotka** (`department`): za názvem po tečce.
- **Název inzerátu** (`showAdvertisementTitle`): nad stavem inzerce při více inzerátech.

### JobMenu — pořadí a podmínky

| # | Položka | Handler | Podmínka |
| --- | --- | --- | --- |
| 1 | Editovat nábor | `onEditJob` | – |
| 2 | Duplikovat | `onDuplicateJob` | – |
| 3 | Ukončit vystavování | `onEndPublication` | je nějaká inzerce |
| 4 | Prodloužit a znovuvystavit | `onExtendAndRepublish` | vždy |
| 5 | Zvýraznit | `onHighlightAdvertisement` | běžící inzerce |
| 6 | Topovat | `onTopAdvertisement` | běžící inzerce |
| 7 | Přidat poznámku | `onAddNote` | – |
| 8 | Zapojit kolegu | `onInviteColleagues` | – |
| 9 | Předat nábor | `onTransferJob` | – |
| 10 | Archivovat | `onArchiveJob` | – |

U `draft` / `archived` karta nepředává akce inzerátu do menu.

### JobPipeline

| Varianta | Položky |
| --- | --- |
| Recruiter | Neposouzený, Ve hře, Opalcovaný, Celkem |
| Hiring Manager | K ohodnocení, Celkem |

- Růžový badge nových kandidátů u Neposouzený / K ohodnocení když `candidates.new > 0`.
- `onCandidatesClick` / `onStatClick`: `unassessed` \| `toAssess` \| `inProgress` \| `opalcovani` \| `total`.

### Advertise sekce (sub-issues uvnitř karty)

| Subkomponenta | Účel |
| --- | --- |
| `AdvertisementHeader` | Datum od–do, prioritní upoutávka stavu |
| `PublicationList` | Portály; row/column; limit 5; „+ N dalších“ |
| `PublicationItem` | Indikátor (zelená / oranžová / šedá), název, datum |
| `AdvertisementStats` | Statistiky + kontextové CTA (Prodloužit / Znovuvystavit) |
| `PublicationHoverCard` | Detail portálu na hover |
| `AdvertisementEmptyState` | „Zatím neinzerujete“ + Náhled / Publikovat |

### Callbacky (souhrn)

`onEditJob`, `onDuplicateJob`, `onAddNote`, `onInviteColleagues`, `onTransferJob`, `onArchiveJob`,  
`onEditAdvertisement`, `onExtendAndRepublish`, `onEndPublication`, `onHighlightAdvertisement`, `onTopAdvertisement`,  
`onCandidatesClick`, `onExpandNote`, `onViewStatisticsClick`, `onAdvertisementDetailClick`,  
`onAdvertisementPreviewClick`, `onCreateAdvertisement`, `onBulkSelectChange`.

### Testovací selektory

`job-card`, `job-card-title`, `job-card-pipeline`, `job-card-advertisements`, `job-card-actions-toggle`, `job-card-bulk-select`, `job-card-archived-pill`, `data-variant="v40"`.

### Stories k ověření

Running, Overview (stavy inzerce), Archived, Draft, HiringManager, BulkAction, NoAdvertisement, WithoutNote, PresentationUnit.

### Acceptance criteria

- [ ] Karta skládá menu, hlavičku, pipeline, poznámku a advertise podle stavu a role.
- [ ] Stavy `published` / `unpublished` / `archived` / `draft` odpovídají Storybook dokumentaci.
- [ ] Stavy inzerce a CTA (Prodloužit / Znovuvystavit / empty state) sedí na model s prahem 7 dní.
- [ ] Hiring Manager skryje inzerci a poznámku; pipeline má správné položky.
- [ ] Bulk checkbox se zobrazí jen při `isBulkAction`.
- [ ] JobMenu vykreslí jen položky s handlery a respektuje stav inzerce.
- [ ] Publication list: indikátory portálů, limit 5, hover detail.
- [ ] Selektory a stories z katalogu projdou / jsou pokryté.

---

## VN-2 · JobFilter

| Pole | Hodnota |
| --- | --- |
| **Typ** | Issue (pod epicem) |
| **Komponenta** | `JobsFilterV2` |
| **Storybook** | `Jobs / JobsFilter / V2` |
| **Popis** | Filtrace a sorting výpisu: prioritní filtry vždy vidět, ostatní v „Další filtry“, search, sorting, reset; empty page při nulovém výsledku. |

### Podčásti (jedna komponenta)

| Část | Chování |
| --- | --- |
| Search | Real-time; název inzerátu / náboru (`query`) |
| Filtr Recruiter | Prioritní; pamatuje poslední nastavení |
| Další filtry | Dialog / panel: Liniový manažer, Oddělení, Typ úvazku, Stav inzerátu; Potvrdit |
| Sorting | Od nejnovějších, od nejstarších, dle názvu A–Z (`JOBS_FILTER_SORT_OPTIONS`) |
| Reset | Viditelný / aktivní, když je něco vyplněno (story Filled) |
| Empty page | `EmptyJobSearch` — nic nenalezeno po search / filtrech |

### Hodnota filtru (`JobsFilterValue`)

`query`, `recruiterId`, `managerId`, `departmentId`, `employmentType` (`fullTime` \| `partTime` \| `''`), `advertisementStatus` (`active` \| `ended` \| `''`).

### Stories

Default, MoreFiltersOpen, Filled (+ scénáře EmptyJobSearch: fulltext, filtry, kombinace).

### Acceptance criteria

- [ ] Prioritní filtry + search + sorting jsou vždy dostupné.
- [ ] „Další filtry“ otevře/zavře panel a potvrzení aktualizuje hodnotu.
- [ ] Reset vyčistí aktivní filtry a skryje se ve výchozím prázdném stavu.
- [ ] Empty state se zobrazí, když filtr vrátí 0 výsledků.
- [ ] Countery tabů (epic) se přepočítají po změně filtru.

---

## VN-3 · BulkAction

| Pole | Hodnota |
| --- | --- |
| **Typ** | Issue (pod epicem) |
| **Komponenta** | `JobBulkAction` (+ vazba na `JobCardV40`) |
| **Storybook** | `Jobs / JobBulkAction` |
| **Popis** | Režim hromadných úprav: lišta nad výpisem a checkboxy na kartách. |

### Chování lišty

| Prvek | Detail |
| --- | --- |
| Select all | Checkbox (checked / indeterminate / disabled při `totalCount = 0`) |
| Počet | `Vybráno: N nábor/nábory/náborů` |
| Archivovat | Secondary; disabled dokud `selectedCount = 0` |
| Předat nábor | Secondary; disabled dokud nic nevybráno |
| Vypnout | Tertiary IconButton `x` — ukončí bulk režim |

### Vazba na kartu

- Header zapne `bulkActionsActive` → karty dostanou `isBulkAction`.
- Výběr karty: `isSelected` + `onBulkSelectChange`.
- Při vypnutí bulk režimu se výběr vyčistí.

### Stories

Default, WithSelection, InteractiveListing (s `JobPageHeader` + kartami).

### Acceptance criteria

- [ ] Zapnutí bulk režimu zobrazí lištu a checkboxy na kartách.
- [ ] Select all / partial selection funguje (checked / indeterminate).
- [ ] Archivovat a Předat nábor jsou disabled bez výběru.
- [ ] Vypnutí bulk režimu skryje lištu a zruší výběr.
- [ ] Selektory: `job-bulk-action`, `job-bulk-action-select-all`, `job-bulk-action-count`, `job-card-bulk-select`.

---

## VN-4 · Modal

| Pole | Hodnota |
| --- | --- |
| **Typ** | Issue (pod epicem) |
| **Komponenty** | Foundation `Modal` + Job-specific `JobModal*` / `JobPreviewModal` / `JobDetailStatsModal` |
| **Storybook** | `Components / Modal`, `Jobs / JobModals/*` |
| **Popis** | Sdílený dialogový základ a job dialogy volané z karty / menu / statistik. |

### Foundation `Modal`

Složení: `Modal`, `ModalTrigger`, `ModalContent`, `ModalTitle`, `ModalDescription`, `ModalBody`, `ModalFooter`, `ModalClose`.  
Velikosti: `default` \| `wide` \| `full` \| `fullscreen`.

### Job frame

`JobModalFrame` — title, body, confirm / cancel, optional trigger, `size`; staví na `Modal`.

### Job dialogy (výpis / inzerce)

| Modal | Účel (typicky z Job menu / advertise CTA) |
| --- | --- |
| `JobModalChooseAds` | Výběr inzerátů před akcí |
| `JobModalUnpublish` | Ukončit vystavování |
| `JobModalProlong` | Prodloužit / znovuvystavit |
| `JobModalPublish` | Publikovat |
| `JobModalBoost` | Zvýraznit |
| `JobModalTop` | Topovat |
| `JobPreviewModal` | Náhled inzerátu |
| `JobDetailStatsModal` | Statistiky / přehled inzerce |

### Acceptance criteria

- [ ] Foundation Modal podporuje otevření/zavření, a11y (dialog name, close) a size varianty.
- [ ] Job modaly používají `JobModalFrame` / `Modal` konzistentně (Potvrdit / Zrušit).
- [ ] Akce z JobCard / JobMenu / AdvertisementStats otevírají správný dialog.
- [ ] Loading / error stavy u stats modalu jsou ošetřené (retry kde dává smysl).

---

## Vazby mezi issues

```text
EPIC Výpis náborů
├── VN-2 JobFilter ──────────┐
├── VN-1 Job Card ◄──────────┼── stránkový výpis
├── VN-3 BulkAction ─────────┤   (checkbox na kartě)
└── VN-4 Modal ◄─────────────┘   (akce z karty / menu / stats)
```

## Out of scope (pro teď)

- Samostatné Stories pro Search / Recruiter / Sorting / Reset (jsou součástí `JobsFilterV2`).
- Dedikovaná Jobs tab komponenta (dnes `Components / Tabs`).
- `JobCardV41` jako náhrada V40 (V40 je aktuální varianta katalogu).

## Reference

- `src/components/JobPageHeader/JobsOverview.mdx`
- `src/components/JobCardV40/JobCardV40.mdx` (+ subkomponenty MDX)
- `src/components/JobMenu/JobMenu.mdx`
- `src/components/JobsFilterV2/`
- `src/components/JobBulkAction/`
- `src/components/Modal/`, `src/components/JobModals/`
