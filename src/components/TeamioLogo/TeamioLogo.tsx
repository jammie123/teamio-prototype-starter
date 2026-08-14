import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'

export type KnownEdition = 'default'
export type Edition = KnownEdition | (string & {})

export type TeamioLogoVariant = 'full' | 'compact'

interface EditionConfig {
  /** Wordmark split into a neutral part and a highlighted part. */
  wordmark: { lead: string; accent: string }
  /** Short form used when the surrounding layout is collapsed. */
  compactMark: string
  hasRegisteredMark: boolean
  suffix?: string
}

const editionConfig = {
  default: {
    wordmark: { lead: 'team', accent: 'io' },
    compactMark: 't',
    hasRegisteredMark: true,
  },
} as const satisfies Record<KnownEdition, EditionConfig>

const FALLBACK_EDITION: KnownEdition = 'default'

function resolveEdition(edition: Edition): { config: EditionConfig; isFallback: boolean } {
  if (Object.prototype.hasOwnProperty.call(editionConfig, edition)) {
    return { config: editionConfig[edition as KnownEdition], isFallback: false }
  }
  return { config: editionConfig[FALLBACK_EDITION], isFallback: true }
}

export interface TeamioLogoProps
  extends StyleProps,
    Omit<HTMLAttributes<HTMLSpanElement>, 'color' | 'title'> {
  /** Client edition. Only `default` is implemented so far, others fall back to it. */
  edition?: Edition
  variant?: TeamioLogoVariant
  /** Accessible name. Pass an empty string to render the logo as decorative. */
  title?: string
}

export const TeamioLogo = forwardRef<HTMLSpanElement, TeamioLogoProps>(function TeamioLogo(
  { edition = 'default', variant = 'full', title = 'Teamio', className, ...rest },
  ref,
) {
  const { config, isFallback } = resolveEdition(edition)
  const isCompact = variant === 'compact'

  return (
    <span
      ref={ref}
      data-testid="teamio-logo"
      data-edition={edition}
      data-edition-fallback={isFallback ? 'true' : undefined}
      data-variant={variant}
      role={title ? 'img' : undefined}
      aria-label={title || undefined}
      aria-hidden={title ? undefined : true}
      className={cn(
        'tm-inline-flex',
        'tm-items-start',
        'tm-font-poppins',
        'tm-font-bold',
        'tm-leading-none',
        'tm-tracking-normal',
        'tm-select-none',
        isCompact ? 'tm-text-xl' : 'tm-text-2xl',
        className,
      )}
      {...rest}
    >
      <span aria-hidden="true" className="tm-text-primary-inverted-default">
        {isCompact ? config.compactMark : config.wordmark.lead}
      </span>
      <span aria-hidden="true" className="tm-text-teamio-pink">
        {isCompact ? '.' : config.wordmark.accent}
      </span>
      {config.hasRegisteredMark && !isCompact ? (
        <span aria-hidden="true" className="tm-ml-0.5 tm-text-xs tm-text-primary-inverted-default">
          ®
        </span>
      ) : null}
      {config.suffix && !isCompact ? (
        <span
          aria-hidden="true"
          className="tm-ml-2 tm-self-center tm-text-sm tm-font-semibold tm-text-secondary-inverted-default"
        >
          {config.suffix}
        </span>
      ) : null}
    </span>
  )
})

TeamioLogo.displayName = 'TeamioLogo'
