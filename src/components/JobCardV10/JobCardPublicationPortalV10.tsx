import type { ReactNode } from 'react'
import { Dropdown, DropdownBody, DropdownToggle } from '../Dropdown'
import { JobPortalLogo, jobPortalLogoTypeFromChannel } from '../JobPortalLogo'
import { cn } from '../../lib/cn'
import { formatCount } from '../JobCard/formatCount'
import { formatConversionRate, formatPublicationRange } from '../JobCard/advertisementSummary'
import type { JobPublication } from '../JobCard/types'
import type { JobCardV2Tone } from '../JobCardV2/jobCardV2Presentation'

export interface JobCardPublicationPortalV10Props {
  publication: JobPublication
  tone: JobCardV2Tone
  dateLabel?: string
}

const STATS: { key: 'viewCount' | 'reactionCount'; label: string }[] = [
  { key: 'viewCount', label: 'Zhlédnutí' },
  { key: 'reactionCount', label: 'Reakce' },
]

const DOT_CLASS: Record<JobCardV2Tone, string> = {
  success: 'tm-bg-emotion-success-emphasis',
  warning: 'tm-bg-emotion-warning-emphasis',
  ended: 'tm-bg-gray-300',
}

const CHANNEL_CLASS: Record<JobCardV2Tone, string> = {
  success: 'tm-font-normal tm-text-primary-default',
  warning: 'tm-font-normal tm-text-primary-default',
  ended: 'tm-font-normal tm-text-secondary-default',
}

function PlacementStats({
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
            <dt className="tm-text-[11px] tm-leading-tight tm-text-secondary-default">{stat.label}</dt>
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

function PortalCard({ publication }: { publication: JobPublication }) {
  return (
    <>
      <div className="tm-flex tm-min-w-0 tm-items-start tm-gap-2">
        <JobPortalLogo
          type={jobPortalLogoTypeFromChannel(publication.channel)}
          title=""
          className="tm-size-8"
        />
        <div className="tm-min-w-0 tm-flex-1">
          <div className="tm-text-sm tm-font-normal tm-text-primary-default">{publication.channel}</div>
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

function HoverDropdown({
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
        className="tm-p-3"
      >
        <div className="tm-flex tm-w-[200px] tm-flex-col tm-gap-3">{children}</div>
      </DropdownBody>
    </Dropdown>
  )
}

export function JobCardPublicationPortalV10({
  publication,
  tone,
  dateLabel,
}: JobCardPublicationPortalV10Props) {
  return (
    <li
      data-testid="job-card-publication"
      className={cn('tm-flex', 'tm-items-center', 'tm-gap-1.5', 'tm-font-normal', 'tm-text-sm')}
    >
      <span
        data-testid="job-card-publication-dot"
        className={cn('tm-h-1.5', 'tm-w-1.5', 'tm-shrink-0', 'tm-rounded-full', DOT_CLASS[tone])}
      />
      <HoverDropdown
        dropdownTestId="job-card-publication-dropdown"
        trigger={
          <span
            data-testid="job-card-publication-channel"
            className={cn(
              'tm-border-0',
              'tm-border-b',
              'tm-border-dotted',
              'tm-border-secondary',
              CHANNEL_CLASS[tone],
            )}
          >
            {publication.channel}
          </span>
        }
      >
        <PortalCard publication={publication} />
      </HoverDropdown>
      {dateLabel ? (
        <span
          data-testid="job-card-publication-dates"
          className="tm-text-13 tm-tabular-nums tm-text-secondary-default"
        >
          {dateLabel}
        </span>
      ) : null}
    </li>
  )
}

JobCardPublicationPortalV10.displayName = 'JobCardPublicationPortalV10'
