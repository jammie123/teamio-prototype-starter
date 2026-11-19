import { Button } from '../Button'
import { ModalClose, ModalFooter } from '../Modal'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../Tooltip'
import { EVALUATION_CRITERIA_COPY } from '../EvaluationCriteriaModal/EvaluationCriteriaModal'
import { V2_COPY } from './copy'

export interface CriteriaModalFooterProps {
  /** A row is open in the editor: "Uložit" is disabled (with a hint) and "Zrušit" is hidden. */
  isEditing?: boolean
  /** Show "Vygenerovat z pozice" (only when there already are criteria). */
  showGenerate?: boolean
  onSave?: () => void
  onGenerate?: () => void
}

/** Footer actions: save (with tooltip while editing), cancel and generate. Render inside `Modal`. */
export function CriteriaModalFooter({
  isEditing = false,
  showGenerate = true,
  onSave,
  onGenerate,
}: CriteriaModalFooterProps) {
  return (
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
              <Button isDisabled={isEditing} onClick={onSave}>
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
      {showGenerate ? (
        <Button variant="tertiary" className="sm:tm-ml-auto" onClick={onGenerate}>
          {EVALUATION_CRITERIA_COPY.generate}
        </Button>
      ) : null}
    </ModalFooter>
  )
}

CriteriaModalFooter.displayName = 'CriteriaModalFooter'
