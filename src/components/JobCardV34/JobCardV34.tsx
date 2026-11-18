import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'
import { Card } from '../Card'
import { Link } from '../Link'
import { AdvertisementWidget } from './AdvertisementWidget'
import { JobAssignee } from './JobAssignee'
import { JobCardActions } from './JobCardActions'
import { DraftWidget } from './DraftWidget'
import { buildJobCardMenuSections, type JobCardMenuHandlers } from './jobCardMenu'
import { buildAdvertisementModel } from './lib/advertisementModel'
import { JobNote } from './JobNote'
import { JobPipeline } from './JobPipeline'
import type {
  JobAdvertisement,
  JobCandidateStat,
  JobCardCandidates,
  JobCardNote,
  JobStatus,
} from './types'

export interface JobCardV34Props
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
  /** Collapses multiple advertisements behind a "Zobrazit další inzeráty" link. */
  onAdditionalAdvertisementsClick?: () => void
  /** Poznámka k náboru, pod hlavičkou s titulkem a pipeline. */
  note?: JobCardNote
  onExpandNote?: () => void
  /** Reference date for "Brzy končí"; defaults to today. */
  now?: Date
  onViewStatisticsClick?: () => void
  onAdvertisementDetailClick?: () => void
  onAdvertisementPreviewClick?: () => void
  /** Pre-formatted Czech date shown on a draft (`3. 11. 2026`). */
  lastChanged?: string
  /** Pokračovat button of a draft job. */
  onContinueDraft?: () => void
}

/** Job without any advertisement renders as a not yet published one. */
const NOT_PUBLISHED_ADVERTISEMENT: JobAdvertisement = { id: 'not-published', publications: [] }

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

export const JobCardV34 = forwardRef<HTMLElement, JobCardV34Props>(function JobCardV34(
  {
    title,
    owner,
    hiringManagers,
    status = 'published',
    candidates,
    onCandidatesClick,
    advertisements = [],
    onAdditionalAdvertisementsClick,
    note,
    onExpandNote,
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
    onViewStatisticsClick,
    onAdvertisementDetailClick,
    onAdvertisementPreviewClick,
    lastChanged,
    onContinueDraft,
    now,
    className,
    ...rest
  },
  ref,
) {
  const showAdvertisements = status === 'published' || status === 'unpublished'
  const isDraft = status === 'draft'
  const menuSections = buildJobCardMenuSections({
    onEditJob,
    onDuplicateJob,
    onInviteColleagues,
    onTransferJob,
    onArchiveJob,
    ...(showAdvertisements
      ? {
          advertisements,
          onEditAdvertisement,
          onExtendAndRepublish,
          onEndPublication,
          onHighlightAdvertisement,
          onTopAdvertisement,
          onCreateAdvertisement,
        }
      : {}),
  })
  const shownAdvertisements =
    status === 'unpublished' ? advertisements.map(asEndedAdvertisement) : advertisements
  const collapseToFirstAd = Boolean(onAdditionalAdvertisementsClick) && shownAdvertisements.length > 1
  const visibleAdvertisements = collapseToFirstAd
    ? shownAdvertisements.slice(0, 1)
    : shownAdvertisements
  const additionalAdvertisementsCount = shownAdvertisements.length - 1
  const hasNote = Boolean(note?.text.trim())
  const firstAdvertisementKind = shownAdvertisements[0]
    ? buildAdvertisementModel(shownAdvertisements[0], now).kind
    : undefined
  const isInactiveCard = status === 'unpublished' || firstAdvertisementKind === 'ended'

  return (
    <Card
      as="article"
      ref={ref}
      data-testid="job-card"
      data-variant="v34"
      className={cn(
        'tm-pt-4 md:tm-pt-6',
        showAdvertisements && 'tm-pb-0',
        isInactiveCard && ['!tm-bg-cover-default', '!tm-border-primary', '!tm-shadow-none'],
        className,
      )}
      {...rest}
    >
      <div
        data-testid="job-card-layout-row"
        className="tm-flex tm-w-full tm-min-w-0 tm-flex-col tm-items-stretch tm-gap-2 md:tm-flex-row md:tm-items-start"
      >
        {menuSections.length ? (
          <JobCardActions
            sections={menuSections}
            label="Akce nad náborem a inzerátem"
            testId="job-card-actions-toggle"
            className="tm-shrink-0 tm-self-end md:tm-self-start"
          />
        ) : null}
        <div
          data-testid="job-card-main"
          className="tm-flex tm-w-full tm-min-w-0 tm-max-w-full tm-flex-col tm-gap-2 md:tm-flex-1"
        >
          <div
            data-testid="job-card-header-row"
            className="tm-flex tm-w-full tm-min-w-0 tm-flex-col tm-items-stretch tm-gap-2 md:tm-flex-row md:tm-items-center md:tm-gap-12"
          >
            <div
              data-testid="job-card-title-heading-row"
              className="tm-flex tm-min-w-0 tm-flex-1 tm-flex-col tm-gap-0.5"
            >
              <h3
                data-testid="job-card-title"
                className="tm-mb-0 tm-min-w-0 tm-text-lg tm-font-normal tm-leading-tight tm-text-teamio-blue"
              >
                {title}
              </h3>
              <JobAssignee
                owner={owner}
                hiringManagers={hiringManagers}
                onInviteMore={onInviteColleagues}
                className="tm-min-w-0"
              />
            </div>
            {isDraft ? (
              <DraftWidget
                lastChanged={lastChanged}
                onContinue={onContinueDraft}
                className="tm-w-full tm-justify-between md:tm-ml-auto md:tm-w-auto md:tm-shrink-0"
              />
            ) : candidates ? (
              <div
                data-testid="job-card-pipeline"
                className="tm-w-full md:tm-ml-auto md:tm-w-auto md:tm-shrink-0"
              >
                <JobPipeline candidates={candidates} onStatClick={onCandidatesClick} />
              </div>
            ) : null}
          </div>

          {note ? <JobNote note={note} onExpand={onExpandNote} className="tm-w-full" /> : null}

          {showAdvertisements ? (
            <div data-testid="job-card-advertisements" className="tm-flex tm-flex-col">
              {shownAdvertisements.length === 0 ? (
                <AdvertisementWidget
                  advertisement={NOT_PUBLISHED_ADVERTISEMENT}
                  now={now}
                  onCreateAdvertisement={onCreateAdvertisement}
                  hideTopBorder={hasNote}
                />
              ) : (
                <>
                  {visibleAdvertisements.map((advertisement, index) => (
                    <AdvertisementWidget
                      key={`${advertisement.id}-${status}`}
                      advertisement={advertisement}
                      now={now}
                      onProlong={onExtendAndRepublish}
                      onCreateAdvertisement={onCreateAdvertisement}
                      onViewStatisticsClick={onViewStatisticsClick}
                      onAdvertisementDetailClick={onAdvertisementDetailClick}
                      onAdvertisementPreviewClick={onAdvertisementPreviewClick}
                      onHighlightAdvertisement={onHighlightAdvertisement}
                      actionLayout="column"
                      hideTopBorder={hasNote && index === 0}
                    />
                  ))}
                  {collapseToFirstAd ? (
                    <Link
                      className="tm-pb-3 tm-text-sm"
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
        </div>
      </div>
    </Card>
  )
})

JobCardV34.displayName = 'JobCardV34'
