import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'
import { Dropdown } from '../Dropdown/Dropdown'
import { DropdownBody } from '../Dropdown/DropdownBody'
import { DropdownToggle } from '../Dropdown/DropdownToggle'
import { Icon } from '../Icon'
import { Option, OptionList } from '../OptionList'
import { CANDIDATE_COPY, CANDIDATE_DEFAULT_MOVE_TO_OPTIONS } from './candidateCopy'
import type { CandidateActionId, CandidateStatusOption } from './types'

export interface CandidateActionsMenuProps extends StyleProps {
  /** Accessible name of the toggle; defaults to a generic label. */
  label?: string
  /** Targets of the "Posunout do" section. */
  moveToOptions?: CandidateStatusOption[]
  /** Called with the chosen action; `statusId` is set for `move`. */
  onAction?: (actionId: CandidateActionId, statusId?: string) => void
}

const SECTION_CLASS = 'tm-flex tm-flex-col tm-gap-0.5 tm-pt-1 tm-mt-0.5 tm-border-t tm-border-secondary'

function Section({ children }: { children: ReactNode }) {
  return (
    <div role="group" className={SECTION_CLASS}>
      {children}
    </div>
  )
}

/**
 * "Three dots" tertiary button with the candidate action menu: reject, move to a status and the
 * remaining candidate actions. The panel is positioned `fixed` so it is not clipped by the table.
 */
export function CandidateActionsMenu({
  label = CANDIDATE_COPY.actions.menuLabel(''),
  moveToOptions = CANDIDATE_DEFAULT_MOVE_TO_OPTIONS,
  onAction,
  className,
}: CandidateActionsMenuProps) {
  const copy = CANDIDATE_COPY.actions
  const items: { id: CandidateActionId; label: string }[] = [
    { id: 'ai-evaluate', label: copy.aiEvaluate },
    { id: 'record-contact', label: copy.recordContact },
    { id: 'send-message', label: copy.sendMessage },
    { id: 'forward', label: copy.forward },
    { id: 'assign-to-position', label: copy.assignToPosition },
    { id: 'edit', label: copy.edit },
    { id: 'request-consent', label: copy.requestConsent },
    { id: 'add-tag', label: copy.addTag },
  ]

  return (
    <Dropdown strategy="fixed" placement="bottom-start" className={cn('tm-align-middle', className)}>
      <DropdownToggle
        variant="button-tertiary-circle"
        aria-label={label.trim()}
        data-testid="candidate-actions-toggle"
      >
        <Icon name="more-vertical" className="tm-text-base" />
      </DropdownToggle>
      <DropdownBody>
        <OptionList>
          <Option data-testid="candidate-action-reject" onClick={() => onAction?.('reject')}>
            {copy.reject}
          </Option>
          {moveToOptions.length > 0 ? (
            <Section>
              <div className="tm-p-2 tm-text-sm tm-font-semibold tm-text-secondary-default">
                {copy.moveTo}
              </div>
              {moveToOptions.map((option) => (
                <Option
                  key={option.id}
                  data-testid={`candidate-action-move-${option.id}`}
                  onClick={() => onAction?.('move', option.id)}
                >
                  {option.label}
                </Option>
              ))}
            </Section>
          ) : null}
          <Section>
            {items.map((item) => (
              <Option
                key={item.id}
                data-testid={`candidate-action-${item.id}`}
                onClick={() => onAction?.(item.id)}
              >
                {item.label}
              </Option>
            ))}
          </Section>
        </OptionList>
      </DropdownBody>
    </Dropdown>
  )
}

CandidateActionsMenu.displayName = 'CandidateActionsMenu'
