import type { Placement } from '@floating-ui/react'
import { Button } from '../Button'
import { Dropdown, DropdownBody, DropdownToggle } from '../Dropdown'
import { Icon } from '../Icon'
import { JobPortalLogo, jobPortalLogoTypeFromChannel } from '../JobPortalLogo'
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

export type JobCardPublicationHover = 'portalDetail' | 'placesTable'

export type JobCardPublicationChannelDecoration = 'dotted-underline' | 'plain'

export interface JobCardPublicationPortalProps {
  publication: JobPublication
  expired: boolean
  withSeparator: boolean
  periodBadge?: PublicationPeriodBadge
  periodPresentation?: 'tag' | 'text'
  /** `grid` fills two cells of the parent grid: portal name and badge column. */
  variant?: 'inline' | 'grid'
  hoverContent?: JobCardPublicationHover
  publications?: JobPublication[]
  showProlong?: boolean
  onPreview?: (publication: JobPublication) => void
  onExtend?: (publication: JobPublication) => void
  onExtendAll?: () => void
  channelDecoration?: JobCardPublicationChannelDecoration
  dropdownPlacement?: Placement
  channelLogoSize?: 18 | 20 | 24 | 30 | 35
  showChannelLabel?: boolean
  inlineHighlights?: 'all' | 'none'
  /** Pill wrapper (logo + period) for Simplify 5 mixed periods. */
  portalChip?: boolean
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

export function channelLogoSizeClass(size: 18 | 20 | 24 | 30 | 35 = 18) {
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

export function channelLogoPresentationClass(size: 18 | 20 | 24 | 30 | 35 = 18) {
  return cn(channelLogoSizeClass(size), 'tm-overflow-hidden', 'tm-rounded-full')
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
  channelLogoSize?: 18 | 20 | 24 | 30 | 35
  showChannelLabel?: boolean
}) {
  const conversion = formatConversionRate(publication.reactionCount, publication.viewCount)
  const period = formatPublicationRange(publication.startDate, publication.endDate)
  const tablePublications = publications && publications.length > 0 ? publications : [publication]

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
          <span className="tm-inline-flex tm-items-center tm-gap-1">
            <JobPortalLogo
              type={jobPortalLogoTypeFromChannel(publication.channel)}
              title=""
              data-testid="job-card-publication-channel-logo"
              className={channelLogoPresentationClass(channelLogoSize)}
            />
            {showChannelLabel ? (
              <span
                data-testid="job-card-publication-channel"
                className={cn(
                  'tm-border-0',
                  'tm-font-normal',
                  channelDecoration === 'dotted-underline' &&
                    'tm-border-b tm-border-dotted tm-border-secondary',
                  expired ? 'tm-text-secondary-default' : 'tm-text-primary-default',
                  expired && 'tm-line-through tm-group-hover:tm-no-underline tm-group-open:tm-no-underline',
                )}
              >
                {publication.channel}
              </span>
            ) : null}
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
) {
  if (periodPresentation === 'text') {
    const mixedSimplify7 =
      portalChip && dateChipPresentation === 'simplify7MixedDates'

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
  channelLogoSize?: 18 | 20 | 24 | 30 | 35
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
}: JobCardExpiredPublicationMiniLogoRowProps) {
  if (publications.length === 0) {
    return null
  }

  return (
    <ul
      data-testid={listTestId}
      className="tm-m-0 tm-flex tm-list-none tm-flex-row tm-flex-wrap tm-items-center tm-gap-1 tm-p-0 tm-opacity-60 tm-grayscale"
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
            channelLogoSize={20}
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
  inlineHighlights = 'all',
  portalChip = false,
}: JobCardPublicationPortalProps) {
  const badge = periodBadge
    ? periodBadgeElement(periodBadge, periodPresentation, portalChip)
    : null
  const highlights = inlineHighlights === 'none' ? [] : visibleHighlights(publication)
  const highlightChips = highlights.map((highlight) => (
    <JobCardPublicationHighlight
      key={highlight.id}
      publication={publication}
      highlight={highlight}
      as={variant === 'grid' ? 'span' : 'li'}
      nameDecoration={channelDecoration}
    />
  ))

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
