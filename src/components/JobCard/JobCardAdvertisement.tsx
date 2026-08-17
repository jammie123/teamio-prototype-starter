import { useId, useState } from 'react'
import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'
import { Icon } from '../Icon'
import { Link } from '../Link'
import { formatCount } from './formatCount'
import { JobCardActions } from './JobCardActions'
import type { JobAdvertisement, JobPublication } from './types'

export interface JobCardAdvertisementProps extends StyleProps {
  advertisement: JobAdvertisement
  publicationLimit: number | 'all'
  defaultOpen?: boolean
}

function isExpired(publication: JobPublication) {
  return publication.status === 'expired'
}

function showMoreLabel(count: number) {
  if (count === 1) {
    return `Zobrazit další ${count} portál`
  }

  if (count < 5) {
    return `Zobrazit další ${count} portály`
  }

  return `Zobrazit dalších ${count} portálů`
}

function PublicationRow({ publication }: { publication: JobPublication }) {
  return (
    <li
      data-testid="job-card-publication"
      className={cn(
        'tm-flex',
        'tm-flex-wrap',
        'tm-items-center',
        'tm-gap-x-4',
        'tm-gap-y-1',
        'tm-py-1.5',
        'tm-text-sm',
        'tm-font-normal',
        'tm-text-primary-default',
      )}
    >
      <span className="tm-min-w-[8rem] tm-flex-1">{publication.channel}</span>
      <span className="tm-min-w-[6rem]">
        {isExpired(publication) ? 'Ukončeno' : 'Aktivní'}
      </span>
      <span className="tm-min-w-[8rem] tm-flex-1">
        {publication.startDate} – {publication.endDate ?? 'dosud'}
      </span>
      {publication.viewCount === undefined ? null : (
        <span className="tm-min-w-[8rem] tm-text-right">
          Zhlédnuto: {formatCount(publication.viewCount)}
        </span>
      )}
    </li>
  )
}

export function JobCardAdvertisement({
  advertisement,
  publicationLimit,
  defaultOpen = true,
  className,
}: JobCardAdvertisementProps) {
  const contentId = useId()
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const [showAll, setShowAll] = useState(false)

  const publications = advertisement.publications ?? []
  const limit = publicationLimit === 'all' ? publications.length : publicationLimit
  const visiblePublications = showAll ? publications : publications.slice(0, limit)
  const hiddenCount = publications.length - visiblePublications.length

  return (
    <div data-testid="job-card-advertisement" className={cn('tm-flex', 'tm-flex-col', className)}>
      <div className="tm-flex tm-items-center tm-gap-2">
        <button
          type="button"
          onClick={() => setIsOpen((value) => !value)}
          aria-expanded={isOpen}
          aria-controls={contentId}
          className={cn(
            'tm-inline-flex',
            'tm-items-center',
            'tm-gap-2',
            'tm-border-0',
            'tm-bg-transparent',
            'tm-p-0',
            'tm-font-inherit',
            'tm-cursor-pointer',
            'tm-text-secondary-default',
            'focus-visible:tm-rounded-sm',
            'focus-visible:tm-outline-0',
            'focus-visible:tm-ring',
          )}
        >
          <Icon
            name="chevron-down"
            className={cn('tm-text-base', !isOpen && '-tm-rotate-90')}
          />
          <span className="tm-text-xs tm-font-semibold tm-uppercase tm-tracking-wide">
            {advertisement.title ?? 'Aktuální inzerát'}
          </span>
        </button>
        {advertisement.actions?.length ? (
          <JobCardActions
            actions={advertisement.actions}
            label="Další akce inzerátu"
            testId="job-card-advertisement-actions-toggle"
            className="tm-ml-auto"
          />
        ) : null}
      </div>

      <div id={contentId} hidden={!isOpen} className="tm-pl-6 tm-pt-1">
        {publications.length === 0 ? (
          <p className="tm-mb-0 tm-text-sm tm-text-secondary-default">
            Inzerát není nikde vystavený.
          </p>
        ) : (
          <>
            <ul className="tm-m-0 tm-list-none tm-p-0">
              {visiblePublications.map((publication) => (
                <PublicationRow key={publication.id} publication={publication} />
              ))}
            </ul>
            {hiddenCount > 0 ? (
              <Link className="tm-text-sm" onClick={() => setShowAll(true)}>
                {showMoreLabel(hiddenCount)}
              </Link>
            ) : null}
            {showAll && publications.length > limit ? (
              <Link className="tm-text-sm" onClick={() => setShowAll(false)}>
                Zobrazit méně
              </Link>
            ) : null}
          </>
        )}
      </div>
    </div>
  )
}

JobCardAdvertisement.displayName = 'JobCardAdvertisement'
