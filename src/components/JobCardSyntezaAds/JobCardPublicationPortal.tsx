import type { Placement } from '@floating-ui/react'
import type { ReactNode } from 'react'
import { Button } from '../Button'
import { Dropdown, DropdownBody, DropdownToggle } from '../Dropdown'
import { Icon } from '../Icon'
import { JobPortalLogo, jobPortalLogoTypeFromChannel, type JobPortalLogoType } from '../JobPortalLogo'
import { cn } from '../../lib/cn'
import { formatCount } from '../JobCardSynteza/formatCount'
import {
  formatConversionRate,
  formatPublicationRange,
  visibleHighlights,
} from '../JobCardSynteza/advertisementSummary'
import type { JobPublication } from '../JobCardSynteza/types'
import { Tag } from '../Tag'
import type { PublicationPeriodBadge } from './advertisementSummaryAds'
import { JobCardPlacesSummaryTable } from './JobCardPlacesSummaryTable'
import { JobCardPublicationHighlight } from './JobCardPublicationHighlight'
import {
  JobCardSimplify19ChannelStatusDot,
  type JobCardChannelStatusDotPlacement,
  type JobCardSimplify19ChannelStatusTone,
} from '../JobCardSimplify19/JobCardSimplify19ChannelStatusDot'

export type JobCardPublicationHover = 'portalDetail' | 'placesTable'

export type JobCardPublicationChannelDecoration = 'dotted-underline' | 'plain'

export interface JobCardPublicationPortalProps {
  publication: JobPublication
  expired: boolean
  withSeparator: boolean
  periodBadge?: PublicationPeriodBadge
  periodPresentation?: 'tag' | 'text'
  /** `grid` fills two cells of the parent grid: portal name and badge column. */
  variant?: 'inline' | 'grid' | 'stacked'
  hoverContent?: JobCardPublicationHover
  publications?: JobPublication[]
  showProlong?: boolean
  onPreview?: (publication: JobPublication) => void
  onExtend?: (publication: JobPublication) => void
  onExtendAll?: () => void
  channelDecoration?: JobCardPublicationChannelDecoration
  dropdownPlacement?: Placement
  channelLogoSize?: 18 | 20 | 24 | 30 | 35 | 40
  showChannelLabel?: boolean
  /** Overrides the logo resolved from `publication.channel` (Simplify 23 Kariérky wordmark). */
  channelLogoType?: JobPortalLogoType
  inlineHighlights?: 'all' | 'none'
  /** Pill wrapper (logo + period) for Simplify 5 mixed periods. */
  portalChip?: boolean
  /** Simplify 19/21 status dot on the portal logo. */
  channelLogoStatus?: JobCardSimplify19ChannelStatusTone
  /** Simplify 21: dot at bottom of logo; default is top-right (Simplify 19). */
  channelLogoStatusPlacement?: JobCardChannelStatusDotPlacement
  /** Simplify 22: gray-tone logo with reduced opacity (ended portal), no status dot. */
  channelLogoMuted?: boolean
  /** Simplify 22: portal name uses the warning token (portal is ending soon). */
  channelNameTone?: JobCardPublicationChannelNameTone
  /** Simplify 22: no dotted underline / line-through on the portal name (no status dot needed). */
  flatChannelLabel?: boolean
}

export type JobCardPublicationChannelNameTone = 'default' | 'warning'

function channelNameColorClass(expired: boolean, tone: JobCardPublicationChannelNameTone) {
  if (expired) {
    return 'tm-text-secondary-default'
  }

  return tone === 'warning' ? 'tm-text-emotion-warning-emphasis' : 'tm-text-primary-default'
}

function portalChipSubtleClasses(
  color: PublicationPeriodBadge['color'],
  mixedDates = false,
) {
  switch (color) {
    case 'warning':
      return 'tm-text-emotion-warning-emphasis tm-bg-emotion-warning-background'
    case 'informative':
      return mixedDates
        ? 'tm-text-emotion-info-emphasis tm-bg-cover-light'
        : 'tm-text-emotion-info-emphasis tm-bg-emotion-info-background'
  }
}

