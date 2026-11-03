import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import type { StyleProps } from '../../lib/types'
import { Alert } from '../Alert'
import { Button } from '../Button'
import { FormGroup } from '../FormGroup'
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
import { TextArea } from '../TextArea'
import { EvaluationCriteriaEmptyState } from '../EvaluationCriteriaModal/EvaluationCriteriaEmptyState'
import { EVALUATION_CRITERIA_COPY } from '../EvaluationCriteriaModal/EvaluationCriteriaModal'
import { EVALUATION_CRITERION_DETAIL_COPY } from '../EvaluationCriteriaModal/EvaluationCriterionDetailModal'
import { EvaluationCriterionPriorityToggle } from '../EvaluationCriteriaModal/EvaluationCriterionPriorityToggle'
import { sampleEvaluationCriteria } from '../EvaluationCriteriaModal/fixtures'
import { findEeoViolation } from '../EvaluationCriteriaModal/evaluationCriteriaRules'
import { EVALUATION_CRITERIA_HELP_URL } from '../EvaluationCriteriaModal/helpUrl'
import type { EvaluationCriterion, EvaluationCriterionPriority } from '../EvaluationCriteriaModal/types'

const COLUMN_NAME = '!tm-pl-4 !tm-pr-6'
const COLUMN_PRIORITY = '!tm-px-6'
const COLUMN_ACTIONS = '!tm-pl-6 !tm-pr-4 tm-whitespace-nowrap'
const HEADER_Y = '!tm-py-3'
const BODY_Y = '!tm-py-5 tm-align-middle'

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
  baselineText: string
  baselinePriority: EvaluationCriterionPriority
}

interface CriteriaEditorProps {
  initialCriteria: EvaluationCriterion[]
  generateCriteria: () => EvaluationCriterion[]
  onSave: (criteria: EvaluationCriterion[]) => void
  onClose: () => void
  onEditingChange: (isEditing: boolean, cancel: () => void) => void
}

function isPristine(editor: CriterionEditor) {
  return editor.text === editor.baselineText && editor.priority === editor.baselinePriority
}

