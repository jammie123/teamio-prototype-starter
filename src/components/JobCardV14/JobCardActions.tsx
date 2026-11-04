import { Fragment } from 'react'
import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'
import { Divider } from '../Divider'
import { Dropdown, DropdownBody, DropdownToggle } from '../Dropdown'
import { Icon } from '../Icon'
import { Option, OptionList, OptionSubmenu } from '../OptionList'
import type { JobCardMenuItem, JobCardMenuSection } from './types'

export interface JobCardActionsProps extends StyleProps {
  sections: JobCardMenuSection[]
  label: string
  testId: string
}

function MenuItem({ item }: { item: JobCardMenuItem }) {
  if (item.actions?.length) {
    return (
      <OptionSubmenu
        label={item.label}
        description={item.description}
        count={item.count}
        color={item.color}
      >
        <OptionList>
          {item.actions.map((action) => (
            <MenuItem key={action.id} item={action} />
          ))}
        </OptionList>
      </OptionSubmenu>
    )
  }

  return (
    <Option color={item.color} description={item.description} onClick={item.onClick}>
      {item.label}
    </Option>
  )
}

export function JobCardActions({ sections, label, testId, className }: JobCardActionsProps) {
  const hasSubmenu = sections.some((section) =>
    section.items.some((item) => Boolean(item.actions?.length)),
  )

  return (
    <Dropdown placement="bottom-end" className={cn('tm-flex-none', className)}>
      <DropdownToggle variant="button-tertiary-circle" aria-label={label} data-testid={testId}>
        <Icon name="more-vertical" />
      </DropdownToggle>
      <DropdownBody overflow={hasSubmenu ? 'visible' : undefined}>
        <OptionList>
          {sections.map((section, index) => (
            <Fragment key={section.id}>
              {index > 0 ? (
                <Divider
                  role="none"
                  aria-hidden="true"
                  data-testid="job-card-actions-divider"
                  className="tm-my-1"
                />
              ) : null}
              {section.items.map((item) => (
                <MenuItem key={item.id} item={item} />
              ))}
            </Fragment>
          ))}
        </OptionList>
      </DropdownBody>
    </Dropdown>
  )
}

JobCardActions.displayName = 'JobCardActions'
