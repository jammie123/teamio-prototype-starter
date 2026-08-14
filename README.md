# Teamio Prototype Starter

Portable React + TypeScript starter for Teamio UI prototypes. Storybook is the primary component catalog; the Vite app is a small smoke gallery only.

---

## English

### Prerequisites

- **Node.js 22** (see `.nvmrc`; `engines.node` is `>=22`)
- **npm** (bundled with Node)

```bash
nvm use   # or install Node 22 another way
node -v   # expect v22.x
npm -v
```

### Install and run

```bash
npm install
npm run dev            # Vite smoke app → http://localhost:5173
npm run storybook      # Storybook catalog → http://localhost:6006
```

| Script | Purpose |
| --- | --- |
| `npm run dev` | Vite development server (smoke gallery) |
| `npm run storybook` | Storybook 10 catalog (primary UI reference) |
| `npm run build` | Typecheck + Vite production build → `dist/` |
| `npm run build-storybook` | Static Storybook → `storybook-static/` |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript project references check |
| `npm test` | Vitest once |
| `npm run test:watch` | Vitest watch mode |

### Storybook as primary catalog

Use Storybook for exploring tokens and components:

- **Foundation** — colors, typography, spacing, shadows/radii, breakpoints, icons
- **Components** — every public component with Controls, Autodocs, and a11y checks
- **Complex components** — composed layout pieces built from the primitives (e.g. `LeftMenu`)
- Sample copy is often Czech; a11y failures are treated as errors (`a11y.test: 'error'`)

`src/App.tsx` is only a smoke gallery so you can confirm the Vite pipeline quickly. Prefer Storybook when designing or reviewing UI. Do not grow `App.tsx` into product pages.

### Project structure

```text
teamio-prototype-starter/
├── .nvmrc                 # Node 22
├── .storybook/            # Storybook main + preview
├── public/
├── src/
│   ├── App.tsx            # Smoke gallery (not product UI)
│   ├── main.tsx
│   ├── components/        # One folder per component + barrel index.ts
│   ├── docs/              # Foundation Storybook stories
│   ├── lib/               # cn, shared types, validation helpers
│   ├── styles/            # global.css, CSS modules, colors.js
│   └── test/              # Vitest setup
├── tailwind.config.js     # tm- prefix + theme tokens
├── package.json
└── vite.config.ts
```

### Tailwind (`tm-`) and tokens

- All utility classes use the **`tm-` prefix** (e.g. `tm-flex`, `tm-bg-primary-default`).
- Theme / design tokens live mainly in:
  - `tailwind.config.js` — spacing, typography, radii, shadows, breakpoints, animations, CSS variable generation
  - `src/styles/colors.js` — color palette imported by Tailwind
  - `src/styles/global.css` + `src/styles/modules/*` — scaffolding, typography, forms, scrollbar, truncate
- Poppins is self-hosted via `@fontsource/poppins` (no Google Fonts CDN).

### Components: import and contribution

**Import from the barrel:**

```tsx
import { Button, Input, Modal } from './components'
// or from '@/components' if you add a path alias later
```

**Conventions when adding or changing a component:**

1. Create `src/components/ComponentName/` with `ComponentName.tsx`, `index.ts`, stories, and tests.
2. Re-export from `src/components/index.ts`.
3. Prefer shared helpers in `src/lib/` (`cn`, validation, prop types).
4. Add Storybook stories under `title: 'Components/…'` with Czech sample text where useful.
5. Cover default plus relevant disabled / loading / validation / interactive states.
6. Keep the public API intentionally small — match existing prop patterns (`validationState`, `isDisabled`, `size`, etc.).

### Accessibility expectations

- Interactive controls need accessible names (visible label, `aria-label`, or FormLabel wiring).
- Forms use `validationState: 'default' | 'success' | 'warning' | 'error'` with `aria-invalid` / `aria-describedby` where applicable.
- `FormGroup` shares one `controlId` with the single control it wraps — `Input`, `TextArea`, and `Select` adopt it so `FormLabel` can point at them. `Checkbox` and `Radio` keep their own id instead, because one group may hold several of them.
- For a set of checkboxes or radios, render the group heading as `<FormLabel as="p">` (or another non-label element), put the option text on each control via `children`, and wrap the options in `role="radiogroup"` / `role="group"` with an accessible name. All options still inherit the group's validation, disabled, required, and `FormMessage` `aria-describedby`.
- Icon-only controls and modal titles must be labeled.
- Overlay behavior (Modal, Tabs, Tooltip) relies on Radix for focus/keyboard/portal semantics; style with Teamio tokens.
- Storybook `@storybook/addon-a11y` is configured to fail on violations.