export function channelLogoSizeClass(size: 18 | 20 | 24 | 30 | 35 | 40 = 18) {
  if (size === 40) {
    return 'tm-size-[40px]'
  }

  if (size === 35) {
    return 'tm-size-[35px]'
  }

  if (size === 30) {
    return 'tm-size-[30px]'
  }

  if (size === 24) {
    return 'tm-size-[24px]'
  }

  if (size === 20) {
    return 'tm-size-[20px]'
  }

  return 'tm-size-[18px]'
}

export function channelLogoPresentationClass(size: 18 | 20 | 24 | 30 | 35 | 40 = 18) {
  return cn(channelLogoSizeClass(size), 'tm-overflow-hidden', 'tm-rounded-full')
}

function channelLogoHeightClass(size: 18 | 20 | 24 | 30 | 35 | 40 = 18) {
  if (size === 40) {
    return 'tm-h-[40px]'
  }

  if (size === 35) {
    return 'tm-h-[35px]'
  }

  if (size === 30) {
    return 'tm-h-[30px]'
  }

  if (size === 24) {
    return 'tm-h-[24px]'
  }

  if (size === 20) {
    return 'tm-h-[20px]'
  }

  return 'tm-h-[18px]'
}

const STATS: { key: 'viewCount' | 'reactionCount'; label: string }[] = [
  { key: 'viewCount', label: 'Zhlédnutí' },
  { key: 'reactionCount', label: 'Reakce' },
]

