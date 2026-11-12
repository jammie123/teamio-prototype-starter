import { Fragment } from 'react'
import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'
import { Divider } from '../Divider'
import { Dropdown, DropdownBody, DropdownToggle } from '../Dropdown'
import { Icon } from '../Icon'
import { Option, OptionList } from '../OptionList'
import type { JobCardMenuSection } from './types'

export interface JobCardActionsProps extends StyleProps {
  sections: JobCardMenuSection[]
}

/** "More" menu of the job card: sections of actions separated by dividers. */
export function JobCardActions({ sections, className }: JobCardActionsProps) {
  return (
    <Dropdown placement="bottom-end" className={cn('tm-flex-none', className)}>
      <DropdownToggle
        variant="button-tertiary-circle"
        aria-label="Akce nad náborem a inzerátem"
        data-testid="job-card-actions-toggle"
      >
        <Icon name="more-horizontal" />
      </DropdownToggle>
      <DropdownBody>
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
                <Option key={item.id} onClick={item.onClick}>
                  {item.label}
                </Option>
              ))}
            </Fragment>
          ))}
        </OptionList>
      </DropdownBody>
    </Dropdown>
  )
}

JobCardActions.displayName = 'JobCardActions'
