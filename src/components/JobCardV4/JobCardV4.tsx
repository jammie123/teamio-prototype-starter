import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'
import { Card } from '../Card'
import { Icon } from '../Icon'
import { Link } from '../Link'
import { Typography } from '../Typography'
import { JobCardActions } from '../JobCard/JobCardActions'
import { buildJobCardMenuSections, type JobCardMenuHandlers } from '../JobCard/jobCardMenu'
import { buildJobCardPeople, JobCardPeople } from '../JobCardSynteza/JobCardPeople'
import { JobCardAdvertisementV4 } from './JobCardAdvertisementV4'
import { JobCardStatsV2 } from '../JobCardV2/JobCardStatsV2'
import type {
  JobAdvertisement,
  JobCandidateStat,
  JobCardAction,
  JobCardCandidates,
  JobStatus,
} from './types'

export interface JobCardV4Props
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
  /** Poznámka k náboru, zobrazená pod inzercí. */
  note?: string
  actions?: JobCardAction[]
  now?: Date
}

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

function RecruitmentNote({ text }: { text: string }) {
  return (
    <p
      data-testid="job-card-recruitment-note"
      className="tm-m-0 tm-flex tm-items-start tm-gap-2 tm-text-sm tm-leading-5 tm-text-secondary-default"
    >
      <Icon name="message-square" size={16} className="tm-mt-0.5 tm-shrink-0" />
      <span>{text}</span>
    </p>
  )
}

export const JobCardV4 = forwardRef<HTMLElement, JobCardV4Props>(function JobCardV4(
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
  const people = buildJobCardPeople(owner, hiringManagers)

  const showAdvertisements = status === 'published' || status === 'unpublished'
  const shownAdvertisements =
    status === 'unpublished' ? advertisements.map(asEndedAdvertisement) : advertisements
  const additionalAdvertisementsCount = shownAdvertisements.length - 1
  const collapseToFirstAd = showAdditionalAdvertisementsLink && shownAdvertisements.length > 1
  const visibleAdvertisements = collapseToFirstAd
    ? shownAdvertisements.slice(0, 1)
    : shownAdvertisements
  const recruitmentNote = note?.trim()

  return (
    <Card
      as="article"
      ref={ref}
      data-testid="job-card"
      data-variant="v4"
      className={cn('tm-flex', 'tm-flex-col', 'tm-gap-4', className)}
      {...rest}
    >
      <div className="tm-flex tm-flex-wrap tm-items-start tm-justify-between tm-gap-3">
        <div className="tm-min-w-[12rem] tm-flex-1">
          <Typography variant="h3" className="tm-mb-0 tm-text-teamio-blue">
            {title}
          </Typography>
        </div>

        {people.length || menuSections.length ? (
          <div className="tm-flex tm-flex-none tm-items-center tm-gap-2">
            {people.length ? (
              <JobCardPeople people={people} onInviteMore={onInviteColleagues} />
            ) : null}
            {menuSections.length ? (
              <JobCardActions
                sections={menuSections}
                label="Akce nad náborem a inzerátem"
                testId="job-card-actions-toggle"
              />
            ) : null}
          </div>
        ) : null}
      </div>

      {candidates ? (
        <JobCardStatsV2 candidates={candidates} onStatClick={onCandidatesClick} />
      ) : null}

      {showAdvertisements || recruitmentNote ? (
        <div className="tm-flex tm-flex-col tm-gap-3">
          {showAdvertisements ? (
            <div data-testid="job-card-advertisements">
              {shownAdvertisements.length === 0 ? (
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
                  {visibleAdvertisements.map((advertisement) => (
                    <JobCardAdvertisementV4
                      key={`${advertisement.id}-${status}`}
                      advertisement={advertisement}
                      showTitle={showAdvertisementTitle}
                      now={now}
                      onProlong={onExtendAndRepublish}
                    />
                  ))}
                  {collapseToFirstAd ? (
                    <Link
                      className="tm-text-sm"
                      data-testid="job-card-additional-advertisements"
                      onClick={onAdditionalAdvertisementsClick}
                    >
                      {`Zobrazit další inzeráty (${additionalAdvertisementsCount})`}
                    </Link>
                  ) : null}
                </div>
              )}
            </div>
          ) : null}
          {recruitmentNote ? <RecruitmentNote text={recruitmentNote} /> : null}
        </div>
      ) : null}
    </Card>
  )
})

JobCardV4.displayName = 'JobCardV4'