function PublicationDropdown({
  publication,
  expired,
  hoverContent = 'portalDetail',
  publications,
  showProlong = false,
  onPreview,
  onExtend,
  onExtendAll,
  channelDecoration = 'dotted-underline',
  dropdownPlacement = 'bottom-start',
  channelLogoSize = 18,
  showChannelLabel = true,
  channelLogoType,
  channelLabelFooter,
  channelLogoStatus,
  channelLogoStatusPlacement,
  channelLogoMuted = false,
  channelNameTone = 'default',
  flatChannelLabel = false,
}: {
  publication: JobPublication
  expired: boolean
  hoverContent?: JobCardPublicationHover
  publications?: JobPublication[]
  showProlong?: boolean
  onPreview?: (publication: JobPublication) => void
  onExtend?: (publication: JobPublication) => void
  onExtendAll?: () => void
  channelDecoration?: JobCardPublicationChannelDecoration
  dropdownPlacement?: Placement
  channelLogoSize?: 18 | 20 | 24 | 30 | 35 | 40
  showChannelLabel?: boolean
  channelLogoType?: JobPortalLogoType
  /** Second line under channel name (Simplify 19 stacked portals). */
  channelLabelFooter?: ReactNode
  channelLogoStatus?: JobCardSimplify19ChannelStatusTone
  channelLogoStatusPlacement?: JobCardChannelStatusDotPlacement
  channelLogoMuted?: boolean
  channelNameTone?: JobCardPublicationChannelNameTone
  flatChannelLabel?: boolean
}) {
  const conversion = formatConversionRate(publication.reactionCount, publication.viewCount)
  const period = formatPublicationRange(publication.startDate, publication.endDate)
  const tablePublications = publications && publications.length > 0 ? publications : [publication]
  const simplify19ChannelLabel = Boolean(channelLogoStatus) || flatChannelLabel
  const channelNameColor = channelNameColorClass(expired, channelNameTone)
  const resolvedLogoType = channelLogoType ?? jobPortalLogoTypeFromChannel(publication.channel)
  const karierkyWordmark = resolvedLogoType === 'karierky'

  return (
    <Dropdown
      openOnHover
      hoverDelay={150}
      autoClose={false}
      placement={dropdownPlacement}
      strategy="fixed"
      className="tm-group tm-inline-flex"
    >
        <DropdownToggle
          variant="custom"
          className="tm-rounded-none tm-bg-transparent"
          aria-label={showChannelLabel ? undefined : publication.channel}
        >
          <span
            className={cn(
              'tm-inline-flex tm-gap-1.5',
              !showChannelLabel && channelLabelFooter
                ? 'tm-flex-col tm-items-center tm-gap-0.5'
                : channelLabelFooter
                  ? 'tm-items-start'
                  : 'tm-items-center tm-gap-1',
            )}
          >
            <span className="tm-relative tm-inline-flex tm-shrink-0">
              {karierkyWordmark ? (
                <span
                  data-testid="job-card-publication-channel-logo"
                  data-logo-type="karierky"
                  className={cn(
                    'tm-inline-flex tm-items-center tm-gap-1 tm-rounded-full tm-pr-2',
                    'tm-bg-[#FFF5E1]',
                    channelLogoHeightClass(channelLogoSize),
                    channelLogoMuted && 'tm-opacity-80 tm-grayscale',
                  )}
                >
                  <JobPortalLogo
                    type="pages"
                    title=""
                    className={channelLogoPresentationClass(channelLogoSize)}
                  />
                  <span className="tm-pr-0.5 tm-text-[11px] tm-font-semibold tm-leading-none tm-text-[#963F00]">
                    Kariérky
                  </span>
                </span>
              ) : (
                <JobPortalLogo
                  type={resolvedLogoType}
                  title=""
                  data-testid="job-card-publication-channel-logo"
                  className={cn(
                    channelLogoPresentationClass(channelLogoSize),
                    channelLogoMuted && 'tm-opacity-80 tm-grayscale',
                  )}
                />
              )}
              {channelLogoStatus ? (
                <JobCardSimplify19ChannelStatusDot
                  tone={channelLogoStatus}
                  placement={channelLogoStatusPlacement}
                />
              ) : null}
            </span>
            {showChannelLabel ? (
              channelLabelFooter ? (
                <span className="tm-flex tm-min-w-0 tm-flex-col tm-gap-0 tm-leading-snug">
                  <span
                    data-testid="job-card-publication-channel"
                    className={cn(
                      'tm-border-0',
                      'tm-font-normal',
                      !simplify19ChannelLabel &&
                        channelDecoration === 'dotted-underline' &&
                        'tm-border-b tm-border-dotted tm-border-secondary',
                      channelNameColor,
                      expired &&
                        !simplify19ChannelLabel &&
                        'tm-line-through tm-group-hover:tm-no-underline tm-group-open:tm-no-underline',
                    )}
                  >
                    {publication.channel}
                  </span>
                  {channelLabelFooter}
                </span>
              ) : (
                <span
                  data-testid="job-card-publication-channel"
                  className={cn(
                    'tm-border-0',
                    'tm-font-normal',
                    !simplify19ChannelLabel &&
                      channelDecoration === 'dotted-underline' &&
                      'tm-border-b tm-border-dotted tm-border-secondary',
                    channelNameColor,
                    expired &&
                      !simplify19ChannelLabel &&
                      'tm-line-through tm-group-hover:tm-no-underline tm-group-open:tm-no-underline',
                  )}
                >
                  {publication.channel}
                </span>
              )
            ) : (
              channelLabelFooter
            )}
          </span>
        </DropdownToggle>
        <DropdownBody
          data-testid="job-card-publication-dropdown"
          overflow="visible"
          initialFocus={-1}
          className={
            hoverContent === 'placesTable'
              ? 'tm-p-2 !tm-max-w-[min(36rem,calc(100vw-2rem))]'
              : 'tm-p-3'
          }
        >
          {hoverContent === 'placesTable' ? (
            <JobCardPlacesSummaryTable
              publications={tablePublications}
              showProlong={showProlong}
              onExtend={onExtendAll}
            />
          ) : null}
          {hoverContent === 'portalDetail' ? (
          <div className="tm-flex tm-w-[200px] tm-flex-col tm-gap-3">
            <div className="tm-flex tm-items-start tm-justify-between tm-gap-4">
              <div className="tm-flex tm-min-w-0 tm-flex-1 tm-items-start tm-gap-2">
                <JobPortalLogo
                  type={jobPortalLogoTypeFromChannel(publication.channel)}
                  title=""
                  className="tm-size-8"
                />
                <div className="tm-min-w-0 tm-flex-1">
                  <div className="tm-text-sm tm-font-medium tm-text-primary-default">{publication.channel}</div>
                  <div
                    data-testid="job-card-publication-dropdown-period"
                    className="tm-text-13 tm-tabular-nums tm-text-secondary-default"
                  >
                    {period}
                  </div>
                </div>
              </div>
              {expired ? null : (
                <Button
                  variant="tertiary"
                  size="small"
                  isCircle
                  aria-label="Zobrazit náhled"
                  data-testid="job-card-publication-preview"
                  className="tm-shrink-0"
                  onClick={(event) => {
                    event.preventDefault()
                    event.stopPropagation()
                    onPreview?.(publication)
                  }}
                >
                  <Icon name="eye" />
                </Button>
              )}
            </div>

            <dl
              data-testid="job-card-publication-stats"
              className="tm-m-0 tm-grid tm-grid-cols-3 tm-gap-2"
            >
              {STATS.map((stat) => (
                <div key={stat.key} className="tm-flex tm-min-w-0 tm-flex-col tm-gap-0.5">
                  <dt className="tm-text-[11px] tm-leading-tight tm-text-secondary-default">{stat.label}</dt>
                  <dd className="tm-m-0 tm-text-sm tm-font-medium tm-tabular-nums tm-text-primary-default">
                    {publication[stat.key] === undefined ? '–' : formatCount(publication[stat.key] as number)}
                  </dd>
                </div>
              ))}
              <div className="tm-flex tm-min-w-0 tm-flex-col tm-gap-0.5">
                <dt className="tm-text-[11px] tm-leading-tight tm-text-secondary-default">Konverze</dt>
                <dd className="tm-m-0 tm-text-sm tm-font-medium tm-tabular-nums tm-text-primary-default">
                  {conversion ?? '–'}
                </dd>
              </div>
            </dl>

            {expired ? (
              <Button
                variant="secondary"
                size="small"
                data-testid="job-card-publication-extend"
                onClick={(event) => {
                  event.preventDefault()
                  event.stopPropagation()
                  onExtend?.(publication)
                }}
              >
                Prodloužit
              </Button>
            ) : null}
          </div>
          ) : null}
        </DropdownBody>
    </Dropdown>
  )
}

