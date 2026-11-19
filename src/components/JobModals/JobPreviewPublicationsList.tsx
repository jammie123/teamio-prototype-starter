import { useRef, type KeyboardEvent } from 'react'
import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'
import { JobPortalLogo, jobPortalLogoTypeFromChannel } from '../JobPortalLogo'
import { JOB_PREVIEW_COPY } from './jobPreviewCopy'
import type { JobPreviewPublication } from './types'

export interface JobPreviewPublicationsListProps extends StyleProps {
  publications: JobPreviewPublication[]
  /** Id of the active publication. Exactly one item is always active. */
  activeId: string
  onSelect: (id: string) => void
}

export function JobPreviewPublicationsList({
  publications,
  activeId,
  onSelect,
  className,
}: JobPreviewPublicationsListProps) {
  const groupRef = useRef<HTMLDivElement>(null)

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') {
      return
    }
    const buttons = Array.from(groupRef.current?.querySelectorAll<HTMLButtonElement>('button') ?? [])
    const index = buttons.findIndex((button) => button === document.activeElement)
    if (index === -1) {
      return
    }
    event.preventDefault()
    const step = event.key === 'ArrowRight' ? 1 : -1
    buttons[(index + step + buttons.length) % buttons.length]?.focus()
  }

  return (
    <div
      ref={groupRef}
      role="group"
      aria-label={JOB_PREVIEW_COPY.publicationsAriaLabel}
      data-testid="job-preview-publications-list"
      onKeyDown={handleKeyDown}
      className={cn('tm-flex', 'tm-items-center', 'tm-gap-2', className)}
    >
      {publications.map((publication) => {
        const isActive = publication.id === activeId
        return (
          <button
            key={publication.id}
            type="button"
            title={publication.name}
            aria-label={publication.name}
            aria-pressed={isActive}
            onClick={() => onSelect(publication.id)}
            className={cn(
              'tm-inline-flex',
              'tm-size-12',
              'tm-shrink-0',
              'tm-cursor-pointer',
              'tm-items-center',
              'tm-justify-center',
              'tm-rounded-full',
              'tm-border-2',
              'tm-p-0',
              'focus-visible:tm-ring',
              'focus-visible:tm-outline-0',
              isActive
                ? 'tm-border-active tm-bg-interactive-active'
                : 'tm-border-transparent tm-bg-cover-default hover:tm-bg-interactive-hover',
            )}
          >
            <JobPortalLogo
              type={publication.logoType ?? jobPortalLogoTypeFromChannel(publication.name)}
              title=""
              className="tm-size-8"
            />
          </button>
        )
      })}
    </div>
  )
}

JobPreviewPublicationsList.displayName = 'JobPreviewPublicationsList'
