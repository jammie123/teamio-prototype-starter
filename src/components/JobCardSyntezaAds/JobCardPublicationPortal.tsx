import { Button } from '../Button'
import { Dropdown, DropdownBody, DropdownToggle } from '../Dropdown'
import { Icon } from '../Icon'
import { JobPortalLogo, jobPortalLogoTypeFromChannel } from '../JobPortalLogo'
import { cn } from '../../lib/cn'
import { formatCount } from '../JobCardSynteza/formatCount'
import { formatConversionRate, formatPublicationRange } from '../JobCardSynteza/advertisementSummary'
import type { JobPublication } from '../JobCardSynteza/types'
import { Tag } from '../Tag'
import type { PublicationPeriodBadge } from './advertisementSummaryAds'

export interface JobCardPublicationPortalProps {
  publication: JobPublication
  expired: boolean
  withSeparator: boolean
  periodBadge?: PublicationPeriodBadge
  periodPresentation?: 'tag' | 'text'
  /** `grid` fills two cells of the parent grid: portal name and badge column. */
  variant?: 'inline' | 'grid'
  onPreview?: (publication: JobPublication) => void
  onExtend?: (publication: JobPublication) => void
}

const STATS: { key: 'viewCount' | 'reactionCount'; label: string }[] = [
  { key: 'viewCount', label: 'Zhlédnutí' },
  { key: 'reactionCount', label: 'Reakce' },
]

function PublicationDropdown({
  publication,
  expired,
  onPreview,
  onExtend,
}: {
  publication: JobPublication
  expired: boolean
  onPreview?: (publication: JobPublication) => void
  onExtend?: (publication: JobPublication) => void
}) {
  const conversion = formatConversionRate(publication.reactionCount, publication.viewCount)
  const period = formatPublicationRange(publication.startDate, publication.endDate)

  return (
    <Dropdown
      openOnHover
      hoverDelay={150}
      autoClose={false}
      placement="bottom-start"
      strategy="fixed"
      className="tm-group tm-inline-flex"
    >
        <DropdownToggle variant="custom" className="tm-rounded-none tm-bg-transparent">
          <span className="tm-inline-flex tm-items-center tm-gap-1">
            <JobPortalLogo
              type={jobPortalLogoTypeFromChannel(publication.channel)}
              title=""
              data-testid="job-card-publication-channel-logo"
              className="tm-size-[18px]"
            />
            <span
              data-testid="job-card-publication-channel"
              className={cn(
                'tm-border-0',
                'tm-border-b',
                'tm-border-dotted',
                'tm-border-secondary',
                'tm-font-normal',
                expired ? 'tm-text-secondary-default' : 'tm-text-primary-default',
                expired && 'tm-line-through tm-group-hover:tm-no-underline tm-group-open:tm-no-underline',
              )}
            >
              {publication.channel}
            </span>
          </span>
        </DropdownToggle>
        <DropdownBody
          data-testid="job-card-publication-dropdown"
          overflow="visible"
          initialFocus={-1}
          className="tm-p-3"
        >
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
        </DropdownBody>
    </Dropdown>
  )
}

export function JobCardPublicationPortal({
  publication,
  expired,
  withSeparator,
  periodBadge,
  periodPresentation = 'tag',
  variant = 'inline',
  onPreview,
  onExtend,
}: JobCardPublicationPortalProps) {
  const badge = periodBadge ? (
    periodPresentation === 'text' ? (
      <span
        data-testid="job-card-publication-period-badge"
        className={
          periodBadge.color === 'warning'
            ? 'tm-text-sm tm-font-medium tm-text-emotion-warning-emphasis'
            : 'tm-text-sm tm-text-secondary-default'
        }
      >
        {periodBadge.label}
      </span>
    ) : (
      <Tag color={periodBadge.color} isSubtle data-testid="job-card-publication-period-badge">
        {periodBadge.label}
      </Tag>
    )
  ) : null

  if (variant === 'grid') {
    return (
      <div data-testid="job-card-publication" className="tm-contents">
        <span
          className={cn(
            'tm-flex',
            'tm-min-w-0',
            'tm-items-center',
            'tm-font-normal',
            'tm-text-sm',
            expired ? 'tm-text-secondary-default' : 'tm-text-primary-default',
          )}
        >
          <PublicationDropdown
            publication={publication}
            expired={expired}
            onPreview={onPreview}
            onExtend={onExtend}
          />
        </span>
        <span className="tm-flex tm-items-center">{badge}</span>
      </div>
    )
  }

  return (
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
      <PublicationDropdown
        publication={publication}
        expired={expired}
        onPreview={onPreview}
        onExtend={onExtend}
      />
      {badge}
    </li>
  )
}

JobCardPublicationPortal.displayName = 'JobCardPublicationPortal'