function periodBadgeElement(
  periodBadge: PublicationPeriodBadge,
  periodPresentation: 'tag' | 'text',
  portalChip: boolean,
  dateChipPresentation: 'default' | 'simplify7MixedDates' = 'default',
  stackedUnderPortal = false,
) {
  if (periodPresentation === 'text') {
    const mixedSimplify7 =
      portalChip && dateChipPresentation === 'simplify7MixedDates'

    if (stackedUnderPortal) {
      return (
        <span
          data-testid="job-card-publication-period-badge"
          className={cn(
            'tm-text-xs tm-font-normal tm-tabular-nums tm-leading-snug',
            periodBadge.color === 'warning'
              ? 'tm-text-emotion-warning-emphasis'
              : 'tm-text-secondary-default',
          )}
        >
          {periodBadge.label}
        </span>
      )
    }

    return (
      <span
        data-testid="job-card-publication-period-badge"
        className={
          mixedSimplify7
            ? cn(
                'tm-text-sm tm-font-normal tm-tabular-nums',
                periodBadge.color === 'warning' && 'tm-text-emotion-warning-emphasis',
                periodBadge.color !== 'warning' && 'tm-text-secondary-default',
              )
            : portalChip
              ? cn(
                  'tm-text-sm tm-tabular-nums',
                  periodBadge.color === 'warning' && 'tm-font-medium',
                )
              : periodBadge.color === 'warning'
                ? 'tm-text-sm tm-font-medium tm-text-emotion-warning-emphasis'
                : 'tm-text-sm tm-text-secondary-default'
        }
      >
        {periodBadge.label}
      </span>
    )
  }

  return (
    <Tag color={periodBadge.color} isSubtle data-testid="job-card-publication-period-badge">
      {periodBadge.label}
    </Tag>
  )
}

