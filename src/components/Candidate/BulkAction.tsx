import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'
import { Button } from '../Button'
import { buttonClass } from '../Button/buttonClass'
import { Dropdown } from '../Dropdown/Dropdown'
import { DropdownBody } from '../Dropdown/DropdownBody'
import { DropdownToggle } from '../Dropdown/DropdownToggle'
import { Icon } from '../Icon'
import { Option, OptionList } from '../OptionList'
import { CANDIDATE_COPY, CANDIDATE_DEFAULT_MOVE_TO_OPTIONS } from './candidateCopy'
import type { CandidateStatusOption } from './types'

export interface BulkActionProps
  extends StyleProps,
    Omit<HTMLAttributes<HTMLDivElement>, 'color' | 'children'> {
  /** Number of selected candidates. */
  count: number
  /** Targets of "Posunout do". */
  moveToOptions?: CandidateStatusOption[]
  onMoveTo?: (statusId: string, option: CandidateStatusOption) => void
  onReject?: () => void
  onInvite?: () => void
  onSendMessage?: () => void
  /** Clears the selection. The "Zrušit výběr" button is shown only when set. */
  onClear?: () => void
}

/**
 * Bar shown instead of the list toolbar while candidates are selected: the number of selected
 * candidates and the actions for all of them (move to a status, reject, invite, write a message).
 */
export const BulkAction = forwardRef<HTMLDivElement, BulkActionProps>(function BulkAction(
  {
    count,
    moveToOptions = CANDIDATE_DEFAULT_MOVE_TO_OPTIONS,
    onMoveTo,
    onReject,
    onInvite,
    onSendMessage,
    onClear,
    className,
    ...rest
  },
  ref,
) {
  const copy = CANDIDATE_COPY.bulk

  return (
    <div
      ref={ref}
      role="group"
      aria-label={copy.label}
      data-testid="bulk-action"
      className={cn('tm-flex', 'tm-flex-wrap', 'tm-items-center', 'tm-gap-3', 'tm-px-4', 'tm-py-4', className)}
      {...rest}
    >
      <span
        role="status"
        data-testid="bulk-action-count"
        className="tm-mr-1 tm-text-sm tm-font-semibold tm-text-primary-default"
      >
        {copy.selected(count)}
      </span>
      <Dropdown strategy="fixed">
        <DropdownToggle
          variant="custom"
          data-testid="bulk-action-move"
          showIndicator
          className={cn(buttonClass({ variant: 'secondary' }), 'focus-visible:!tm-rounded-full')}
        >
          <Icon name="candidate-move" />
          {copy.moveTo}
        </DropdownToggle>
        <DropdownBody>
          <OptionList>
            {moveToOptions.map((option) => (
              <Option
                key={option.id}
                data-testid={`bulk-action-move-${option.id}`}
                onClick={() => onMoveTo?.(option.id, option)}
              >
                {option.label}
              </Option>
            ))}
          </OptionList>
        </DropdownBody>
      </Dropdown>
      <Button variant="danger" data-testid="bulk-action-reject" onClick={onReject}>
        <Icon name="ban" />
        {copy.reject}
      </Button>
      <Button variant="secondary" data-testid="bulk-action-invite" onClick={onInvite}>
        <Icon name="calendar" />
        {copy.invite}
      </Button>
      <Button variant="secondary" data-testid="bulk-action-message" onClick={onSendMessage}>
        <Icon name="message-square" />
        {copy.sendMessage}
      </Button>
      {onClear ? (
        <Button
          variant="tertiary"
          data-testid="bulk-action-clear"
          className="tm-ml-auto"
          onClick={onClear}
        >
          <Icon name="x" />
          {copy.clear}
        </Button>
      ) : null}
    </div>
  )
})

BulkAction.displayName = 'BulkAction'
