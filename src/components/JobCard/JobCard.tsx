import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'
import { Button } from '../Button'
import { Card } from '../Card'
import { Icon } from '../Icon'
import { Link } from '../Link'
import { Tag, type TagColor } from '../Tag'
import { TooltipProvider } from '../Tooltip'
import { Typography } from '../Typography'
import { JobCardActions } from './JobCardActions'
import { JobCardAdvertisement } from './JobCardAdvertisement'
import { JobCardStats } from './JobCardStats'
import { ViewCountRenderer } from './ViewCountRenderer'
import type {
  JobAdvertisement,
  JobCandidateStat,
  JobCardAction,
  JobCardCandidates,
  JobStatus,
} from './types'

export interface JobCardProps
  extends StyleProps,
    Omit<HTMLAttributes<HTMLElement>, 'color' | 'title'> {
  title: string
  owner?: string
  totalViewCount?: number
  status?: JobStatus
  candidates?: JobCardCandidates
  onCandidatesClick?: (stat: JobCandidateStat) => void
  advertisements?: JobAdvertisement[]
  defaultOpenAdvertisementIds?: string[]
  onEdit?: () => void
  editLabel?: string
  actions?: JobCardAction[]
  onCreateAdvertisement?: () => void
}

const STATUS_CONFIG: Record<JobStatus, { label: string; color: TagColor }> = {
  open: { label: 'Otevřený', color: 'success' },
  closed: { label: 'Uzavřený', color: 'neutral' },
}

export const JobCard = forwardRef<HTMLElement, JobCardProps>(function JobCard(
  {
    title,
    owner,
    totalViewCount,
    status = 'open',
    candidates,
    onCandidatesClick,
    advertisements = [],
    defaultOpenAdvertisementIds,
    onEdit,
    editLabel = 'Editovat',
    actions,
    onCreateAdvertisement,
    className,
    ...rest
  },
  ref,
) {
  const statusConfig = STATUS_CONFIG[status]

  return (
    <Card
      as="article"
      ref={ref}
      data-testid="job-card"
      className={cn('tm-flex', 'tm-flex-col', 'tm-gap-4', className)}
      {...rest}
    >
      <TooltipProvider delayDuration={0} skipDelayDuration={0} disableHoverableContent>
        <div className="tm-flex tm-flex-wrap tm-items-start tm-justify-between tm-gap-3">
          <div className="tm-min-w-[12rem] tm-flex-1">
            <Typography variant="h3" className="tm-mb-1 tm-text-teamio-blue">
              {title}
            </Typography>
            <div className="tm-flex tm-flex-wrap tm-items-center tm-gap-x-4 tm-gap-y-1 tm-text-sm tm-text-secondary-default">
              {owner ? <span>{owner}</span> : null}
              {totalViewCount === undefined ? null : (
                <ViewCountRenderer count={totalViewCount} testId="job-card-total-views" />
              )}
            </div>
          </div>

          <div className="tm-flex tm-flex-none tm-items-center tm-gap-2">
            <Tag
              data-testid="job-card-status"
              color={statusConfig.color}
              isSubtle
              className="tm-min-h-8 tm-px-3 !tm-font-medium"
            >
              {status === 'open' ? (
                <span
                  aria-hidden="true"
                  data-testid="job-card-status-indicator"
                  className="tm-size-2 tm-flex-none tm-rounded-full tm-bg-emotion-success-emphasis"
                />
              ) : null}
              {statusConfig.label}
            </Tag>
            {onEdit ? (
              <Button
                variant="secondary"
                size="medium"
                onClick={onEdit}
                className="!tm-font-medium"
              >
                <Icon name="edit" />
                {editLabel}
              </Button>
            ) : null}
            {actions?.length ? (
              <JobCardActions
                actions={actions}
                label="Další akce náboru"
                testId="job-card-actions-toggle"
              />
            ) : null}
          </div>
        </div>

        {candidates ? (
          <JobCardStats candidates={candidates} onStatClick={onCandidatesClick} />
        ) : null}

        <div data-testid="job-card-advertisements">
          {advertisements.length === 0 ? (
            <div
              data-testid="job-card-no-advertisement"
              className="tm-flex tm-flex-wrap tm-items-center tm-gap-x-2 tm-gap-y-1 tm-text-sm tm-text-secondary-default"
            >
              <span>Nábor nemá žádný inzerát.</span>
              {onCreateAdvertisement ? (
                <Link className="tm-text-sm" onClick={onCreateAdvertisement}>
                  Vytvořit inzerát
                </Link>
              ) : null}
            </div>
          ) : (
            <div className="tm-flex tm-flex-col tm-gap-3">
              {advertisements.map((advertisement) => (
                <JobCardAdvertisement
                  key={advertisement.id}
                  advertisement={advertisement}
                  defaultOpen={
                    defaultOpenAdvertisementIds
                      ? defaultOpenAdvertisementIds.includes(advertisement.id)
                      : true
                  }
                />
              ))}
            </div>
          )}
        </div>
      </TooltipProvider>
    </Card>
  )
})

JobCard.displayName = 'JobCard'