### Tests and production builds

```bash
npm test
npm run lint
npm run typecheck
npm run build
npm run build-storybook
```

Fix any failures before treating a prototype as ready to share.

### How this repo is meant to be used

This repository is the **shared Teamio component + Storybook layer**. Keep product prototypes **elsewhere** (sibling folders under `TeamioPrototypes/` or separate repos). Point those apps at this catalog — for example via `npm`/`file:`/`workspace` link, or by importing from a published package — instead of copying components into every prototype.

If you still need a throwaway fork of the whole starter:

```bash
cp -R teamio-prototype-starter my-prototype
cd my-prototype
rm -rf node_modules dist storybook-static .git
# edit package.json "name" to match the new folder
npm install
nvm use
npm run storybook
```

### Future extension layout (in a prototype app, not here)

When you build a real prototype in a separate project, add these folders there — do **not** add a router to this shared component repo:

```text
src/
  pages/          # route-level screens
  router/         # React Router (or similar) setup
  data/*.json     # fixture / mock data
```

Keep this repo’s `src/components/` stable so prototypes compose the catalog instead of forking styles.

### Fidelity boundaries (intentional)

This starter is visually faithful but **self-contained**. It deliberately does **not**:

- Depend on `@almacareer/teamio-ui-components`, `@lmc-eu/spirit-*`, or any private npm/GitHub registry
- Use Spirit Design System packages or source Chromatic tokens
- Pull icons from the original private icon set — use the local **`Icon`** wrapper over **lucide-react**
- Use Radix beyond overlays needing accessible behavior (**Modal**, **Tabs**, **Tooltip**)
- Reimplement a full Select headless — **`Select` is native `<select>`**
- Mirror the entire source component API — only a **subset** needed for prototypes

---

## Čeština

### Předpoklady

- **Node.js 22** (viz `.nvmrc`; `engines.node` je `>=22`)
- **npm** (součást Node)

```bash
nvm use
node -v   # očekávejte v22.x
npm -v
```

### Instalace a spuštění

```bash
npm install
npm run dev            # Vite smoke aplikace → http://localhost:5173
npm run storybook      # Katalog Storybook → http://localhost:6006
```

| Skript | Účel |
| --- | --- |
| `npm run dev` | Vývojový server Vite (smoke galerie) |
| `npm run storybook` | Katalog Storybook 10 (hlavní UI reference) |
| `npm run build` | Typecheck + produkční build Vite → `dist/` |
| `npm run build-storybook` | Statický Storybook → `storybook-static/` |
| `npm run lint` | ESLint |
| `npm run typecheck` | Kontrola TypeScript project references |
| `npm test` | Vitest jednou |
| `npm run test:watch` | Vitest ve watch módu |

### Storybook jako primární katalog

Pro prohlížení tokenů a komponent používejte Storybook:

- **Foundation** — barvy, typografie, spacing, stíny/radiusy, breakpointy, ikony
- **Components** — všechny veřejné komponenty s Controls, Autodocs a a11y kontrolami
- **Complex components** — složené celky postavené z primitiv (např. `LeftMenu`)
- Ukázkové texty jsou často české; porušení a11y se berou jako chyby

`src/App.tsx` je jen smoke galerie pro rychlou kontrolu Vite. Při návrhu UI preferujte Storybook. Nerozšiřujte `App.tsx` na produktové stránky.

### Struktura projektu

```text
teamio-prototype-starter/
├── .nvmrc
├── .storybook/
├── public/
├── src/
│   ├── App.tsx            # Smoke galerie (ne produktové UI)
│   ├── main.tsx
│   ├── components/        # Složka na komponentu + barrel index.ts
│   ├── docs/              # Foundation stories
│   ├── lib/               # cn, sdílené typy, validace
│   ├── styles/            # global.css, CSS moduly, colors.js
│   └── test/
├── tailwind.config.js     # prefix tm- + theme tokeny
├── package.json
└── vite.config.ts
```

### Tailwind (`tm-`) a tokeny

