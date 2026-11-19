export const V2_COPY = {
  done: 'Hotovo',
  editingLabel: 'Úprava kritéria',
  finishEditHint: 'Nejdřív dokončete úpravu kritéria.',
  generationErrors: {
    noJobDescription: {
      title: 'Zatím nemáme dost informací k vytvoření kritérií',
      description:
        'K nastavení kvalitních kritérií hodnocení potřebujeme víc informací o pozici a náboru. Doplňte je a kritéria vygenerujeme nebo vytvořte kritéria ručně.',
    },
  },
} as const

/** Why generating criteria from the position failed. Shown under the empty-state buttons. */
export type EvaluationCriteriaGenerationError = keyof typeof V2_COPY.generationErrors

/** Column paddings shared by the table head and rows so the columns line up. */
export const COLUMN_NAME = '!tm-pl-4 !tm-pr-6'
export const COLUMN_PRIORITY = '!tm-px-6'
export const COLUMN_ACTIONS = '!tm-pl-6 !tm-pr-4 tm-whitespace-nowrap'
export const HEADER_Y = '!tm-py-3'
export const BODY_Y = '!tm-py-5 tm-align-middle'
