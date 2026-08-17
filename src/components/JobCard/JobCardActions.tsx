import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'
import { Dropdown, DropdownBody, DropdownToggle } from '../Dropdown'
import { Icon } from '../Icon'
import { Option, OptionList } from '../OptionList'
import type { JobCardAction } from './types'

export interface JobCardActionsProps extends StyleProps {
  actions: JobCardAction[]
  label: string
  testId: string
}

export function JobCardActions({ actions, label, testId, className }: JobCardActionsProps) {
  return (
    <Dropdown placement="bottom-end" className={cn('tm-flex-none', className)}>
      <DropdownToggle variant="button-tertiary-circle" aria-label={label} data-testid={testId}>
        <Icon name="more-vertical" />
      </DropdownToggle>
      <DropdownBody>
        <OptionList>
          {actions.map((action) => (
            <Option key={action.id} color={action.color} onClick={action.onClick}>
              {action.label}
            </Option>
          ))}
        </OptionList>
      </DropdownBody>
    </Dropdown>
  )
}

JobCardActions.displayName = 'JobCardActions'
