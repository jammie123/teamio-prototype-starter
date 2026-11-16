import type { ReactNode } from 'react'
import { Dropdown, DropdownBody, DropdownToggle } from '../Dropdown'
import { Icon } from '../Icon'
import { JobPortalLogo, jobPortalLogoTypeFromChannel } from '../JobPortalLogo'
import { Link } from '../Link'
import { formatConversionRate, formatCount } from './lib/format'
import { formatPublicationRange } from './lib/dates'
import type { JobPublication } from './types'

const STATS: { key: 'viewCount' | 'reactionCount'; label: string }[] = [
  { key: 'viewCount', label: 'Zhlédnutí' },
  { key: 'reactionCount', label: 'Reakce' },
]

export function PlacementStats({
  viewCount,
  reactionCount,
  testId,
}: {
  viewCount?: number
  reactionCount?: number
  testId: string
}) {
  const conversion = formatConversionRate(reactionCount, viewCount)

  return (
    <dl data-testid={testId} className="tm-m-0 tm-grid tm-grid-cols-3 tm-gap-2">
      {STATS.map((stat) => {
        const value = stat.key === 'viewCount' ? viewCount : reactionCount

        return (
          <div key={stat.key} className="tm-flex tm-min-w-0 tm-flex-col tm-gap-0.5">
            <dt className="tm-text-[11px] tm-leading-tight tm-text-secondary-default">
              {stat.label}
            </dt>
            <dd className="tm-m-0 tm-text-sm tm-font-medium tm-tabular-nums tm-text-primary-default">
              {value === undefined ? '–' : formatCount(value)}
            </dd>
          </div>
        )
      })}
      <div className="tm-flex tm-min-w-0 tm-flex-col tm-gap-0.5">
        <dt className="tm-text-[11px] tm-leading-tight tm-text-secondary-default">Konverze</dt>
        <dd className="tm-m-0 tm-text-sm tm-font-medium tm-tabular-nums tm-text-primary-default">
          {conversion ?? '–'}
        </dd>
      </div>
    </dl>
  )
}

export function AdvertisementDetailLink({ onClick }: { onClick?: () => void }) {
  return (
    <Link
      className="tm-inline-flex tm-items-center tm-gap-0.5 tm-text-sm"
      data-testid="job-card-advertisement-detail-link"
      onClick={onClick}
    >
      Detail inzerce
      <Icon name="chevron-right" className="tm-text-base tm-leading-none" />
    </Link>
  )
}

/** Portal logo, name, period and stats – the body of the hover card of a publication. */
export function PublicationDetails({ publication }: { publication: JobPublication }) {
  return (
    <>
      <div className="tm-flex tm-min-w-0 tm-items-start tm-gap-2">
        <JobPortalLogo
          type={jobPortalLogoTypeFromChannel(publication.channel)}
          title=""
          className="tm-size-8"
        />
        <div className="tm-min-w-0 tm-flex-1">
          <div className="tm-text-sm tm-font-normal tm-text-primary-default">
            {publication.channel}
          </div>
          <div
            data-testid="job-card-publication-dropdown-period"
            className="tm-text-13 tm-tabular-nums tm-text-secondary-default"
          >
            {formatPublicationRange(publication.startDate, publication.endDate)}
          </div>
        </div>
      </div>
      <PlacementStats
        viewCount={publication.viewCount}
        reactionCount={publication.reactionCount}
        testId="job-card-publication-stats"
      />
    </>
  )
}

/** Hover-only popover anchored to `trigger`. */
export function PublicationHoverCard({
  trigger,
  dropdownTestId,
  children,
}: {
  trigger: ReactNode
  dropdownTestId: string
  children: ReactNode
}) {
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
        {trigger}
      </DropdownToggle>
      <DropdownBody
        data-testid={dropdownTestId}
        overflow="visible"
        initialFocus={-1}
        className="!tm-max-w-none tm-p-3"
      >
        <div className="tm-flex tm-w-[280px] tm-flex-col tm-gap-3">{children}</div>
      </DropdownBody>
    </Dropdown>
  )
}
