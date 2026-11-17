import { fileURLToPath } from 'node:url'

/**
 * Lokální Storybook addon: panel "Component tree" s kompozicí React komponent aktuální story.
 * Registrace: `.storybook/main.ts` -> `addons`.
 */
const resolveLocal = (file) => fileURLToPath(new URL(file, import.meta.url))

export const managerEntries = (entry = []) => [...entry, resolveLocal('./manager.tsx')]

export const previewAnnotations = (entry = []) => [...entry, resolveLocal('./preview.tsx')]
