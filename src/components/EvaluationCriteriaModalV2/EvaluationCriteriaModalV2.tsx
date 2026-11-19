import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import type { StyleProps } from '../../lib/types'
import { Alert } from '../Alert'
import { Button } from '../Button'
import { Icon } from '../Icon'
import {
  Modal,
  ModalBody,
  ModalClose,
  ModalContent,
  ModalFooter,
  ModalTitle,
  ModalTrigger,
  type ModalProps,
} from '../Modal'
import { Table, TableBody } from '../Table'
import { EvaluationCriteriaEmptyState } from '../EvaluationCriteriaModal/EvaluationCriteriaEmptyState'
import { EvaluationCriteriaGeneratingState } from '../EvaluationCriteriaModal/EvaluationCriteriaGeneratingState'
import { EvaluationCriteriaReadOnlyView } from '../EvaluationCriteriaModal/EvaluationCriteriaReadOnlyView'
import { EVALUATION_CRITERIA_COPY } from '../EvaluationCriteriaModal/EvaluationCriteriaModal'
import { sampleEvaluationCriteria } from '../EvaluationCriteriaModal/fixtures'
import { findEeoViolation } from '../EvaluationCriteriaModal/evaluationCriteriaRules'
import type { EvaluationCriterion, EvaluationCriterionPriority } from '../EvaluationCriteriaModal/types'
import { CriteriaModalFooter } from './CriteriaModalFooter'
import { CriteriaModalHeader } from './CriteriaModalHeader'
import { CriteriaTableHead } from './CriteriaTableHead'
import { CriterionEditorRow } from './CriterionEditorRow'
import { CriterionRow } from './CriterionRow'
import { V2_COPY, type EvaluationCriteriaGenerationError } from './copy'

export type { EvaluationCriteriaGenerationError }

export interface EvaluationCriteriaModalV2Props extends StyleProps {
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
  /** Replaces the empty state with the in-progress generate-from-JD view. */
  isGenerating?: boolean
  /**
   * Generating criteria from the position failed. The empty state shows an error under its
   * buttons, e.g. `noJobDescription` when the position lacks the information to generate from.
   */
  generationError?: EvaluationCriteriaGenerationError
  /**
   * Opens the modal as a read-only summary: criteria grouped by priority with the actions
   * "Ohodnotit kandidáty" and "Editovat kritéria". The latter switches the modal to the editor.
   * Ignored while there are no criteria (the empty state is shown instead).
   */
  readOnly?: boolean
  /** Primary action of the read-only view ("Ohodnotit kandidáty"); the modal closes afterwards. */
  onEvaluate?: () => void
  /** Called when the read-only view is switched to the editor ("Editovat kritéria"). */
  onEdit?: () => void
}

function defaultGenerateCriteria(): EvaluationCriterion[] {
  return sampleEvaluationCriteria.map((criterion) => ({
    ...criterion,
    id: `generated-${criterion.id}-${Date.now()}`,
  }))
}

interface CriterionEditor {
  id: string
  text: string
  priority: EvaluationCriterionPriority
  isNew: boolean
  hasEeoError: boolean
}

interface CriteriaEditorProps {
  initialCriteria: EvaluationCriterion[]
  generateCriteria: () => EvaluationCriterion[]
  onSave: (criteria: EvaluationCriterion[]) => void
  onClose: () => void
  onEditingChange: (isEditing: boolean, cancel: () => void) => void
  isGenerating: boolean
  generationError?: EvaluationCriteriaGenerationError
  readOnly: boolean
  onEvaluate?: () => void
  onEdit?: () => void
}

