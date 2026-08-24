import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'
import atmoskopSrc from './logos/atmoskop.svg'
import exportSrc from './logos/export.svg'
import jobsCzSrc from './logos/jobs-cz.svg'
import jobsCzPraceCzSrc from './logos/jobs-cz-prace-cz.svg'
import pagesSrc from './logos/pages.svg'
import praceCzSrc from './logos/prace-cz.svg'
import praceZaRohemSrc from './logos/prace-za-rohem.svg'
import profesiaSrc from './logos/profesia.svg'
import recommendSrc from './logos/recommend.svg'
import sectionsSrc from './logos/sections.svg'
import teamioSrc from './logos/teamio.svg'

export const JOB_PORTAL_LOGO_TYPES = [
  'atmoskop',
  'export',
  'jobs-cz',
  'jobs-cz-prace-cz',
  'pages',
  'prace-cz',
  'prace-za-rohem',
  'profesia',
  'recommend',
  'sections',
  'teamio',
] as const

export type KnownJobPortalLogoType = (typeof JOB_PORTAL_LOGO_TYPES)[number]
export type JobPortalLogoType = KnownJobPortalLogoType | (string & {})

const logoAssets = {
  atmoskop: { src: atmoskopSrc, label: 'Atmoskop' },
  export: { src: exportSrc, label: 'Export' },
  'jobs-cz': { src: jobsCzSrc, label: 'Jobs.cz' },
  'jobs-cz-prace-cz': { src: jobsCzPraceCzSrc, label: 'Jobs.cz + Prace.cz' },
  pages: { src: pagesSrc, label: 'Kariérní stránky' },
  'prace-cz': { src: praceCzSrc, label: 'Prace.cz' },
  'prace-za-rohem': { src: praceZaRohemSrc, label: 'Práce za rohem' },
  profesia: { src: profesiaSrc, label: 'Profesia' },
  recommend: { src: recommendSrc, label: 'Doporučení' },
  sections: { src: sectionsSrc, label: 'Sekce' },
  teamio: { src: teamioSrc, label: 'Teamio' },
} as const satisfies Record<KnownJobPortalLogoType, { src: string; label: string }>

const FALLBACK_TYPE: KnownJobPortalLogoType = 'sections'

const CHANNEL_LOGO_TYPES: Record<string, KnownJobPortalLogoType> = {
  'jobs.cz': 'jobs-cz',
  'prace.cz': 'prace-cz',
  'jobs.cz + prace.cz': 'jobs-cz-prace-cz',
  'kariérní stránky': 'pages',
  atmoskop: 'atmoskop',
  profesia: 'profesia',
  'profesia.sk': 'profesia',
  'práce za rohem': 'prace-za-rohem',
  'prace za rohem': 'prace-za-rohem',
  teamio: 'teamio',
  'export': 'export',
  doporučení: 'recommend',
  recommend: 'recommend',
  sekce: 'sections',
}

export function jobPortalLogoTypeFromChannel(channel: string): KnownJobPortalLogoType {
  return CHANNEL_LOGO_TYPES[channel.trim().toLowerCase()] ?? FALLBACK_TYPE
}

function resolveLogo(type: JobPortalLogoType): {
  src: string
  label: string
  isFallback: boolean
} {
  if (Object.prototype.hasOwnProperty.call(logoAssets, type)) {
    return { ...logoAssets[type as KnownJobPortalLogoType], isFallback: false }
  }

  return { ...logoAssets[FALLBACK_TYPE], isFallback: true }
}

export interface JobPortalLogoProps
  extends StyleProps,
    Omit<HTMLAttributes<HTMLSpanElement>, 'color' | 'title'> {
  type: JobPortalLogoType
  /** Accessible name. Pass an empty string to render the logo as decorative. */
  title?: string
}

export const JobPortalLogo = forwardRef<HTMLSpanElement, JobPortalLogoProps>(
  function JobPortalLogo({ type, title, className, ...rest }, ref) {
    const { src, label, isFallback } = resolveLogo(type)
    const resolvedTitle = title === undefined ? (isFallback ? type : label) : title

    return (
      <span
        ref={ref}
        data-testid="job-portal-logo"
        data-logo-type={type}
        data-logo-fallback={isFallback ? 'true' : undefined}
        role={resolvedTitle ? 'img' : undefined}
        aria-label={resolvedTitle || undefined}
        aria-hidden={resolvedTitle ? undefined : true}
        className={cn('tm-inline-flex', 'tm-size-6', 'tm-shrink-0', 'tm-leading-none', className)}
        {...rest}
      >
        <img src={src} alt="" aria-hidden="true" className="tm-block tm-size-full" />
      </span>
    )
  },
)

JobPortalLogo.displayName = 'JobPortalLogo'
