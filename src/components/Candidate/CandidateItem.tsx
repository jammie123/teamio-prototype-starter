import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'
import { Button } from '../Button'
import { Icon } from '../Icon'
import { TableCell, TableRow } from '../Table'
import {
  candidateCellPaddingClass,
  candidateEmptyTextClass,
  candidateMetaTextClass,
  candidateNameColumnClass,
  candidateNoteColumnClass,
  candidateValueTextClass,
} from './candidateCellClass'
import { CANDIDATE_COPY, CANDIDATE_DEFAULT_STATUSES } from './candidateCopy'
import { CandidateNote } from './CandidateNote'
import { CandidateStatus } from './CandidateStatus'
import { CandidateTags } from './CandidateTags'
import type { CandidateItemData, CandidateStatusOption, CandidateTagData } from './types'

export interface CandidateItemProps
  extends StyleProps,
    Omit<HTMLAttributes<HTMLTableRowElement>, 'color' | 'children'> {
  candidate: CandidateItemData
  statusOptions?: CandidateStatusOption[]
  onNameClick?: (candidate: CandidateItemData) => void
  onAttachmentsClick?: (candidate: CandidateItemData) => void
  onStatusChange?: (candidate: CandidateItemData, statusId: string) => void
  onTagAdd?: (candidate: CandidateItemData) => void
  onTagRemove?: (candidate: CandidateItemData, tag: CandidateTagData) => void
  onNoteAdd?: (candidate: CandidateItemData) => void
  onNoteExpand?: (candidate: CandidateItemData) => void
}

const STAR_COUNT = 5

// Cells are opaque so the sticky columns do not show content scrolling underneath;
// the named group keeps the hover colour in sync across the whole row without
// triggering the `group` hover state inside Note.
const cellClass = cn(
  'tm-bg-basic',
  'tm-align-middle',
  candidateCellPaddingClass,
  'group-hover/row:tm-bg-cover-light',
)

function Stars({ value, count }: { value: number; count?: number }) {
  const filled = Math.max(0, Math.min(STAR_COUNT, Math.round(value)))

  return (
    <span
      role="img"
      aria-label={CANDIDATE_COPY.ratingLabel(filled)}
      data-testid="candidate-rating"
      data-rating={filled}
      className="tm-inline-flex tm-items-center tm-gap-0.5 tm-whitespace-nowrap"
    >
      {Array.from({ length: STAR_COUNT }, (_, index) => (
        <Icon
          key={index}
          name="star"
          data-filled={index < filled ? 'true' : 'false'}
          className={cn(
            'tm-text-base',
            index < filled
              ? 'tm-text-emotion-warning-default [&_svg]:tm-fill-current'
              : 'tm-text-gray-300',
          )}
        />
      ))}
      {count ? (
        <span className="tm-ml-1 tm-text-xs tm-text-action-link-default">({count})</span>
      ) : null}
    </span>
  )
}

