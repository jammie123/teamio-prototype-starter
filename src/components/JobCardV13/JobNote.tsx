import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'
import { Icon } from '../Icon'
import { getInitials } from './lib/format'
import type { JobCardNote } from './types'

export interface JobNoteProps extends StyleProps {
  note: JobCardNote
  /** Makes the whole note a button (e.g. to open the full note). */
  onExpand?: () => void
}

function formatNoteMeta(note: JobCardNote) {
  const initials = note.author.trim() ? getInitials(note.author) : ''
  const date = note.showDate === false ? '' : note.addedAt.trim()
  return [initials, date].filter(Boolean).join(' · ')
}

/** Recruitment note: icon, single-line text and "initials · date". Empty text renders nothing. */
export function JobNote({ note, onExpand, className }: JobNoteProps) {
  const text = note.text.trim()

  if (!text) {
    return null
  }

  const meta = formatNoteMeta(note)
  const noteClassName = cn(
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
        {text}
      </p>
      {meta ? (
        <span
          data-testid="note-added-at"
          className="tm-shrink-0 tm-text-sm tm-text-secondary-default"
        >
          {meta}
        </span>
      ) : null}
    </>
  )

  if (!onExpand) {
    return (
      <div data-testid="job-card-note" className={noteClassName}>
        {content}
      </div>
    )
  }

  return (
    <button
      type="button"
      data-testid="job-card-note"
      onClick={onExpand}
      className={cn(noteClassName, 'tm-cursor-pointer')}
    >
      {content}
    </button>
  )
}

JobNote.displayName = 'JobNote'
