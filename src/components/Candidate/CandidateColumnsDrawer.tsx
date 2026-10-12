import {
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type DragEvent,
  type KeyboardEvent,
} from 'react'
import { cn } from '../../lib/cn'
import { Button } from '../Button'
import { Checkbox } from '../Checkbox'
import {
  Drawer,
  DrawerBody,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerTitle,
} from '../Drawer'
import { Icon } from '../Icon'
import { candidateRevealOnRowHoverClass } from './candidateCellClass'
import { isLockedColumn, moveColumn, normalizeColumns, shiftColumn } from './candidateColumns'
import { CANDIDATE_COPY, CANDIDATE_DEFAULT_COLUMNS } from './candidateCopy'
import type { CandidateColumnId, CandidateColumnState } from './types'

export interface CandidateColumnsDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Current column order and visibility. */
  columns: CandidateColumnState[]
  /** Called with the new configuration when "Uložit" is clicked; the drawer then closes. */
  onApply: (columns: CandidateColumnState[]) => void
}

interface DropTarget {
  id: CandidateColumnId
  position: 'before' | 'after'
}

function dropPosition(event: DragEvent<HTMLElement>): DropTarget['position'] {
  const rect = event.currentTarget.getBoundingClientRect()
  return event.clientY < rect.top + rect.height / 2 ? 'before' : 'after'
}

type MoveControl = 'up' | 'down' | 'handle'

const controlKey = (id: CandidateColumnId, control: MoveControl) => `${id}:${control}`

/**
 * Shared look of the row controls. The arrows also use `candidateRevealOnRowHoverClass`, so they
 * appear (keeping their space) while the row is hovered or focused; a disabled arrow is dimmed.
 */
const moveButtonClass = [
  'tm-inline-flex',
  'tm-h-6',
  'tm-w-6',
  'tm-items-center',
  'tm-justify-center',
  'tm-rounded',
  'tm-border-0',
  'tm-bg-transparent',
  'tm-p-0',
  'tm-text-xl',
  'tm-text-secondary-default',
  'hover:tm-text-primary-default',
  'enabled:tm-cursor-pointer',
  'disabled:tm-cursor-not-allowed',
  'disabled:tm-text-light-default',
  'focus:tm-outline-0',
  'focus-visible:tm-ring',
] as const

interface ColumnsFormProps {
  columns: CandidateColumnState[]
  onApply: (columns: CandidateColumnState[]) => void
}

/**
 * Body and footer of the drawer. They are mounted only while the drawer is open, so the draft
 * always starts from the current `columns` and is dropped on cancel or close.
 */