export const CandidateItem = forwardRef<HTMLTableRowElement, CandidateItemProps>(
  function CandidateItem(
    {
      candidate,
      statusOptions = CANDIDATE_DEFAULT_STATUSES,
      onNameClick,
      onAttachmentsClick,
      onStatusChange,
      onTagAdd,
      onTagRemove,
      onNoteAdd,
      onNoteExpand,
      className,
      ...rest
    },
    ref,
  ) {
    const { name, phone, rating, attachmentsCount, aiScore, source } = candidate
    const hasAiScore = aiScore !== undefined && aiScore !== null && aiScore !== ''

    return (
      <TableRow
        ref={ref}
        data-testid="candidate-item"
        className={cn('tm-group/row', 'tm-h-16', className)}
        {...rest}
      >
        <TableCell
          data-testid="candidate-cell-name"
          className={cn(cellClass, candidateNameColumnClass, 'tm-z-10')}
        >
          {onNameClick ? (
            <button
              type="button"
              data-testid="candidate-name"
              onClick={() => onNameClick(candidate)}
              className="tm-cursor-pointer tm-border-0 tm-bg-transparent tm-p-0 tm-text-left tm-font-poppins tm-text-base tm-font-semibold tm-text-action-link-default hover:tm-text-action-link-hover focus-visible:tm-ring focus-visible:tm-outline-none"
            >
              {name}
            </button>
          ) : (
            <span
              data-testid="candidate-name"
              className="tm-text-base tm-font-semibold tm-text-action-link-default"
            >
              {name}
            </span>
          )}
          <div
            data-testid="candidate-phone"
            className={cn(
              'tm-mt-0.5',
              'tm-flex',
              'tm-items-center',
              'tm-gap-1',
              'tm-text-sm',
              phone ? 'tm-text-action-link-default' : 'tm-text-light-default',
            )}
          >
            <Icon name="phone" className="tm-text-base" />
            {phone ?? CANDIDATE_COPY.addPhone}
          </div>
        </TableCell>

        <TableCell data-testid="candidate-cell-rating" className={cn(cellClass, 'tm-whitespace-nowrap')}>
          <Stars value={rating?.value ?? 0} count={rating?.count} />
        </TableCell>

        <TableCell data-testid="candidate-cell-attachments" className={cellClass}>
          <Button
            variant="tertiary"
            size="small"
            data-testid="candidate-attachments"
            aria-label={CANDIDATE_COPY.attachmentsLabel(attachmentsCount ?? 0)}
            onClick={() => onAttachmentsClick?.(candidate)}
            className="tm-text-secondary-default"
          >
            <Icon name="paperclip" className="tm-text-base" />
            {attachmentsCount ?? 0}
          </Button>
        </TableCell>

        <TableCell data-testid="candidate-cell-ai" className={cellClass}>
          {hasAiScore ? (
            <span
              data-testid="candidate-ai"
              aria-label={CANDIDATE_COPY.aiLabel(aiScore)}
              className={cn('tm-inline-flex tm-items-center tm-gap-1', candidateValueTextClass)}
            >
              <Icon name="sparkles" className="tm-text-base tm-text-emotion-promotion-default" />
              {aiScore}
            </span>
          ) : (
            <span data-testid="candidate-ai" className={candidateEmptyTextClass}>
              {CANDIDATE_COPY.emptyValue}
            </span>
          )}
        </TableCell>

        <TableCell data-testid="candidate-cell-status" className={cellClass}>
          <CandidateStatus
            value={candidate.statusId}
            options={statusOptions}
            onChange={(statusId) => onStatusChange?.(candidate, statusId)}
          />
        </TableCell>

        <TableCell
          data-testid="candidate-cell-last-contact"
          className={cn(cellClass, 'tm-whitespace-nowrap')}
        >
          {candidate.lastContact ? (
            <span data-testid="candidate-last-contact" className={candidateMetaTextClass}>
              {candidate.lastContact}
            </span>
          ) : (
            <span className={candidateEmptyTextClass}>{CANDIDATE_COPY.notContacted}</span>
          )}
        </TableCell>

        <TableCell data-testid="candidate-cell-source" className={cellClass}>
          {source ? (
            <>
              <div className={candidateValueTextClass}>{source.name}</div>
              {source.date ? (
                <div data-testid="candidate-source-date" className={candidateMetaTextClass}>
                  {source.date}
                </div>
              ) : null}
            </>
          ) : (
            <span className={candidateEmptyTextClass}>{CANDIDATE_COPY.emptyValue}</span>
          )}
        </TableCell>

        <TableCell data-testid="candidate-cell-tags" className={cn(cellClass, 'tm-min-w-[14rem]')}>
          <CandidateTags
            tags={candidate.tags}
            onAdd={onTagAdd ? () => onTagAdd(candidate) : undefined}
            onRemove={onTagRemove ? (tag) => onTagRemove(candidate, tag) : undefined}
          />
        </TableCell>

        <TableCell
          data-testid="candidate-cell-note"
          className={cn(cellClass, candidateNoteColumnClass, 'tm-z-10')}
        >
          <CandidateNote
            note={candidate.note}
            onAdd={() => onNoteAdd?.(candidate)}
            onExpand={() => onNoteExpand?.(candidate)}
          />
        </TableCell>
      </TableRow>
    )
  },
)

CandidateItem.displayName = 'CandidateItem'