export interface JobCardPublicationPortalDateChipGroupProps {
  publications: JobPublication[]
  expired: boolean
  periodBadge: PublicationPeriodBadge
  periodPresentation?: 'tag' | 'text'
  hoverContent?: JobCardPublicationHover
  allPublications?: JobPublication[]
  showProlong?: boolean
  onPreview?: (publication: JobPublication) => void
  onExtend?: (publication: JobPublication) => void
  onExtendAll?: () => void
  channelDecoration?: JobCardPublicationChannelDecoration
  dropdownPlacement?: Placement
  channelLogoSize?: 18 | 20 | 24 | 30 | 35 | 40
  showChannelLabel?: boolean
  /** Gap between logos inside the chip (Simplify6 uses a tighter row). */
  logoRowGapClass?: string
  /** Larger chip padding and regular-weight date text (Simplify7 mixed periods). */
  dateChipPresentation?: 'default' | 'simplify7MixedDates'
}

export function JobCardPublicationPortalDateChipGroup({
  publications: chipPublications,
  expired,
  periodBadge,
  periodPresentation = 'text',
  hoverContent = 'portalDetail',
  allPublications,
  showProlong,
  onPreview,
  onExtend,
  onExtendAll,
  channelDecoration = 'dotted-underline',
  dropdownPlacement = 'bottom-start',
  channelLogoSize = 18,
  showChannelLabel = true,
  logoRowGapClass = 'tm-gap-1',
  dateChipPresentation = 'default',
}: JobCardPublicationPortalDateChipGroupProps) {
  const badge = periodBadgeElement(periodBadge, periodPresentation, true, dateChipPresentation)
  const simplify7MixedDates = dateChipPresentation === 'simplify7MixedDates'

  return (
    <li
      data-testid="job-card-publication"
      className={cn(
        'tm-flex tm-items-center tm-font-normal tm-text-sm',
        expired ? 'tm-text-secondary-default' : 'tm-text-primary-default',
      )}
    >
      <span
        data-testid="job-card-publication-chip"
        className={cn(
          'tm-inline-flex tm-items-center tm-gap-2 tm-border-0 tm-rounded-full',
          'tm-font-poppins tm-text-sm tm-font-normal',
          simplify7MixedDates ? 'tm-py-1 tm-px-3' : 'tm-py-1 tm-pl-1 tm-pr-2.5',
          portalChipSubtleClasses(periodBadge.color, simplify7MixedDates),
        )}
      >
        <span className={cn('tm-inline-flex tm-items-center', logoRowGapClass)}>
          {chipPublications.map((publication) => (
            <PublicationDropdown
              key={publication.id}
              publication={publication}
              expired={expired}
              hoverContent={hoverContent}
              publications={allPublications}
              showProlong={showProlong}
              onPreview={onPreview}
              onExtend={onExtend}
              onExtendAll={onExtendAll}
              channelDecoration={channelDecoration}
              dropdownPlacement={dropdownPlacement}
              channelLogoSize={channelLogoSize}
              showChannelLabel={showChannelLabel}
            />
          ))}
        </span>
        {badge}
      </span>
    </li>
  )
}

JobCardPublicationPortalDateChipGroup.displayName = 'JobCardPublicationPortalDateChipGroup'

