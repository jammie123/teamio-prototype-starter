import { jobPortalLogoTypeFromChannel } from '../../JobPortalLogo'
import type { JobPublication } from '../types'

const HIGHLIGHT_LOGO_TYPES = new Set(['jobs-cz', 'prace-cz', 'atmoskop'])
const HIGHLIGHT_KEYS = new Set(['jobs', 'prace', 'atmoskop'])

function portalKey(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/\.cz$/, '')
}

/** Highlighting exists on Jobs.cz, Prace.cz and Atmoskop. */
export function publicationSupportsHighlight(
  publication: Pick<JobPublication, 'id' | 'channel'>,
): boolean {
  if (HIGHLIGHT_LOGO_TYPES.has(jobPortalLogoTypeFromChannel(publication.channel))) {
    return true
  }

  return [publication.id, publication.channel].some((value) => HIGHLIGHT_KEYS.has(portalKey(value)))
}
