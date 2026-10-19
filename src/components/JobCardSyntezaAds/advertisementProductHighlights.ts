import { visibleHighlights } from '../JobCardSynteza/advertisementSummary'
import type { JobPublication, JobPublicationHighlight } from '../JobCardSynteza/types'

export const JOB_CARD_PRODUCT_HIGHLIGHTS_HEADING = 'Zvýraznění inzerátu'

export function isProductHighlight(highlight: JobPublicationHighlight): boolean {
  if (highlight.kind === 'jobstip' || highlight.kind === 'supermax') {
    return true
  }

  const normalized = highlight.name.trim().toLowerCase()
  return normalized === 'jobstip' || normalized === 'supermax'
}

export interface ProductHighlightEntry {
  publication: JobPublication
  highlight: JobPublicationHighlight
}

export function collectProductHighlights(publications: JobPublication[]): ProductHighlightEntry[] {
  const entries: ProductHighlightEntry[] = []

  for (const publication of publications) {
    for (const highlight of visibleHighlights(publication)) {
      if (isProductHighlight(highlight)) {
        entries.push({ publication, highlight })
      }
    }
  }

  return entries
}