export interface JobCardExpiredPublicationMiniLogoRowProps {
  publications: JobPublication[]
  listTestId: string
  hoverContent?: JobCardPublicationHover
  allPublications?: JobPublication[]
  showProlong?: boolean
  onPreview?: (publication: JobPublication) => void
  onExtend?: (publication: JobPublication) => void
  onExtendAll?: () => void
  channelDecoration?: JobCardPublicationChannelDecoration
  dropdownPlacement?: Placement
  channelLogoSize?: 18 | 20 | 24 | 30 | 35 | 40
  /** When false, expired logos keep full color (Simplify 11). */
  muted?: boolean
}

/** Gray miniature portal logos in one row (Simplify 8 ended advertisements). */
export function JobCardExpiredPublicationMiniLogoRow({
  publications,
  listTestId,
  hoverContent = 'portalDetail',
  allPublications,
  showProlong = false,
  onPreview,
  onExtend,
  onExtendAll,
  channelDecoration = 'plain',
  dropdownPlacement = 'bottom-start',
  channelLogoSize = 20,
  muted = true,
}: JobCardExpiredPublicationMiniLogoRowProps) {
  if (publications.length === 0) {
    return null
  }

  return (
    <ul
      data-testid={listTestId}
      className={cn(
        'tm-m-0 tm-flex tm-list-none tm-flex-row tm-flex-wrap tm-items-center tm-gap-1 tm-p-0',
        muted && 'tm-opacity-60 tm-grayscale',
      )}
    >
      {publications.map((publication) => (
        <li key={publication.id} data-testid="job-card-publication">
          <PublicationDropdown
            publication={publication}
            expired
            hoverContent={hoverContent}
            publications={allPublications}
            showProlong={showProlong}
            onPreview={onPreview}
            onExtend={onExtend}
            onExtendAll={onExtendAll}
            channelDecoration={channelDecoration}
            dropdownPlacement={dropdownPlacement}
            channelLogoSize={channelLogoSize}
            showChannelLabel={false}
          />
        </li>
      ))}
    </ul>
  )
}

JobCardExpiredPublicationMiniLogoRow.displayName = 'JobCardExpiredPublicationMiniLogoRow'

