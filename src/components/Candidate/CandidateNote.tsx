import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'
import { Button } from '../Button'
import { Icon } from '../Icon'
import { Note } from '../Note'
import { CANDIDATE_COPY } from './candidateCopy'
import type { CandidateNoteData } from './types'

export interface CandidateNoteProps extends StyleProps {
  note?: CandidateNoteData
  onAdd?: () => void
  onExpand?: () => void
}

export function CandidateNote({ note, onAdd, onExpand, className }: CandidateNoteProps) {
  if (!note) {
    return (
      <div data-testid="candidate-note-empty" className={cn('tm-flex', className)}>
        <Button variant="tertiary" size="small" onClick={onAdd}>
          <Icon name="plus" className="tm-text-base" />
          {CANDIDATE_COPY.addNote}
        </Button>
      </div>
    )
  }

  return (
    <Note
      author={note.author}
      text={note.text}
      addedAt={note.addedAt}
      onExpand={onExpand}
      expandLabel={CANDIDATE_COPY.expandNote}
      className={cn('tm-w-full', className)}
    />
  )
}

CandidateNote.displayName = 'CandidateNote'
