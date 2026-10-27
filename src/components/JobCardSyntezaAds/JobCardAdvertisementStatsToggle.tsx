import { useState } from 'react'
import { cn } from '../../lib/cn'
import { Button } from '../Button'
import { JobPortalLogo, jobPortalLogoTypeFromChannel } from '../JobPortalLogo'
import {
  formatViewCountLabel,
} from '../JobCardSynteza/advertisementSummary'
import type { JobPublication } from '../JobCardSynteza/types'
import { formatCount } from '../JobCardSynteza/formatCount'
import { JobCardPlacesSummaryTable } from './JobCardPlacesSummaryTable'
import type {
  JobCardPublicationChannelDecoration,
  JobCardPublicationHover,
} from './JobCardPublicationPortal'

export interface JobCardAdvertisementStatsToggleProps {
  publications: JobPublication[]
  viewCount: number
  onViewStatisticsClick?: () => void
  publicationHover?: JobCardPublicationHover
  showProlong?: boolean
  onExtendAll?: () => void
  linkDecoration?: JobCardPublicationChannelDecoration
  className?: string
  dropdownAlign?: 'start' | 'end'
}

export function JobCardAdvertisementStatsToggle({
  publications,
  viewCount,
  onViewStatisticsClick,
  publicationHover = 'portalDetail',
  showProlong = false,
  onExtendAll,
  linkDecoration = 'dotted-underline',
  className,
  dropdownAlign = 'start',
}: JobCardAdvertisementStatsToggleProps) {
  const [open, setOpen] = useState(false)

  const viewsLabel = (
    <span
      data-testid="job-card-advertisement-aggregate-views"
      className={cn(
        'tm-border-0',
        linkDecoration === 'dotted-underline' &&
          'tm-border-b tm-border-dotted tm-border-secondary',
      )}
    >
      {formatViewCountLabel(viewCount)}
    </span>
  )

  return (
    <div
      className={cn('tm-relative tm-flex tm-items-center', className)}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        data-testid="job-card-advertisement-stats-toggle"
        aria-expanded={open}
        className="tm-border-0 tm-bg-transparent tm-p-0 tm-font-inherit tm-text-13 tm-text-secondary-default tm-cursor-pointer"
        onClick={() => setOpen((current) => !current)}
      >
        {viewsLabel}
      </button>
      {open ? (
        publicationHover === 'placesTable' ? (
          <div
            data-testid="job-card-advertisement-stats-dropdown"
            className={cn(
              'tm-absolute tm-top-full tm-z-50 tm-mt-2 tm-w-max tm-max-w-[min(36rem,calc(100vw-2rem))] tm-rounded tm-border tm-border-primary tm-bg-basic tm-p-2 tm-shadow',
              dropdownAlign === 'end' ? 'tm-right-0' : 'tm-left-0',
            )}
          >
            <JobCardPlacesSummaryTable
              publications={publications}
              showProlong={showProlong}
              onExtend={onExtendAll}
            />
          </div>
        ) : (
          <div
            data-testid="job-card-advertisement-stats-dropdown"
            className={cn(
              'tm-absolute tm-top-full tm-z-50 tm-mt-2 tm-rounded tm-border tm-border-primary tm-bg-basic tm-p-3 tm-shadow',
              dropdownAlign === 'end' ? 'tm-right-0' : 'tm-left-0',
            )}
          >
            <div className="tm-flex tm-w-[16rem] tm-flex-col tm-gap-3">
              <ul
                data-testid="job-card-advertisement-stats-list"
                className="tm-m-0 tm-flex tm-list-none tm-flex-col tm-gap-2 tm-p-0"
              >
                {publications.map((publication) => (
                  <li
                    key={publication.id}
                    data-testid="job-card-advertisement-stats-row"
                    className="tm-flex tm-items-start tm-gap-2"
                  >
                    <JobPortalLogo
                      type={jobPortalLogoTypeFromChannel(publication.channel)}
                      title=""
                      className="tm-size-6"
                    />
                    <div className="tm-min-w-0 tm-flex-1">
                      <div className="tm-text-sm tm-font-medium tm-text-primary-default">
                        {publication.channel}
                      </div>
                      <div className="tm-text-13 tm-tabular-nums tm-text-secondary-default">
                        {publication.viewCount === undefined
                          ? '– zhlédnutí'
                          : `${formatCount(publication.viewCount)} zhlédnutí`}
                        {' · '}
                        {publication.reactionCount === undefined
                          ? '– reakcí'
                          : `${formatCount(publication.reactionCount)} reakcí`}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              <Button
                variant="secondary"
                size="small"
                data-testid="job-card-advertisement-detailed-stats"
                onClick={(event) => {
                  event.preventDefault()
                  event.stopPropagation()
                  onViewStatisticsClick?.()
                }}
              >
                Přejít na podrobné statistiky
              </Button>
            </div>
          </div>
        )
      ) : null}
    </div>
  )
}

JobCardAdvertisementStatsToggle.displayName = 'JobCardAdvertisementStatsToggle'
