import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'
import { Card } from '../Card'
import { Link } from '../Link'
import { Typography } from '../Typography'
import { JobCardActions } from '../JobCard/JobCardActions'
import { buildJobCardMenuSections, type JobCardMenuHandlers } from '../JobCard/jobCardMenu'
import { getInitials } from '../JobCardSynteza/getInitials'
import { buildJobCardPeople, JobCardPeople } from '../JobCardSynteza/JobCardPeople'
import { Icon } from '../Icon'
import { JobCardAdvertisementV7 } from './JobCardAdvertisementV7'
import { JobCardStatsV7 } from './JobCardStatsV7'
import type {
  JobAdvertisement,
  JobCandidateStat,
  JobCardAction,
  JobCardCandidates,
  JobCardNote,
  JobStatus,
} from './types'

export interface JobCardV7Props
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
  /** Poznámka k náboru, vpravo vedle pipeline. */
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

export const JobCardV7 = forwardRef<HTMLElement, JobCardV7Props>(function JobCardV7(
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
      data-variant="v7"
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

      {candidates || visibleNote ? (
        <div
          data-testid="job-card-pipeline-row"
          className="tm-flex tm-w-full tm-flex-row tm-items-center tm-gap-6"
        >
          {candidates ? (
            <JobCardStatsV7 candidates={candidates} onStatClick={onCandidatesClick} />
          ) : null}
          {visibleNote ? (
            <JobCardNoteBar
              note={visibleNote}
              onExpand={onExpandNote}
              className={
                candidates ? 'tm-ml-auto tm-min-w-0 tm-max-w-[50%] tm-flex-1' : 'tm-w-full'
              }
            />
          ) : null}
        </div>
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
                <JobCardAdvertisementV7
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

JobCardV7.displayName = 'JobCardV7'
