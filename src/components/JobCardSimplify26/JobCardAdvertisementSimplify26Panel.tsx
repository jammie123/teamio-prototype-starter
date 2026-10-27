import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'
import type { JobAdvertisement, JobPublication } from '../JobCardSynteza/types'
import { JobCardAdvertisementSimplify13Panel } from '../JobCardSimplify13/JobCardAdvertisementSimplify13Panel'
import { AdvertisementList } from './AdvertisementList'
import { JobBoardItem } from './JobBoardItem'
import {
  buildSimplify26AdvertisementModel,
  type Simplify26GroupModel,
} from './jobCardSimplify26Presentation'

export interface JobCardAdvertisementSimplify26PanelProps extends StyleProps {
  advertisement: JobAdvertisement
  onCompleteAdvertisement?: (advertisement: JobAdvertisement) => void
  onViewStatisticsClick?: () => void
  onPreviewAdvertisement?: () => void
  onPreviewPublication?: (publication: JobPublication) => void
  onExtendPublication?: (publication: JobPublication) => void
  onExtendPublications?: () => void
  onRepublishAdvertisement?: () => void
}

function PublicationGroup({ group }: { group: Simplify26GroupModel }) {
  return (
    <div className="tm-flex tm-flex-col tm-gap-2">
      <p
        data-testid={group.testId}
        className={cn('tm-m-0 tm-text-sm tm-font-medium', group.className)}
      >
        {group.title}
      </p>
      <AdvertisementList status={group.listStatus}>
        {group.items.map((item) => (
          <JobBoardItem
            key={item.id}
            channel={item.channel}
            date={item.date}
            status={item.status}
          />
        ))}
      </AdvertisementList>
    </div>
  )
}

export function JobCardAdvertisementSimplify26Panel({
  advertisement,
  onCompleteAdvertisement,
  onViewStatisticsClick,
  onPreviewAdvertisement,
  onPreviewPublication,
  onExtendPublication,
  onExtendPublications,
  onRepublishAdvertisement,
  className,
}: JobCardAdvertisementSimplify26PanelProps) {
  const model = buildSimplify26AdvertisementModel(advertisement)

  if (model.kind === 'fallback') {
    return (
      <JobCardAdvertisementSimplify13Panel
        advertisement={advertisement}
        onCompleteAdvertisement={onCompleteAdvertisement}
        onViewStatisticsClick={onViewStatisticsClick}
        onPreviewAdvertisement={onPreviewAdvertisement}
        onPreviewPublication={onPreviewPublication}
        onExtendPublication={onExtendPublication}
        onExtendPublications={onExtendPublications}
        onRepublishAdvertisement={onRepublishAdvertisement}
        className={className}
      />
    )
  }

  if (model.kind === 'notAdvertising') {
    return (
      <p
        data-testid={model.testId}
        className={cn('tm-m-0 tm-text-sm tm-font-medium', model.className, className)}
      >
        {model.title}
      </p>
    )
  }

  const showDivider = model.active.length > 0 && model.inactive.length > 0

  return (
    <div
      data-testid="job-card-simplify26-columns"
      className={cn('tm-flex tm-flex-col tm-gap-4 md:tm-flex-row md:tm-items-start', className)}
    >
      {model.active.length > 0 ? (
        <div
          data-testid="job-card-simplify26-active-column"
          className="tm-flex tm-min-w-0 tm-flex-1 tm-flex-col tm-gap-4"
        >
          {model.active.map((group) => (
            <PublicationGroup key={group.kind} group={group} />
          ))}
        </div>
      ) : null}
      {model.inactive.length > 0 ? (
        <div
          data-testid="job-card-simplify26-inactive-column"
          className={cn(
            'tm-flex tm-min-w-0 tm-flex-1 tm-flex-col tm-gap-4',
            showDivider &&
              'md:tm-ml-4 md:tm-border-0 md:tm-border-l md:tm-border-solid md:tm-border-secondary md:tm-pl-4',
          )}
        >
          {model.inactive.map((group) => (
            <PublicationGroup key={group.kind} group={group} />
          ))}
        </div>
      ) : null}
    </div>
  )
}

JobCardAdvertisementSimplify26Panel.displayName = 'JobCardAdvertisementSimplify26Panel'