function CriteriaEditor({
  initialCriteria,
  generateCriteria,
  onSave,
  onClose,
  onEditingChange,
}: CriteriaEditorProps) {
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

  const requestEditor = (next: CriterionEditor) => {
    if (!editor || isPristine(editor)) {
      setEditor(next)
      return
    }
    const violation = findEeoViolation(editor.text) !== null
    if (violation || editor.text.trim() === '') {
      setEditor({ ...editor, hasEeoError: violation })
    }
  }

  const startEditing = (id: string) => {
    const criterion = draft.find((item) => item.id === id)
    if (!criterion) return
    requestEditor({
      id: criterion.id,
      text: criterion.text,
      priority: criterion.priority,
      isNew: false,
      hasEeoError: false,
      baselineText: criterion.text,
      baselinePriority: criterion.priority,
    })
  }

  const startAdding = () =>
    requestEditor({
      id: nextId(),
      text: '',
      priority: 'low',
      isNew: true,
      hasEeoError: false,
      baselineText: '',
      baselinePriority: 'low',
    })

  const cancelEditor = () => setEditor(null)

  /** Returns the draft after a valid row commit, or null when the open row cannot be saved. */
  const commitEditor = (): EvaluationCriterion[] | null => {
    if (!editor) return draft
    if (editor.text.trim() === '') return null
    if (findEeoViolation(editor.text) !== null) {
      setEditor({ ...editor, hasEeoError: true })
      return null
    }
    const nextCriterion: EvaluationCriterion = {
      id: editor.id,
      text: editor.text,
      priority: editor.priority,
    }
    const nextDraft = editor.isNew
      ? [...draft, nextCriterion]
      : draft.map((item) => (item.id === nextCriterion.id ? nextCriterion : item))
    setDraft(nextDraft)
    setEditor(null)
    return nextDraft
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

  const showTable = draft.length > 0 || editor !== null
  const hideChrome = !showTable && initialCriteria.length === 0
  const rows: EvaluationCriterion[] = editor?.isNew
    ? [...draft, { id: editor.id, text: editor.text, priority: editor.priority }]
    : draft

  return (
    <>
      {hideChrome ? (
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
        {showTable ? (
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
                {rows.map((criterion) => {
                  const isEditing = editor?.id === criterion.id
                  if (isEditing && editor) {
                    const isNew = editor.isNew
                    return (
                      <TableRow key={criterion.id} data-testid="evaluation-criterion-row">
                        <TableCell colSpan={3} className="!tm-px-4 !tm-py-5">
                          <div className="tm-flex tm-w-full tm-flex-col tm-gap-3">
                            <FormGroup validationState={editor.hasEeoError ? 'error' : 'default'}>
                              <TextArea
                                aria-label={EVALUATION_CRITERION_DETAIL_COPY.textLabel}
                                className="tm-w-full"
                                rows={3}
                                value={editor.text}
                                autoFocus
                                onChange={(event) =>
                                  setEditor((current) =>
                                    current
                                      ? { ...current, text: event.target.value, hasEeoError: false }
                                      : current,
                                  )
                                }
                              />
                            </FormGroup>
                            {editor.hasEeoError ? (
                              <Alert variant="error">
                                {EVALUATION_CRITERION_DETAIL_COPY.eeoError}{' '}
                                <Link href={EVALUATION_CRITERIA_HELP_URL} target="_blank">
                                  {EVALUATION_CRITERION_DETAIL_COPY.eeoHelp}
                                </Link>
                              </Alert>
                            ) : null}
                            <div className="tm-flex tm-w-full tm-items-center tm-gap-2">
                              <Button
                                variant="primary"
                                isDisabled={editor.text.trim() === ''}
                                onClick={commitEditor}
                              >
                                {EVALUATION_CRITERIA_COPY.save}
                              </Button>
                              <Button variant="tertiary" onClick={cancelEditor}>
                                {EVALUATION_CRITERIA_COPY.cancel}
                              </Button>
                              <div className="tm-ml-auto tm-flex tm-items-center tm-gap-2">
                                <EvaluationCriterionPriorityToggle
                                  value={editor.priority}
                                  onChange={(priority) =>
                                    setEditor((current) => (current ? { ...current, priority } : current))
                                  }
                                />
                                {isNew ? null : (
                                  <Button
                                    variant="tertiary"
                                    size="small"
                                    isCircle
                                    aria-label={EVALUATION_CRITERIA_COPY.deleteLabel}
                                    onClick={() => handleDelete(criterion.id)}
                                  >
                                    <Icon name="trash" />
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  }

                  return (
                    <TableRow key={criterion.id} data-testid="evaluation-criterion-row">
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
                            onClick={() => startEditing(criterion.id)}
                          >
                            <Icon name="edit" />
                          </Button>
                          <Button
                            variant="tertiary"
                            size="small"
                            isCircle
                            aria-label={EVALUATION_CRITERIA_COPY.deleteLabel}
                            onClick={() => handleDelete(criterion.id)}
                          >
                            <Icon name="trash" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        ) : (
          <EvaluationCriteriaEmptyState onGenerate={handleGenerate} onAddManually={startAdding} />
        )}
        {showTable ? (
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
              const next = commitEditor()
              if (!next) return
              onSave(next)
              onClose()
            }}
          >
            {EVALUATION_CRITERIA_COPY.save}
          </Button>
          <ModalClose asChild aria-label={EVALUATION_CRITERIA_COPY.cancel}>
            <Button variant="secondary">{EVALUATION_CRITERIA_COPY.cancel}</Button>
          </ModalClose>
          {draft.length === 0 ? null : (
            <Button variant="tertiary" className="sm:tm-ml-auto" onClick={handleGenerate}>
              {EVALUATION_CRITERIA_COPY.generate}
            </Button>
          )}
        </ModalFooter>
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
        />
      </ModalContent>
    </Modal>
  )
}

EvaluationCriteriaModalV2.displayName = 'EvaluationCriteriaModalV2'
