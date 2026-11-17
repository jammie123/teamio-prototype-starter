export const ADDON_ID = 'teamio/component-tree'
export const PANEL_ID = `${ADDON_ID}/panel`

export const EVENTS = {
  /** preview -> manager: nový strom komponent. */
  TREE_UPDATE: `${ADDON_ID}/treeUpdate`,
  /** manager -> preview: panel se otevřel, pošli aktuální strom. */
  TREE_REQUEST: `${ADDON_ID}/treeRequest`,
} as const

export interface TreeNode {
  /** Název komponenty (displayName / name). */
  name: string
  /** Zkrácená cesta ke zdrojáku (např. `components/JobCardV20/JobCardHeader.tsx`), pokud ji jde zjistit. */
  file?: string
  /** `true` = komponenta z tohoto repa, `false` = knihovna (Radix, Lucide, Storybook...). */
  project: boolean
  /** Zkrácený výpis props (bez `children`). */
  props: string[]
  children: TreeNode[]
}
