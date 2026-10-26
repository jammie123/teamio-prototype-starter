import { useState, type KeyboardEvent, type MouseEvent, type ReactNode } from 'react'
import type { StyleProps } from '../../lib/types'
import { Button } from '../Button'
import { Icon } from '../Icon'
import { Link } from '../Link'
import {
  Modal,
  ModalBody,
  ModalClose,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalTitle,
  ModalTrigger,
  type ModalProps,
} from '../Modal'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../Table'
import { EvaluationCriteriaEmptyState } from './EvaluationCriteriaEmptyState'
import { EvaluationCriterionDetailModal } from './EvaluationCriterionDetailModal'
import { EvaluationCriterionPriorityToggle } from './EvaluationCriterionPriorityToggle'
import { sampleEvaluationCriteria } from './fixtures'
import { EVALUATION_CRITERIA_HELP_URL } from './helpUrl'
import type { EvaluationCriterion } from './types'

export const EVALUATION_CRITERIA_COPY = {
  title: 'Kritéria hodnocení kandidátů',
  perex:
    'Nastavte, na čem vám u této pozice záleží nejvíc. Podle priority se kandidáti automaticky řadí a zvýrazňují se ti, kteří nesplňují povinná kritéria.',
  perexHelpLead: 'Více o této funkci zjistíte v',
  perexHelpLink: 'nápovědě',
  columnName: 'Název kritéria',
  columnPriority: 'Priorita',
  columnActions: 'Akce',
  editLabel: 'Upravit kritérium',
  deleteLabel: 'Smazat kritérium',
  add: 'Přidat kritérium',
  generate: 'Vygenerovat z pozice',
  save: 'Uložit',
  cancel: 'Zrušit',
  close: 'Zavřít dialog',
} as const

// More white space than the default Table cell padding (important: overrides TableCell/TableHeader).
// Horizontal padding is split per column so the gap between columns is 48px.
const COLUMN_NAME = '!tm-pl-4 !tm-pr-6'
const COLUMN_PRIORITY = '!tm-px-6'
const COLUMN_ACTIONS = '!tm-pl-6 !tm-pr-4 tm-w-40'
const HEADER_Y = '!tm-py-3'
const BODY_Y = '!tm-py-5 tm-align-middle'

export interface EvaluationCriteriaModalProps extends StyleProps {
  open?: ModalProps['open']
  defaultOpen?: ModalProps['defaultOpen']
  onOpenChange?: ModalProps['onOpenChange']
  trigger?: ReactNode
  /** Saved criteria (controlled). Updated through `onSave`. */
  criteria?: EvaluationCriterion[]
  /** Initial criteria when `criteria` is not provided. */
  defaultCriteria?: EvaluationCriterion[]
  onSave?: (criteria: EvaluationCriterion[]) => void
  /** Produces criteria for "Vygenerovat z pozice" in the empty state. Defaults to sample data. */
  generateCriteria?: () => EvaluationCriterion[]
}

function defaultGenerateCriteria(): EvaluationCriterion[] {
  return sampleEvaluationCriteria.map((criterion) => ({
    ...criterion,
    id: `generated-${criterion.id}-${Date.now()}`,
  }))
}

interface CriteriaEditorProps {
  initialCriteria: EvaluationCriterion[]
  generateCriteria: () => EvaluationCriterion[]
  onSave: (criteria: EvaluationCriterion[]) => void
  onClose: () => void
}

