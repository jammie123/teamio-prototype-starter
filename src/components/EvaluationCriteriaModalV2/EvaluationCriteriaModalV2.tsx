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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../Tooltip'
import { EvaluationCriteriaEmptyState } from '../EvaluationCriteriaModal/EvaluationCriteriaEmptyState'
import { EvaluationCriteriaGeneratingState } from '../EvaluationCriteriaModal/EvaluationCriteriaGeneratingState'
import { EvaluationCriteriaReadOnlyView } from '../EvaluationCriteriaModal/EvaluationCriteriaReadOnlyView'
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

const V2_COPY = {
  done: 'Hotovo',
  editingLabel: 'Úprava kritéria',
  finishEditHint: 'Nejdřív dokončete úpravu kritéria.',
  generationErrors: {
    noJobDescription: {
      title: 'Zatím nemáme dost informací k vytvoření kritérií',
      description:
        'K nastavení kvalitních kritérií hodnocení potřebujeme víc informací o pozici a náboru. Doplňte je a kritéria vygenerujeme nebo vytvořte kritéria ručně.',
    },
  },
} as const

/** Why generating criteria from the position failed. Shown under the empty-state buttons. */
export type EvaluationCriteriaGenerationError = keyof typeof V2_COPY.generationErrors

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

  const header = (
    <>
      <ModalTitle>{EVALUATION_CRITERIA_COPY.title}</ModalTitle>
      <ModalDescription className="tm--mt-3 tm-pb-4">
        {EVALUATION_CRITERIA_COPY.perex} {EVALUATION_CRITERIA_COPY.perexHelpLead}{' '}
        <Link href={EVALUATION_CRITERIA_HELP_URL} target="_blank">
          {EVALUATION_CRITERIA_COPY.perexHelpLink}
        </Link>
      </ModalDescription>
    </>
  )

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
                      <TableRow
                        key={criterion.id}
                        data-testid="evaluation-criterion-row"
                        data-editing="true"
                        className="tm-bg-cover-light"
                      >
                        <TableCell colSpan={3} className="!tm-px-4 !tm-py-5">
                          <div className="tm-flex tm-w-full tm-flex-col tm-gap-3">
                            <span className="tm-text-sm tm-font-medium tm-text-primary-default">
                              {V2_COPY.editingLabel}
                            </span>
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
                                variant="secondary"
                                isDisabled={editor.text.trim() === ''}
                                onClick={commitEditor}
                              >
                                {V2_COPY.done}
                              </Button>
                              <Button variant="tertiary" onClick={cancelEditor}>
                                {EVALUATION_CRITERIA_COPY.cancel}
                              </Button>
                              <div className="tm-ml-auto tm-flex tm-items-center tm-gap-2">
                                <EvaluationCriterionPriorityToggle
                                  size="medium"
                                  value={editor.priority}
                                  onChange={(priority) =>
                                    setEditor((current) => (current ? { ...current, priority } : current))
                                  }
                                />
                                {isNew ? null : (
                                  <Button
                                    variant="tertiary"
                                    size="medium"
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
                          size="medium"
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
                            size="medium"
                            isCircle
                            aria-label={EVALUATION_CRITERIA_COPY.editLabel}
                            isDisabled={editor !== null}
                            onClick={() => startEditing(criterion.id)}
                          >
                            <Icon name="edit" />
                          </Button>
                          <Button
                            variant="tertiary"
                            size="medium"
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
        <ModalFooter className="tm-shrink-0 tm-bg-basic">
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              {/* A disabled button swallows pointer events, so the (focusable) wrapper is the trigger. */}
              <TooltipTrigger asChild>
                <span
                  className="tm-inline-flex"
                  data-testid="evaluation-save-tooltip-trigger"
                  tabIndex={isEditing ? 0 : undefined}
                >
                  <Button
                    isDisabled={isEditing}
                    onClick={() => {
                      onSave(draft)
                      onClose()
                    }}
                  >
                    {EVALUATION_CRITERIA_COPY.save}
                  </Button>
                </span>
              </TooltipTrigger>
              {isEditing ? (
                // The modal is z-50; the tooltip must sit above it.
                <TooltipContent side="top" className="!tm-z-[60]">
                  {V2_COPY.finishEditHint}
                </TooltipContent>
              ) : null}
            </Tooltip>
          </TooltipProvider>
          {isEditing ? null : (
            <ModalClose asChild aria-label={EVALUATION_CRITERIA_COPY.cancel}>
              <Button variant="secondary">{EVALUATION_CRITERIA_COPY.cancel}</Button>
            </ModalClose>
          )}
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
