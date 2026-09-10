import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'
import { Button } from '../Button'
import { Icon } from '../Icon'
import { Typography } from '../Typography'

export interface NoteProps
  extends StyleProps, Omit<HTMLAttributes<HTMLElement>, 'color'> {
  /** Available after expand; not shown in the compact preview. */
  author?: string
  text: string
  addedAt?: string
  /** When false, hides the date even if `addedAt` is set. Default true. */
  showDate?: boolean
  onExpand?: () => void
  expandLabel?: string
}

export const Note = forwardRef<HTMLElement, NoteProps>(function Note(
  {
    author: _author,
    text,
    addedAt,
    showDate = true,
    onExpand,
    expandLabel = 'Zobrazit celou poznámku',
    className,
    ...rest
  },
  ref,
) {
  return (
    <article
      ref={ref}
      data-testid="note"
      className={cn(
        'tm-group',
        'tm-relative',
        'tm-flex',
        'tm-items-end',
        'tm-gap-2',
        'tm-rounded',
        'tm-bg-cover-light',
        'tm-px-3',
        'tm-py-2',
        className,
      )}
      {...rest}
    >
      <Typography
        as="p"
        variant="body"
        data-testid="note-text"
        className="tm-mb-0 tm-min-w-0 tm-flex-1 tm-line-clamp-2 tm-text-sm tm-text-primary-default"
      >
        {text}
      </Typography>
      {showDate && addedAt ? (
        <Typography
          as="span"
          variant="caption"
          data-testid="note-added-at"
          className="tm-ml-auto tm-shrink-0 tm-self-end tm-text-right tm-text-sm tm-text-secondary-default"
        >
          {addedAt}
        </Typography>
      ) : null}
      <span
        aria-hidden
        data-testid="note-expand-overlay"
        className="tm-pointer-events-none tm-absolute tm-inset-y-0 tm-right-0 tm-hidden tm-w-16 tm-rounded-r tm-bg-note-expand-overlay group-hover:tm-block group-focus-within:tm-block"
      />
      <Button
        variant="tertiary"
        isCircle
        aria-label={expandLabel}
        onClick={onExpand}
        className="tm-absolute tm-right-1 tm-top-1 tm-z-10 tm-hidden group-hover:tm-inline-flex group-focus-within:tm-inline-flex"
      >
        <Icon name="maximize" className="tm-text-lg" />
      </Button>
    </article>
  )
})

Note.displayName = 'Note'
