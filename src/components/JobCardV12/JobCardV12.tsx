import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'
import { Card } from '../Card'
import { Link } from '../Link'
import { JobCardActions } from '../JobCard/JobCardActions'
import { buildJobCardMenuSections, type JobCardMenuHandlers } from '../JobCard/jobCardMenu'
import { getInitials } from '../JobCardSynteza/getInitials'
import { buildJobCardPeople, JobCardPeople } from '../JobCardSynteza/JobCardPeople'
import { Icon } from '../Icon'
import { JobCardAdvertisementV9 } from '../JobCardV9/JobCardAdvertisementV9'
import { JobCardStatsV7 } from '../JobCardV7/JobCardStatsV7'
import type {
  JobAdvertisement,
  JobCandidateStat,
  JobCardAction,
  JobCardCandidates,
  JobCardNote,
  JobStatus,
} from './types'

export interface JobCardV12Props
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
  now?: Date
}

const ADVERTISEMENT_BLEED_CLASS = '-tm-mx-4 -tm-mb-4'
const ADVERTISEMENT_RULE_CLASS =
  'tm-border-0 tm-border-t tm-border-solid tm-border-secondary tm-px-4 tm-py-3'

function formatNoteMeta(note: JobCardNote) {
  const initials = note.author.trim() ? getInitials(note.author) : ''
  const date = note.showDate === false ? '' : note.addedAt.trim()
  return [initials, date].filter(Boolean).join(' · ')
}

function JobCardNoteBar({
  note,
  onExpand,
  className,
}: {
  note: JobCardNote
  onExpand?: () => void
  className?: string
}) {
  const meta = formatNoteMeta(note)
  const barClassName = cn(
    'tm-flex tm-min-w-0 tm-items-center tm-gap-2 tm-rounded tm-border-0 tm-bg-emotion-warning-background tm-px-3 tm-py-2 tm-text-left tm-font-inherit',
    className,
  )
  const content = (
    <>
      <Icon name="message-square" className="tm-shrink-0 tm-text-base tm-text-secondary-default" />
      <p
        data-testid="note-text"
        className="tm-mb-0 tm-min-w-0 tm-flex-1 tm-truncate tm-text-sm tm-text-primary-default"
      >
        {note.text.trim()}
      </p>
      {meta ? (
        <span data-testid="note-added-at" className="tm-shrink-0 tm-text-sm tm-text-secondary-default">
          {meta}
        </span>
      ) : null}
    </>
  )

  if (!onExpand) {
    return (
      <div data-testid="job-card-note" className={barClassName}>
        {content}
      </div>
    )
  }

  return (
    <button
      type="button"
      data-testid="job-card-note"
      onClick={onExpand}
      className={cn(barClassName, 'tm-cursor-pointer')}
    >
      {content}
    </button>
  )
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

export const JobCardV12 = forwardRef<HTMLElement, JobCardV12Props>(function JobCardV12(
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
  const visibleNote = note && note.text.trim() ? note : undefined

  return (
    <Card
      as="article"
      ref={ref}
      data-testid="job-card"
      data-variant="v12"
      className={cn('tm-flex', 'tm-flex-col', 'tm-gap-4', className)}
      {...rest}
    >
      <div
        data-testid="job-card-header-row"
        className="tm-flex tm-w-full tm-flex-wrap tm-items-start tm-gap-3"
      >
        <div
          data-testid="job-card-title-row"
          className="tm-flex tm-min-w-[12rem] tm-flex-1 tm-flex-col tm-gap-1"
        >
          <div
            data-testid="job-card-title-heading-row"
            className="tm-flex tm-min-w-0 tm-items-center tm-gap-2"
          >
            {menuSections.length ? (
              <JobCardActions
                sections={menuSections}
                label="Akce nad náborem a inzerátem"
                testId="job-card-actions-toggle"
                className="tm-shrink-0 tm-self-center"
              />
            ) : null}
            <h3
              data-testid="job-card-title"
              className="tm-mb-0 tm-min-w-0 tm-flex-1 tm-text-lg tm-font-normal tm-leading-tight tm-text-teamio-blue"
            >
              {title}
            </h3>
          </div>
          {people.length ? (
            <div
              className={cn(
                'tm-min-w-0',
                menuSections.length ? 'tm-pl-10' : undefined,
              )}
            >
              <JobCardPeople people={people} onInviteMore={onInviteColleagues} />
            </div>
          ) : null}
        </div>

        {candidates ? (
          <div data-testid="job-card-pipeline" className="tm-ml-auto tm-shrink-0">
            <JobCardStatsV7
              candidates={candidates}
              onStatClick={onCandidatesClick}
              statItemClassName="tm-w-36"
            />
          </div>
        ) : null}
      </div>

      {visibleNote ? (
        <JobCardNoteBar note={visibleNote} onExpand={onExpandNote} className="tm-w-full" />
      ) : null}

      {showAdvertisements ? (
        <div
          data-testid="job-card-advertisements"
          className={cn(ADVERTISEMENT_BLEED_CLASS, 'tm-flex', 'tm-flex-col')}
        >
          {shownAdvertisements.length === 0 ? (
            <div className={cn(ADVERTISEMENT_RULE_CLASS)}>
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
              {visibleAdvertisements.map((advertisement) => (
                <JobCardAdvertisementV9
                  key={`${advertisement.id}-${status}`}
                  advertisement={advertisement}
                  showTitle={showAdvertisementTitle}
                  now={now}
                  onProlong={onExtendAndRepublish}
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

JobCardV12.displayName = 'JobCardV12'
