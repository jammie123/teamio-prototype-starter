import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'
import { Dropdown } from '../Dropdown/Dropdown'
import { DropdownBody } from '../Dropdown/DropdownBody'
import { DropdownToggle } from '../Dropdown/DropdownToggle'
import { Option, OptionList } from '../OptionList'
import { CANDIDATE_COPY, CANDIDATE_DEFAULT_STATUSES } from './candidateCopy'
import type { CandidateStatusColor, CandidateStatusOption } from './types'

export interface CandidateStatusProps extends StyleProps {
  /** Id of the currently selected status. */
  value: string
  options?: CandidateStatusOption[]
  onChange?: (statusId: string, option: CandidateStatusOption) => void
}

function statusColorClass(color: CandidateStatusColor = 'neutral') {
  switch (color) {
    case 'informative':
      return 'tm-bg-emotion-info-background tm-text-emotion-info-emphasis'
    case 'success':
      return 'tm-bg-emotion-success-background tm-text-emotion-success-emphasis'
    case 'warning':
      return 'tm-bg-emotion-warning-background tm-text-emotion-warning-emphasis'
    case 'danger':
      return 'tm-bg-emotion-danger-background tm-text-emotion-danger-emphasis'
    case 'neutral':
    default:
      return 'tm-bg-cover-dark tm-text-primary-default'
  }
}

export function CandidateStatus({
  value,
  options = CANDIDATE_DEFAULT_STATUSES,
  onChange,
  className,
}: CandidateStatusProps) {
  const current = options.find((option) => option.id === value)

  return (
    <Dropdown className={className}>
      <DropdownToggle
        variant="custom"
        showIndicator
        aria-label={`${CANDIDATE_COPY.statusLabel}: ${current?.label ?? ''}`.trim()}
        data-testid="candidate-status-toggle"
        data-status={current?.id}
        className={cn(
          'tm-min-h-6',
          'tm-gap-1',
          'tm-rounded-full',
          'tm-px-3',
          'tm-py-0.5',
          'tm-font-poppins',
          'tm-text-sm',
          'tm-font-medium',
          'tm-whitespace-nowrap',
          statusColorClass(current?.color),
        )}
      >
        {current?.label ?? CANDIDATE_COPY.emptyValue}
      </DropdownToggle>
      <DropdownBody>
        <OptionList>
          {options.map((option) => (
            <Option
              key={option.id}
              isSelected={option.id === value}
              onClick={() => onChange?.(option.id, option)}
            >
              {option.label}
            </Option>
          ))}
        </OptionList>
      </DropdownBody>
    </Dropdown>
  )
}

CandidateStatus.displayName = 'CandidateStatus'