function CriteriaEditor({
  initialCriteria,
  generateCriteria,
  onSave,
  onClose,
  onEditingChange,
  isGenerating,
  generationError,
  readOnly,
  onEvaluate,
  onEdit,
}: CriteriaEditorProps) {
  // Read-only is the initial mode (mounted per open); "Editovat kritéria" leaves it for good.
  const [isReadOnly, setIsReadOnly] = useState(readOnly)
  const [prevReadOnly, setPrevReadOnly] = useState(readOnly)
  if (readOnly !== prevReadOnly) {
    setPrevReadOnly(readOnly)
    setIsReadOnly(readOnly)
  }
  // Draft lives only while the dialog is open, so Cancel / Esc discards edits.
  const [draft, setDraft] = useState(initialCriteria)
  const [editor, setEditor] = useState<CriterionEditor | null>(null)
  const idSeq = useRef(0)

  useEffect(() => {
    onEditingChange(editor !== null, () => setEditor(null))
  }, [editor, onEditingChange])

  const nextId = () => {
    idSeq.current += 1
    return `new-criterion-${idSeq.current}`
  }

  // Only one row can be edited at a time; the pencil and "Přidat kritérium" are disabled meanwhile.
  const startEditing = (id: string) => {
    if (editor) return
    const criterion = draft.find((item) => item.id === id)
    if (!criterion) return
    setEditor({
      id: criterion.id,
      text: criterion.text,
      priority: criterion.priority,
      isNew: false,
      hasEeoError: false,
    })
  }

  const startAdding = () => {
    if (editor) return
    setEditor({ id: nextId(), text: '', priority: 'low', isNew: true, hasEeoError: false })
  }

  // The editor is separate from the draft, so cancelling restores the original row.
  const cancelEditor = () => setEditor(null)

  /** "Hotovo": moves the open row into the draft, or keeps it open when it is empty / invalid. */
  const commitEditor = () => {
    if (!editor) return
    if (editor.text.trim() === '') return
    if (findEeoViolation(editor.text) !== null) {
      setEditor({ ...editor, hasEeoError: true })
      return
    }
    const nextCriterion: EvaluationCriterion = {
      id: editor.id,
      text: editor.text,
      priority: editor.priority,
    }
    setDraft((current) =>
      editor.isNew
        ? [...current, nextCriterion]
        : current.map((item) => (item.id === nextCriterion.id ? nextCriterion : item)),
    )
    setEditor(null)
  }

  const handleGenerate = () =>
    setDraft((current) => [
      ...current,
      ...generateCriteria().filter(
        (generated) => !current.some((item) => item.text === generated.text),
      ),
    ])

  const handleDelete = (id: string) => {
    setDraft((current) => current.filter((item) => item.id !== id))
    setEditor((current) => (current?.id === id ? null : current))
  }

  const isEditing = editor !== null
  const showTable = draft.length > 0 || isEditing
  const hideChrome = !showTable && initialCriteria.length === 0
  const rows: EvaluationCriterion[] = editor?.isNew
    ? [...draft, { id: editor.id, text: editor.text, priority: editor.priority }]
    : draft

  const header = <CriteriaModalHeader />

  // Nothing to summarise for an empty list - fall through to the editor / empty state.
  if (isReadOnly && initialCriteria.length > 0) {
    return (
      <>
        {header}
        <ModalClose aria-label={EVALUATION_CRITERIA_COPY.close} />
        <ModalBody className="tm-flex tm-min-h-0 tm-max-h-[calc(100vh-14rem)] tm-flex-col tm-py-2">
          <EvaluationCriteriaReadOnlyView criteria={initialCriteria} />
        </ModalBody>
        <ModalFooter className="tm-shrink-0 tm-bg-basic">
          <Button
            onClick={() => {
              onEvaluate?.()
              onClose()
            }}
          >
            {EVALUATION_CRITERIA_COPY.evaluate}
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              setIsReadOnly(false)
              onEdit?.()
            }}
          >
            {EVALUATION_CRITERIA_COPY.editCriteria}
          </Button>
        </ModalFooter>
      </>
    )
  }

  return (
    <>
      {hideChrome ? (
        <div className="tm-sr-only">
          <ModalTitle>{EVALUATION_CRITERIA_COPY.title}</ModalTitle>
        </div>
      ) : (
        header
      )}
      <ModalClose aria-label={EVALUATION_CRITERIA_COPY.close} />
      <ModalBody className="tm-flex tm-min-h-0 tm-max-h-[calc(100vh-14rem)] tm-flex-col tm-items-start tm-gap-2 tm-py-2">
        {showTable ? (
          <div className="tm-w-full">
            <Table>
              <CriteriaTableHead />
              <TableBody>
                {rows.map((criterion) =>
                  editor?.id === criterion.id ? (
                    <CriterionEditorRow
                      key={criterion.id}
                      text={editor.text}
                      priority={editor.priority}
                      isNew={editor.isNew}
                      hasEeoError={editor.hasEeoError}
                      onTextChange={(text) =>
                        setEditor((current) =>
                          current ? { ...current, text, hasEeoError: false } : current,
                        )
                      }
                      onPriorityChange={(priority) =>
                        setEditor((current) => (current ? { ...current, priority } : current))
                      }
                      onDone={commitEditor}
                      onCancel={cancelEditor}
                      onDelete={() => handleDelete(criterion.id)}
                    />
                  ) : (
                    <CriterionRow
                      key={criterion.id}
                      criterion={criterion}
                      isEditDisabled={editor !== null}
                      onPriorityChange={(priority) =>
                        setDraft((current) =>
                          current.map((item) =>
                            item.id === criterion.id ? { ...item, priority } : item,
                          ),
                        )
                      }
                      onEdit={() => startEditing(criterion.id)}
                      onDelete={() => handleDelete(criterion.id)}
                    />
                  ),
                )}
              </TableBody>
            </Table>
          </div>
        ) : isGenerating ? (
          <EvaluationCriteriaGeneratingState />
        ) : (
          <EvaluationCriteriaEmptyState
            onGenerate={handleGenerate}
            onAddManually={startAdding}
            error={
              generationError ? (
                <Alert variant="error">
                  <div className="tm-font-semibold">
                    {V2_COPY.generationErrors[generationError].title}
                  </div>
                  <div>{V2_COPY.generationErrors[generationError].description}</div>
                </Alert>
              ) : null
            }
          />
        )}
        {showTable ? (
          <Button variant="tertiary" isDisabled={editor !== null} onClick={startAdding}>
            <Icon name="plus" />
            {EVALUATION_CRITERIA_COPY.add}
          </Button>
        ) : null}
      </ModalBody>
      {hideChrome ? null : (
        <CriteriaModalFooter
          isEditing={isEditing}
          showGenerate={draft.length > 0}
          onSave={() => {
            onSave(draft)
            onClose()
          }}
          onGenerate={handleGenerate}
        />
      )}
    </>
  )
}