export function JobCardPublicationPortal({
  publication,
  expired,
  withSeparator,
  periodBadge,
  periodPresentation = 'tag',
  variant = 'inline',
  hoverContent = 'portalDetail',
  publications,
  showProlong,
  onPreview,
  onExtend,
  onExtendAll,
  channelDecoration = 'dotted-underline',
  dropdownPlacement = 'bottom-start',
  channelLogoSize = 18,
  showChannelLabel = true,
  channelLogoType,
  inlineHighlights = 'all',
  portalChip = false,
  channelLogoStatus,
  channelLogoStatusPlacement,
  channelLogoMuted,
  channelNameTone,
  flatChannelLabel,
}: JobCardPublicationPortalProps) {
  const badge = periodBadge
    ? periodBadgeElement(
        periodBadge,
        periodPresentation,
        portalChip,
        'default',
        variant === 'stacked',
      )
    : null
  const highlights = inlineHighlights === 'none' ? [] : visibleHighlights(publication)
  const highlightChips = highlights.map((highlight) => (
    <JobCardPublicationHighlight
      key={highlight.id}
      publication={publication}
      highlight={highlight}
      as={variant === 'grid' || variant === 'stacked' ? 'span' : 'li'}
      nameDecoration={channelDecoration}
    />
  ))

  if (variant === 'stacked') {
    return (
      <li
        data-testid="job-card-publication"
        className={cn(
          'tm-flex tm-min-w-0 tm-max-w-[11rem] tm-items-start',
          'tm-font-normal tm-text-sm',
          expired ? 'tm-text-secondary-default' : 'tm-text-primary-default',
        )}
      >
        <PublicationDropdown
          publication={publication}
          expired={expired}
          hoverContent={hoverContent}
          publications={publications}
          showProlong={showProlong}
          onPreview={onPreview}
          onExtend={onExtend}
          onExtendAll={onExtendAll}
          channelDecoration={channelDecoration}
          dropdownPlacement={dropdownPlacement}
          channelLogoSize={channelLogoSize}
          showChannelLabel={showChannelLabel}
          channelLogoType={channelLogoType}
          channelLabelFooter={badge}
          channelLogoStatus={channelLogoStatus}
          channelLogoStatusPlacement={channelLogoStatusPlacement}
          channelLogoMuted={channelLogoMuted}
          channelNameTone={channelNameTone}
          flatChannelLabel={flatChannelLabel}
        />
        {highlightChips}
      </li>
    )
  }

  if (variant === 'grid') {
    return (
      <div data-testid="job-card-publication" className="tm-contents">
        <span
          className={cn(
            'tm-flex',
            'tm-min-w-0',
            'tm-flex-wrap',
            'tm-items-center',
            'tm-gap-x-1.5',
            'tm-gap-y-1',
            'tm-font-normal',
            'tm-text-sm',
            expired ? 'tm-text-secondary-default' : 'tm-text-primary-default',
          )}
        >
          <PublicationDropdown
            publication={publication}
            expired={expired}
            hoverContent={hoverContent}
            publications={publications}
            showProlong={showProlong}
            onPreview={onPreview}
            onExtend={onExtend}
            onExtendAll={onExtendAll}
            channelDecoration={channelDecoration}
            dropdownPlacement={dropdownPlacement}
            channelLogoSize={channelLogoSize}
            showChannelLabel={showChannelLabel}
            channelLogoType={channelLogoType}
          />
          {highlightChips}
        </span>
        <span className="tm-flex tm-items-center">{badge}</span>
      </div>
    )
  }

  return (
    <>
      <li
        data-testid="job-card-publication"
        className={cn(
          'tm-flex',
          'tm-items-center',
          'tm-gap-1.5',
          'tm-font-normal',
          expired ? 'tm-text-secondary-default' : 'tm-text-primary-default',
          'tm-text-sm',
        )}
      >
        {withSeparator ? (
          <span
            aria-hidden
            data-testid="job-card-publication-separator"
            className="tm-text-secondary-default"
          >
            ·
          </span>
        ) : null}
        {portalChip && periodBadge ? (
          <span
            data-testid="job-card-publication-chip"
            className={cn(
              'tm-inline-flex',
              'tm-items-center',
              'tm-gap-2',
              'tm-py-1',
              'tm-pl-1',
              'tm-pr-2.5',
              'tm-font-poppins',
              'tm-text-sm',
              'tm-font-normal',
              'tm-border-0',
              'tm-rounded-full',
              portalChipSubtleClasses(periodBadge.color),
            )}
          >
            <PublicationDropdown
              publication={publication}
              expired={expired}
              hoverContent={hoverContent}
              publications={publications}
              showProlong={showProlong}
              onPreview={onPreview}
              onExtend={onExtend}
              onExtendAll={onExtendAll}
              channelDecoration={channelDecoration}
              dropdownPlacement={dropdownPlacement}
              channelLogoSize={channelLogoSize}
              showChannelLabel={showChannelLabel}
              channelLogoType={channelLogoType}
            />
            {badge}
          </span>
        ) : (
          <>
            <PublicationDropdown
              publication={publication}
              expired={expired}
              hoverContent={hoverContent}
              publications={publications}
              showProlong={showProlong}
              onPreview={onPreview}
              onExtend={onExtend}
              onExtendAll={onExtendAll}
              channelDecoration={channelDecoration}
              dropdownPlacement={dropdownPlacement}
              channelLogoSize={channelLogoSize}
              showChannelLabel={showChannelLabel}
              channelLogoType={channelLogoType}
            />
            {badge}
          </>
        )}
      </li>
      {highlightChips}
    </>
  )
}

JobCardPublicationPortal.displayName = 'JobCardPublicationPortal'
