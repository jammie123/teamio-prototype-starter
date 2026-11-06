import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'
import { Card } from '../Card'
import { Link } from '../Link'
import type { AdvertisementActionLayout } from './AdvertisementAction'
import { AdvertisementWidget } from './AdvertisementWidget'
import { JobAssignee } from './JobAssignee'
import { JobCardActions } from './JobCardActions'
import { buildJobCardMenuSections, type JobCardMenuHandlers } from './jobCardMenu'
import { JobNote } from './JobNote'
import { JobPipeline } from './JobPipeline'
import type {
  JobAdvertisement,
  JobCandidateStat,
  JobCardAction,
  JobCardCandidates,
  JobCardNote,
  JobStatus,
} from './types'

export interface JobCardV14Props
  extends StyleProps,
    JobCardMenuHandlers,
    Omit<HTMLAttributes<HTMLElement>, 'color' | 'title'> {
  title: string
  owner?: string
  hiringManagers?: string[]
  status?: JobStatus
  candidates?: JobCardCandidates
  onCandidatesClick?: (stat: JobCandidateStat) => void
  advertisements?: JobAdvertisement[]
  showAdditionalAdvertisementsLink?: boolean
  onAdditionalAdvertisementsClick?: () => void
  showAdvertisementTitle?: boolean
  /** Poznámka k náboru, pod hlavičkou s titulkem a pipeline. */
  note?: JobCardNote
  onExpandNote?: () => void
  actions?: JobCardAction[]
  /** Reference date for "Brzy končí"; defaults to today. */
  now?: Date
  onAdvertisementDetailClick?: () => void
  /** Advertisement action layout. Defaults to column (stats above Detail o inzerci). */
  advertisementActionLayout?: AdvertisementActionLayout
  /** Override whether Prodloužit is shown on advertisement actions. */
  showProlong?: boolean
}

/** An unpublished job keeps its advertisements, but every portal counts as ended. */
function asEndedAdvertisement(advertisement: JobAdvertisement): JobAdvertisement {
  return {
    ...advertisement,
    publications: advertisement.publications?.map((publication) => ({
      ...publication,
      status: 'expired' as const,
      highlights: publication.highlights?.map((highlight) => ({
        ...highlight,
        status: 'expired' as const,
      })),
    })),
  }
}

