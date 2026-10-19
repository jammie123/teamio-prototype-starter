import { Dropdown, DropdownBody, DropdownToggle } from '../Dropdown'
import { cn } from '../../lib/cn'
import { formatCount } from '../JobCardSynteza/formatCount'
import { formatPublicationRange } from '../JobCardSynteza/advertisementSummary'
import type { JobPublication, JobPublicationHighlight as Highlight } from '../JobCardSynteza/types'
import type { JobCardPublicationChannelDecoration } from './JobCardPublicationPortal'

export interface JobCardPublicationHighlightProps {
  publication: JobPublication
  highlight: Highlight
  as?: 'li' | 'span'
  nameDecoration?: JobCardPublicationChannelDecoration
  /** `subtle` uses secondary body text instead of pink emphasis (Simplify 5). */
  variant?: 'default' | 'subtle'
}

const STATS: { key: 'viewCount' | 'reactionCount'; label: string }[] = [
  { key: 'viewCount', label: 'Zhlédnutí' },
  { key: 'reactionCount', label: 'Reakce' },
]

export function JobCardPublicationHighlight({
  publication,
  highlight,
  as = 'li',
  nameDecoration = 'dotted-underline',
  variant = 'default',
}: JobCardPublicationHighlightProps) {
  const Tag = as

  return (
    <Tag
      data-testid="job-card-publication-highlight"
      className="tm-flex tm-items-center tm-gap-1.5 tm-font-normal tm-text-sm"
    >
      <Dropdown
        openOnHover
        hoverDelay={150}
        autoClose={false}
        placement="bottom-start"
        strategy="fixed"
        className="tm-group tm-inline-flex"
      >
        <DropdownToggle variant="custom" className="tm-rounded-none tm-bg-transparent">
          <span
            data-testid="job-card-publication-highlight-name"
            className={cn(
              'tm-border-0',
              variant === 'subtle'
                ? 'tm-font-normal tm-text-secondary-default'
                : 'tm-font-medium tm-text-teamio-pink',
              nameDecoration === 'dotted-underline' &&
                'tm-border-b tm-border-dotted tm-border-secondary',
            )}
          >
            {highlight.name}
          </span>
        </DropdownToggle>
        <DropdownBody
          data-testid="job-card-publication-highlight-dropdown"
          overflow="visible"
          initialFocus={-1}
          className="tm-p-3"
        >
          <div className="tm-flex tm-w-[200px] tm-flex-col tm-gap-3">
            <div className="tm-text-sm tm-font-medium tm-text-primary-default">
              {publication.channel}
            </div>
            <div>
              <div className="tm-text-sm tm-font-medium tm-text-teamio-pink">{highlight.name}</div>
              <div
                data-testid="job-card-publication-highlight-period"
                className="tm-text-13 tm-tabular-nums tm-text-secondary-default"
              >
                {formatPublicationRange(highlight.startDate, highlight.endDate)}
              </div>
            </div>
            <dl
              data-testid="job-card-publication-highlight-stats"
              className="tm-m-0 tm-grid tm-grid-cols-2 tm-gap-2"
            >
              {STATS.map((stat) => (
                <div key={stat.key} className="tm-flex tm-min-w-0 tm-flex-col tm-gap-0.5">
                  <dt className="tm-text-[11px] tm-leading-tight tm-text-secondary-default">
                    {stat.label}
                  </dt>
                  <dd className="tm-m-0 tm-text-sm tm-font-medium tm-tabular-nums tm-text-primary-default">
                    {highlight[stat.key] === undefined
                      ? '–'
                      : formatCount(highlight[stat.key] as number)}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </DropdownBody>
      </Dropdown>
    </Tag>
  )
}

JobCardPublicationHighlight.displayName = 'JobCardPublicationHighlight'
