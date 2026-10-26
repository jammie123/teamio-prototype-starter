// Prototype-only EEO check: blocks gendered keywords in criteria text.
const EEO_FORBIDDEN_WORDS = ['muz', 'muzi', 'muzu', 'muze', 'zena', 'zeny', 'zen', 'zenu', 'zene']

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

/** Returns the first forbidden (normalized) word found in the text, or null. */
export function findEeoViolation(text: string): string | null {
  const words = normalize(text).match(/[a-z0-9]+/g) ?? []
  return words.find((word) => EEO_FORBIDDEN_WORDS.includes(word)) ?? null
}