function CriteriaEditor({
  initialCriteria,
  generateCriteria,
  onSave,
  onClose,
}: CriteriaEditorProps) {
  // Draft lives only while the dialog is open, so Cancel / Esc discards edits.
  const [draft, setDraft] = useState(initialCriteria)
  const [editingId, setEditingId] = useState<string | null>(null)
  // A criterion that is being added; it joins the draft only after it is saved in the detail.
  const [adding, setAdding] = useState<EvaluationCriterion | null>(null)
  const editing = adding ?? draft.find((criterion) => criterion.id === editingId)

  const closeDetail = () => {
    setEditingId(null)
    setAdding(null)
  }

  const saveCriterion = (next: EvaluationCriterion) => {
    if (adding) {
      setDraft((current) => [...current, next])
      return
    }
    setDraft((current) => current.map((item) => (item.id === next.id ? next : item)))
  }

  // Appends generated criteria, skipping those already in the list.
  const handleGenerate = () =>
    setDraft((current) => [
      ...current,
      ...generateCriteria().filter(
        (generated) => !current.some((item) => item.text === generated.text),
      ),
    ])

  const startAdding = () => setAdding({ id: `criterion-${Date.now()}`, text: '', priority: 'low' })

  const handleRowKeyDown = (event: KeyboardEvent<HTMLTableRowElement>, id: string) => {
    if (event.target !== event.currentTarget) return
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      setEditingId(id)
    }
  }

  const handleEdit = (event: MouseEvent<HTMLButtonElement>, id: string) => {
    event.stopPropagation()
    setEditingId(id)
  }

  const handleDelete = (event: MouseEvent<HTMLButtonElement>, id: string) => {
    event.stopPropagation()
    setDraft((current) => current.filter((item) => item.id !== id))
  }

  const isEmpty = draft.length === 0
  // Header + footer are dropped only for a pristine empty list; if the user emptied an existing
  // list, Save must stay reachable so the deletion can be persisted.
  const hideChrome = isEmpty && initialCriteria.length === 0

  return (
    <>
      {hideChrome ? (
        // Empty state has no visible header; the title stays for the dialog's accessible name.
        <div className="tm-sr-only">
          <ModalTitle>{EVALUATION_CRITERIA_COPY.title}</ModalTitle>
        </div>
      ) : (
        <>
          <ModalTitle>{EVALUATION_CRITERIA_COPY.title}</ModalTitle>
          <ModalDescription className="tm--mt-3 tm-pb-4">
            {EVALUATION_CRITERIA_COPY.perex} {EVALUATION_CRITERIA_COPY.perexHelpLead}{' '}
            <Link href={EVALUATION_CRITERIA_HELP_URL} target="_blank">
              {EVALUATION_CRITERIA_COPY.perexHelpLink}
            </Link>
            .
          </ModalDescription>
        </>
      )}
      <ModalClose aria-label={EVALUATION_CRITERIA_COPY.close} />
      <ModalBody className="tm-flex tm-min-h-0 tm-max-h-[calc(100vh-14rem)] tm-flex-col tm-items-start tm-gap-2 tm-py-2">
        {isEmpty ? (
          <EvaluationCriteriaEmptyState
            onGenerate={handleGenerate}
            onAddManually={startAdding}
          />
        ) : (
          <div className="tm-w-full">
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeader className={`${COLUMN_NAME} ${HEADER_Y}`}>
                    {EVALUATION_CRITERIA_COPY.columnName}
                  </TableHeader>
                  <TableHeader className={`${COLUMN_PRIORITY} ${HEADER_Y}`}>
                    {EVALUATION_CRITERIA_COPY.columnPriority}
                  </TableHeader>
                  <TableHeader className={`${COLUMN_ACTIONS} ${HEADER_Y}`}>
                    <span className="tm-sr-only">{EVALUATION_CRITERIA_COPY.columnActions}</span>
                  </TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {draft.map((criterion) => (
                  <TableRow
                    key={criterion.id}
                    tabIndex={0}
                    aria-haspopup="dialog"
                    data-testid="evaluation-criterion-row"
                    className="tm-cursor-pointer hover:tm-bg-interactive-hover focus-visible:tm-outline-0 focus-visible:tm-ring"
                    onClick={() => setEditingId(criterion.id)}
                    onKeyDown={(event) => handleRowKeyDown(event, criterion.id)}
                  >
                    <TableCell className={`${COLUMN_NAME} ${BODY_Y}`}>{criterion.text}</TableCell>
                    <TableCell className={`${COLUMN_PRIORITY} ${BODY_Y}`}>
                      <EvaluationCriterionPriorityToggle
                        value={criterion.priority}
                        onChange={(priority) =>
                          setDraft((current) =>
                            current.map((item) =>
                              item.id === criterion.id ? { ...item, priority } : item,
                            ),
                          )
                        }
                      />
                    </TableCell>
                    <TableCell className={`${COLUMN_ACTIONS} ${BODY_Y}`}>
                      <div className="tm-flex tm-items-center tm-justify-end tm-gap-2">
                        <Button
                          variant="tertiary"
                          size="small"
                          isCircle
                          aria-label={EVALUATION_CRITERIA_COPY.editLabel}
                          onClick={(event) => handleEdit(event, criterion.id)}
                        >
                          <Icon name="edit" />
                        </Button>
                        <Button
                          variant="tertiary"
                          size="small"
                          isCircle
                          aria-label={EVALUATION_CRITERIA_COPY.deleteLabel}
                          onClick={(event) => handleDelete(event, criterion.id)}
                        >
                          <Icon name="trash" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
        {!isEmpty ? (
          <Button variant="tertiary" onClick={startAdding}>
            <Icon name="plus" />
            {EVALUATION_CRITERIA_COPY.add}
          </Button>
        ) : null}
      </ModalBody>
      {hideChrome ? null : (
        <ModalFooter className="tm-shrink-0 tm-bg-basic">
          <Button
            onClick={() => {
              onSave(draft)
              onClose()
            }}
          >
            {EVALUATION_CRITERIA_COPY.save}
          </Button>
          <ModalClose asChild aria-label={EVALUATION_CRITERIA_COPY.cancel}>
            <Button variant="secondary">{EVALUATION_CRITERIA_COPY.cancel}</Button>
          </ModalClose>
          {isEmpty ? null : (
            <Button variant="tertiary" className="sm:tm-ml-auto" onClick={handleGenerate}>
              {EVALUATION_CRITERIA_COPY.generate}
            </Button>
          )}
        </ModalFooter>
      )}
      {editing ? (
        <EvaluationCriterionDetailModal
          criterion={editing}
          isNew={adding !== null}
          open
          onOpenChange={(next) => {
            if (!next) closeDetail()
          }}
          onSave={saveCriterion}
          onDelete={(criterion) =>
            setDraft((current) => current.filter((item) => item.id !== criterion.id))
          }
        />
      ) : null}
    </>
  )
}

export function EvaluationCriteriaModal({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  trigger,
  criteria: criteriaProp,
  defaultCriteria = [],
  onSave,
  generateCriteria = defaultGenerateCriteria,
  className,
}: EvaluationCriteriaModalProps) {
  const [openState, setOpenState] = useState(defaultOpen)
  const [savedState, setSavedState] = useState(defaultCriteria)
  const open = openProp ?? openState
  const saved = criteriaProp ?? savedState

  const handleOpenChange = (next: boolean) => {
    setOpenState(next)
    onOpenChange?.(next)
  }

  return (
    <Modal open={open} onOpenChange={handleOpenChange}>
      {trigger ? <ModalTrigger asChild>{trigger}</ModalTrigger> : null}
      <ModalContent size="wide" className={className}>
        <CriteriaEditor
          initialCriteria={saved}
          generateCriteria={generateCriteria}
          onSave={(next) => {
            setSavedState(next)
            onSave?.(next)
          }}
          onClose={() => handleOpenChange(false)}
        />
      </ModalContent>
    </Modal>
  )
}

EvaluationCriteriaModal.displayName = 'EvaluationCriteriaModal'