function CandidateColumnsForm({ columns, onApply }: ColumnsFormProps) {
  const copy = CANDIDATE_COPY.columnsDrawer
  const hintId = useId()
  const [draft, setDraft] = useState(() => normalizeColumns(columns))
  const [dragId, setDragId] = useState<CandidateColumnId | null>(null)
  const [drop, setDrop] = useState<DropTarget | null>(null)
  const [announcement, setAnnouncement] = useState('')
  const controlRefs = useRef(new Map<string, HTMLButtonElement>())
  const focusAfterMove = useRef<{ id: CandidateColumnId; control: MoveControl } | null>(null)
  const movableIds = draft.filter((column) => !isLockedColumn(column.id)).map((column) => column.id)

  // A moved row is re-inserted into the DOM, which drops focus; give it back to the control that
  // was used. An arrow that became disabled (row reached an end) hands focus to the drag handle.
  useLayoutEffect(() => {
    const target = focusAfterMove.current
    if (!target) return
    focusAfterMove.current = null
    const control = controlRefs.current.get(controlKey(target.id, target.control))
    const fallback = controlRefs.current.get(controlKey(target.id, 'handle'))
    if (control && !control.disabled) control.focus()
    else fallback?.focus()
  }, [draft])

  const setVisible = (id: CandidateColumnId, visible: boolean) =>
    setDraft((current) => current.map((column) => (column.id === id ? { ...column, visible } : column)))

  const registerControl = (id: CandidateColumnId, control: MoveControl) =>
    (node: HTMLButtonElement | null) => {
      if (node) controlRefs.current.set(controlKey(id, control), node)
      else controlRefs.current.delete(controlKey(id, control))
    }

  const clearDrag = () => {
    setDragId(null)
    setDrop(null)
  }

  const moveBy = (id: CandidateColumnId, delta: number, control: MoveControl) => {
    const next = shiftColumn(draft, id, delta)
    if (next.every((column, index) => column.id === draft[index].id)) return
    focusAfterMove.current = { id, control }
    setDraft(next)
    setAnnouncement(
      copy.moved(
        CANDIDATE_COPY.columns[id],
        next.findIndex((column) => column.id === id) + 1,
        next.length,
      ),
    )
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, id: CandidateColumnId) => {
    if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return
    event.preventDefault()
    moveBy(id, event.key === 'ArrowUp' ? -1 : 1, 'handle')
  }

  const handleDragOver = (event: DragEvent<HTMLLIElement>, id: CandidateColumnId) => {
    if (!dragId || isLockedColumn(id)) return
    event.preventDefault()
    if (event.dataTransfer) event.dataTransfer.dropEffect = 'move'
    if (id === dragId) {
      setDrop(null)
      return
    }
    const position = dropPosition(event)
    setDrop((current) =>
      current?.id === id && current.position === position ? current : { id, position },
    )
  }

  const handleDrop = (event: DragEvent<HTMLLIElement>, id: CandidateColumnId) => {
    if (!dragId || isLockedColumn(id)) return
    event.preventDefault()
    const next = moveColumn(draft, dragId, id, dropPosition(event))
    setDraft(next)
    setAnnouncement(
      copy.moved(
        CANDIDATE_COPY.columns[dragId],
        next.findIndex((column) => column.id === dragId) + 1,
        next.length,
      ),
    )
    clearDrag()
  }

  return (
    <>
      <DrawerBody className="tm-pb-4 tm-pt-4">
        <span id={hintId} className="tm-sr-only">
          {copy.lockedHint}
        </span>
        <ul
          aria-label={copy.listLabel}
          data-testid="candidate-columns-list"
          className="tm-m-0 tm-flex tm-list-none tm-flex-col tm-gap-1 tm-p-0"
          onDragLeave={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setDrop(null)
          }}
        >
          {draft.map((column) => {
            const locked = isLockedColumn(column.id)
            const label = CANDIDATE_COPY.columns[column.id]
            const dropBefore = drop?.id === column.id && drop.position === 'before'
            const dropAfter = drop?.id === column.id && drop.position === 'after'

            return (
              <li
                key={column.id}
                data-testid={`candidate-column-${column.id}`}
                data-locked={locked || undefined}
                data-dragging={dragId === column.id || undefined}
                draggable={!locked}
                onDragStart={(event) => {
                  if (locked) return
                  event.dataTransfer?.setData('text/plain', column.id)
                  if (event.dataTransfer) event.dataTransfer.effectAllowed = 'move'
                  setDragId(column.id)
                }}
                onDragOver={(event) => handleDragOver(event, column.id)}
                onDrop={(event) => handleDrop(event, column.id)}
                onDragEnd={clearDrag}
                className={cn(
                  'tm-group/row',
                  'tm-flex',
                  'tm-items-center',
                  'tm-gap-2',
                  'tm-rounded',
                  'hover:tm-bg-cover-light',
                  'focus-within:tm-bg-cover-light',
                  'tm-border-x-0',
                  'tm-border-y-2',
                  'tm-border-solid',
                  'tm-border-transparent',
                  'tm-px-2',
                  'tm-py-2',
                  dropBefore && 'tm-border-t-action-selected-active',
                  dropAfter && 'tm-border-b-action-selected-active',
                  dragId === column.id && 'tm-opacity-50',
                )}
              >
                {locked ? (
                  <span aria-hidden className="tm-inline-block tm-w-6 tm-shrink-0" />
                ) : (
                  <button
                    type="button"
                    ref={registerControl(column.id, 'handle')}
                    data-testid={`candidate-column-handle-${column.id}`}
                    aria-label={copy.dragHandle(label)}
                    onKeyDown={(event) => handleKeyDown(event, column.id)}
                    className={cn(moveButtonClass, 'tm-shrink-0', 'tm-cursor-grab')}
                  >
                    <Icon name="grip-vertical" />
                  </button>
                )}
                <Checkbox
                  checked={locked ? true : column.visible}
                  disabled={locked}
                  aria-describedby={locked ? hintId : undefined}
                  onChange={(event) => setVisible(column.id, event.target.checked)}
                >
                  {label}
                </Checkbox>
                {locked ? null : (
                  <span className="tm-ml-auto tm-inline-flex tm-shrink-0 tm-items-center">
                    <button
                      type="button"
                      ref={registerControl(column.id, 'up')}
                      data-testid={`candidate-column-up-${column.id}`}
                      aria-label={copy.moveUp(label)}
                      disabled={movableIds[0] === column.id}
                      onClick={() => moveBy(column.id, -1, 'up')}
                      className={cn(moveButtonClass, candidateRevealOnRowHoverClass)}
                    >
                      <Icon name="chevron-up" />
                    </button>
                    <button
                      type="button"
                      ref={registerControl(column.id, 'down')}
                      data-testid={`candidate-column-down-${column.id}`}
                      aria-label={copy.moveDown(label)}
                      disabled={movableIds[movableIds.length - 1] === column.id}
                      onClick={() => moveBy(column.id, 1, 'down')}
                      className={cn(moveButtonClass, candidateRevealOnRowHoverClass)}
                    >
                      <Icon name="chevron-down" />
                    </button>
                  </span>
                )}
              </li>
            )
          })}
        </ul>
        <div role="status" aria-live="polite" className="tm-sr-only">
          {announcement}
        </div>
      </DrawerBody>
      <DrawerFooter className="tm-border-0 tm-border-t tm-border-solid tm-border-secondary">
        <Button data-testid="candidate-columns-save" onClick={() => onApply(draft)}>
          {copy.save}
        </Button>
        <DrawerClose asChild aria-label={copy.cancel}>
          <Button variant="secondary">{copy.cancel}</Button>
        </DrawerClose>
        <Button
          variant="tertiary"
          data-testid="candidate-columns-reset"
          className="sm:tm-ml-auto"
          onClick={() => setDraft(normalizeColumns(CANDIDATE_DEFAULT_COLUMNS))}
        >
          {copy.reset}
        </Button>
      </DrawerFooter>
    </>
  )
}

/**
 * Drawer for customizing the candidate table columns: each column can be hidden with a checkbox and
 * reordered by dragging its handle (or with the arrow keys on a focused handle). The name and note
 * columns are pinned (sticky in the table) and shown as disabled, checked checkboxes. Changes are
 * kept in a draft and passed to `onApply` only when "Uložit" is clicked.
 */
export function CandidateColumnsDrawer({
  open,
  onOpenChange,
  columns,
  onApply,
}: CandidateColumnsDrawerProps) {
  const copy = CANDIDATE_COPY.columnsDrawer

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent data-testid="candidate-columns-drawer">
        <DrawerTitle>{copy.title}</DrawerTitle>
        <DrawerClose aria-label={copy.close} />
        <DrawerDescription>{copy.description}</DrawerDescription>
        <CandidateColumnsForm
          columns={columns}
          onApply={(next) => {
            onApply(next)
            onOpenChange(false)
          }}
        />
      </DrawerContent>
    </Drawer>
  )
}

CandidateColumnsDrawer.displayName = 'CandidateColumnsDrawer'