export const JobCardV14 = forwardRef<HTMLElement, JobCardV14Props>(function JobCardV14(
  {
    title,
    owner,
    hiringManagers,
    status = 'published',
    candidates,
    onCandidatesClick,
    advertisements = [],
    showAdditionalAdvertisementsLink = false,
    onAdditionalAdvertisementsClick,
    showAdvertisementTitle = false,
    note,
    onExpandNote,
    actions,
    onCreateAdvertisement,
    onEditJob,
    onDuplicateJob,
    onInviteColleagues,
    onTransferJob,
    onArchiveJob,
    onEditAdvertisement,
    onExtendAndRepublish,
    onEndPublication,
    onHighlightAdvertisement,
    onTopAdvertisement,
    onAdvertisementDetailClick,
    advertisementActionLayout = 'column',
    showProlong,
    now,
    className,
    ...rest
  },
  ref,
) {
  const menuSections = buildJobCardMenuSections({
    advertisements,
    actions,
    onEditJob,
    onDuplicateJob,
    onInviteColleagues,
    onTransferJob,
    onArchiveJob,
    onEditAdvertisement,
    onExtendAndRepublish,
    onEndPublication,
    onHighlightAdvertisement,
    onTopAdvertisement,
    onCreateAdvertisement,
  })

  const showAdvertisements = status === 'published' || status === 'unpublished'
  const shownAdvertisements =
    status === 'unpublished' ? advertisements.map(asEndedAdvertisement) : advertisements
  const collapseToFirstAd = showAdditionalAdvertisementsLink && shownAdvertisements.length > 1
  const visibleAdvertisements = collapseToFirstAd
    ? shownAdvertisements.slice(0, 1)
    : shownAdvertisements
  const additionalAdvertisementsCount = shownAdvertisements.length - 1
  const hasNote = Boolean(note?.text.trim())

  return (
    <Card
      as="article"
      ref={ref}
      data-testid="job-card"
      data-variant="v14"
      className={cn('tm-flex', 'tm-flex-col', 'tm-gap-2', '!tm-p-0', className)}
      {...rest}
    >
      <div
        data-testid="job-card-layout-row"
        className={cn(
          'tm-flex tm-w-full tm-items-start tm-gap-2 tm-px-4 tm-pt-6',
          !showAdvertisements && 'tm-pb-4',
        )}
      >
        {menuSections.length ? (
          <JobCardActions
            sections={menuSections}
            label="Akce nad náborem a inzerátem"
            testId="job-card-actions-toggle"
            className="tm-shrink-0 tm-self-start"
          />
        ) : null}
        <div
          data-testid="job-card-main"
          className="tm-flex tm-min-w-0 tm-flex-1 tm-flex-col tm-gap-2"
        >
          <div
            data-testid="job-card-header-row"
            className="tm-flex tm-w-full tm-items-start tm-gap-3"
          >
            <div
              data-testid="job-card-title-row"
              className="tm-flex tm-min-w-0 tm-flex-1 tm-items-center tm-gap-12"
            >
              <div
                data-testid="job-card-title-heading-row"
                className="tm-flex tm-min-w-0 tm-flex-1 tm-flex-col tm-gap-0.5"
              >
                <h3
                  data-testid="job-card-title"
                  className="tm-mb-0 tm-min-w-0 tm-text-lg tm-font-medium tm-leading-tight tm-text-teamio-blue"
                >
                  {title}
                </h3>
                <div className="tm-min-w-0">
                  <JobAssignee
                    owner={owner}
                    hiringManagers={hiringManagers}
                    onInviteMore={onInviteColleagues}
                  />
                </div>
              </div>
              {candidates ? (
                <div data-testid="job-card-pipeline" className="tm-ml-auto tm-shrink-0">
                  <JobPipeline candidates={candidates} onStatClick={onCandidatesClick} />
                </div>
              ) : null}
            </div>
          </div>

          {note ? <JobNote note={note} onExpand={onExpandNote} className="tm-w-full" /> : null}
        </div>
      </div>

      {showAdvertisements ? (
        <div data-testid="job-card-advertisements" className="tm-flex tm-w-full tm-flex-col">
          {shownAdvertisements.length === 0 ? (
            <div
              className={cn(
                'tm-border-0 tm-border-solid tm-border-secondary tm-px-4 tm-py-5',
                !hasNote && 'tm-border-t',
              )}
            >
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
            </div>
          ) : (
            <>
              {visibleAdvertisements.map((advertisement, index) => (
                <AdvertisementWidget
                  key={`${advertisement.id}-${status}`}
                  advertisement={advertisement}
                  showTitle={showAdvertisementTitle}
                  now={now}
                  onProlong={onExtendAndRepublish}
                  onAdvertisementDetailClick={onAdvertisementDetailClick}
                  actionLayout={advertisementActionLayout}
                  showProlong={showProlong}
                  hideTopBorder={hasNote && index === 0}
                  className="tm-pl-14 tm-pr-6"
                />
              ))}
              {collapseToFirstAd ? (
                <Link
                  className="tm-px-4 tm-pb-3 tm-text-sm"
                  data-testid="job-card-additional-advertisements"
                  onClick={onAdditionalAdvertisementsClick}
                >
                  {`Zobrazit další inzeráty (${additionalAdvertisementsCount})`}
                </Link>
              ) : null}
            </>
          )}
        </div>
      ) : null}
    </Card>
  )
})

JobCardV14.displayName = 'JobCardV14'