export function EvaluationCriteriaModalV2({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  trigger,
  criteria: criteriaProp,
  defaultCriteria = [],
  onSave,
  generateCriteria = defaultGenerateCriteria,
  isGenerating = false,
  generationError,
  readOnly = false,
  onEvaluate,
  onEdit,
  className,
}: EvaluationCriteriaModalV2Props) {
  const [openState, setOpenState] = useState(defaultOpen)
  const [savedState, setSavedState] = useState(defaultCriteria)
  const open = openProp ?? openState
  const saved = criteriaProp ?? savedState
  const editingRef = useRef(false)
  const cancelEditRef = useRef<() => void>(() => {})

  const handleEditingChange = useCallback((isEditing: boolean, cancel: () => void) => {
    editingRef.current = isEditing
    cancelEditRef.current = cancel
  }, [])

  const handleOpenChange = (next: boolean) => {
    setOpenState(next)
    onOpenChange?.(next)
  }

  return (
    <Modal open={open} onOpenChange={handleOpenChange}>
      {trigger ? <ModalTrigger asChild>{trigger}</ModalTrigger> : null}
      <ModalContent
        size="wide"
        className={className}
        onEscapeKeyDown={(event) => {
          if (!editingRef.current) return
          event.preventDefault()
          cancelEditRef.current()
        }}
      >
        <CriteriaEditor
          initialCriteria={saved}
          generateCriteria={generateCriteria}
          onSave={(next) => {
            setSavedState(next)
            onSave?.(next)
          }}
          onClose={() => handleOpenChange(false)}
          onEditingChange={handleEditingChange}
          isGenerating={isGenerating}
          generationError={generationError}
          readOnly={readOnly}
          onEvaluate={onEvaluate}
          onEdit={onEdit}
        />
      </ModalContent>
    </Modal>
  )
}

EvaluationCriteriaModalV2.displayName = 'EvaluationCriteriaModalV2'