- Utility třídy mají prefix **`tm-`** (např. `tm-flex`, `tm-bg-primary-default`).
- Tokeny jsou zejména v:
  - `tailwind.config.js` — spacing, typografie, radiusy, stíny, breakpointy, animace, CSS proměnné
  - `src/styles/colors.js` — paleta barev
  - `src/styles/global.css` + `src/styles/modules/*` — scaffolding, typografie, formuláře, scrollbar, truncate
- Poppins je self-hosted přes `@fontsource/poppins`.

### Komponenty: import a přispívání

**Importujte z barrel souboru:**

```tsx
import { Button, Input, Modal } from './components'
```

**Při přidání nebo úpravě komponenty:**

1. Vytvořte `src/components/ComponentName/` se `ComponentName.tsx`, `index.ts`, stories a testy.
2. Re-exportujte v `src/components/index.ts`.
3. Sdílenou logiku dávejte do `src/lib/`.
4. Přidejte stories pod `title: 'Components/…'` s českými ukázkami.
5. Pokryjte výchozí stav a relevantní disabled / loading / validaci / interakci.
6. Veřejné API držte úmyslně malé — držte se existujících prop vzorů.

### Očekávání přístupnosti

- Interaktivní prvky potřebují přístupné jméno (viditelný label, `aria-label` nebo FormLabel).
- Formuláře používají `validationState: 'default' | 'success' | 'warning' | 'error'` s `aria-invalid` / `aria-describedby`.
- `FormGroup` sdílí jedno `controlId` s jedním ovládacím prvkem — `Input`, `TextArea` a `Select` si ho přeberou, aby na ně mohl `FormLabel` ukazovat. `Checkbox` a `Radio` si drží vlastní id, protože jedna skupina jich může obsahovat víc.
- U sady checkboxů nebo radiů vykreslete nadpis skupiny jako `<FormLabel as="p">` (nebo jiný ne-label element), text volby dejte na každý prvek přes `children` a volby obalte do `role="radiogroup"` / `role="group"` s přístupným jménem. Všechny volby stále dědí validaci, disabled, required a `aria-describedby` ze `FormMessage`.
- Ovládací prvky jen s ikonou a titulky modalů musí být pojmenované.
- Overlaye (Modal, Tabs, Tooltip) používají Radix pro focus/klávesnici/portál; vizuál přes Teamio tokeny.
- Addon a11y ve Storybooku failuje na porušeních.

### Testy a produkční buildy

```bash
npm test
npm run lint
npm run typecheck
npm run build
npm run build-storybook
```

Než prototyp označíte za připravený ke sdílení, opravte všechny chyby.

### Jak se má tento repozitář používat

Tento repozitář je **sdílená vrstva Teamio komponent + Storybook**. Produktové prototypy držte **jinde** (sourozenecké složky pod `TeamioPrototypes/` nebo samostatné repozitáře). Na tento katalog odkazujte — například přes `npm`/`file:`/`workspace` link, nebo import z publikovaného balíčku — místo kopírování komponent do každého prototypu.

Pokud potřebujete jednorázový fork celé šablony:

```bash
cp -R teamio-prototype-starter my-prototype
cd my-prototype
rm -rf node_modules dist storybook-static .git
# upravte "name" v package.json
npm install
nvm use
npm run storybook
```

### Doporučené rozšíření v prototypové aplikaci (ne zde)

Až budete stavět reálný prototyp v samostatném projektu, přidejte tyto složky **tam** — do tohoto sdíleného repozitáře komponent router nedávejte:

```text
src/
  pages/          # obrazovky podle rout
  router/         # React Router (nebo podobně)
  data/*.json     # fixture / mock data
```

`src/components/` v tomto repu držte stabilní; prototypy skládejte z katalogu.

### Hranice věrnosti (záměrné)

Šablona je vizuálně blízká Teamio, ale **samostatná**. Záměrně:

- **Nezávisí** na `@almacareer/teamio-ui-components`, `@lmc-eu/spirit-*` ani privátním registru
- **Nepoužívá** Spirit Design System ani zdrojové Chromatic tokeny
- Ikony jdou přes lokální **`Icon`** nad **lucide-react**
- Radix jen u overlayů (**Modal**, **Tabs**, **Tooltip**)
- **`Select` je nativní `<select>`**
- Veřejné API je **podmnožina** zdrojové knihovny, dostatočná pro prototypy
