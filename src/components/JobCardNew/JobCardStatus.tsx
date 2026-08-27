import { useContext, useEffect, useId, useState } from 'react'
import { cn } from '../../lib/cn'
import { Dropdown, DropdownBody, DropdownContext, DropdownToggle } from '../Dropdown'
import { Icon } from '../Icon'
import { Option, OptionList } from '../OptionList'
import { Radio } from '../Radio'
import type { JobStatus } from './types'

export type JobCardStatusTone = 'info' | 'success' | 'warning' | 'promotion' | 'default' | 'danger'

export interface JobCardStatusOption {
  id: JobStatus
  label: string
  description: string
  tone: JobCardStatusTone
}

export const JOB_CARD_STATUSES: JobCardStatusOption[] = [
  {
    id: 'active',
    label: 'Aktivní',
    description: 'Nábor je otevřený pro práci s kandidáty.',
    tone: 'info',
  },
  {
    id: 'published',
    label: 'Zveřejněný',
    description: 'Viditelný skrze job portály a další místa.',
    tone: 'success',
  },
  {
    id: 'unpublished',
    label: 'Nezveřejněný',
    description: 'Není vidět skrze job portály, je dostupný skrze interní link.',
    tone: 'warning',
  },
  {
    id: 'internal',
    label: 'Interní',
    description: 'Viditelný pouze skrze referál.',
    tone: 'promotion',
  },
  {
    id: 'archived',
    label: 'Archivní',
    description: 'Nábor už je uzavřený a už s ním nechcete pracovat.',
    tone: 'danger',
  },
]

const VISIBILITY_STATUS_IDS = ['published', 'unpublished', 'internal'] as const

type JobVisibilityStatus = (typeof VISIBILITY_STATUS_IDS)[number]

function isVisibilityStatus(status: JobStatus): status is JobVisibilityStatus {
  return VISIBILITY_STATUS_IDS.includes(status as JobVisibilityStatus)
}

function isActiveFamily(status: JobStatus) {
  return status === 'active' || isVisibilityStatus(status)
}

export interface JobCardStatusProps {
  status: JobStatus
  onStatusChange: (status: JobStatus) => void
}

function toneClass(tone: JobCardStatusTone) {
  switch (tone) {
    case 'info':
      return 'tm-bg-emotion-info-background tm-text-emotion-info-emphasis'
    case 'success':
      return 'tm-bg-emotion-success-background tm-text-emotion-success-emphasis'
    case 'warning':
      return 'tm-bg-emotion-warning-background tm-text-emotion-warning-emphasis'
    case 'promotion':
      return 'tm-bg-emotion-promotion-background tm-text-emotion-promotion-emphasis'
    case 'danger':
      return 'tm-bg-emotion-danger-background tm-text-emotion-danger-emphasis'
    case 'default':
    default:
      return 'tm-bg-cover-dark tm-text-secondary-default hover:tm-bg-interactive-hover'
  }
}

function toneDotClass(tone: JobCardStatusTone) {
  switch (tone) {
    case 'info':
      return 'tm-bg-emotion-info-emphasis'
    case 'success':
      return 'tm-bg-emotion-success-emphasis'
    case 'warning':
      return 'tm-bg-emotion-warning-emphasis'
    case 'promotion':
      return 'tm-bg-emotion-promotion-emphasis'
    case 'danger':
      return 'tm-bg-emotion-danger-emphasis'
    case 'default':
    default:
      return 'tm-bg-text-secondary-default'
  }
}

function JobCardStatusMenu({ status, onStatusChange }: JobCardStatusProps) {
  const { setOpen } = useContext(DropdownContext)
  const visibilityName = useId()
  const [visibilityOpen, setVisibilityOpen] = useState(() => isActiveFamily(status))
  const visibilityStatuses = JOB_CARD_STATUSES.filter((option) => isVisibilityStatus(option.id))
  const active = JOB_CARD_STATUSES.find((option) => option.id === 'active') ?? JOB_CARD_STATUSES[0]
  const archived =
    JOB_CARD_STATUSES.find((option) => option.id === 'archived') ?? JOB_CARD_STATUSES[4]

  useEffect(() => {
    setVisibilityOpen(isActiveFamily(status))
  }, [status])

  function selectArchived() {
    onStatusChange('archived')
    setVisibilityOpen(false)
    setOpen(false)
  }

  function selectVisibility(nextStatus: JobVisibilityStatus) {
    onStatusChange(nextStatus)
    setOpen(false)
  }

  function revealVisibility() {
    setVisibilityOpen(true)
    if (!isActiveFamily(status)) {
      onStatusChange('active')
    }
  }

  return (
    <OptionList>
      <Option
        isSelected={isActiveFamily(status)}
        aria-expanded={visibilityOpen}
        onClick={revealVisibility}
        className="tm-items-start"
      >
        <span className="tm-flex tm-min-w-0 tm-items-start tm-gap-2">
          <span
            data-testid="job-card-status-option-dot-active"
            aria-hidden
            className={cn(
              'tm-mt-1.5',
              'tm-size-2',
              'tm-shrink-0',
              'tm-rounded-full',
              toneDotClass(active.tone),
            )}
          />
          <span className="tm-flex tm-min-w-0 tm-flex-col tm-gap-0.5">
            <span className="tm-font-medium">{active.label}</span>
            <span className="tm-text-13 tm-font-normal tm-text-secondary-default tm-whitespace-normal">
              {active.description}
            </span>
          </span>
        </span>
      </Option>
      {visibilityOpen ? (
        <div
          role="radiogroup"
          aria-label="Zviditelnění aktivního náboru"
          data-testid="job-card-status-visibility"
          className="tm-flex tm-flex-col tm-gap-1 tm-py-1 tm-pl-6"
        >
          <div
            role="presentation"
            data-testid="job-card-status-insertion-hint"
            className="tm-px-2 tm-py-1 tm-text-13 tm-font-normal tm-text-secondary-default tm-whitespace-normal"
          >
            Aktivní nábor může mít zviditelnění
          </div>
          {visibilityStatuses.map((option) => (
            <Radio
              key={option.id}
              name={visibilityName}
              value={option.id}
              checked={status === option.id}
              data-testid={`job-card-status-visibility-${option.id}`}
              className="tm-items-start tm-px-2 tm-py-1"
              onChange={() => selectVisibility(option.id as JobVisibilityStatus)}
            >
              <span className="tm-flex tm-min-w-0 tm-items-start tm-gap-2">
                <span
                  data-testid={`job-card-status-option-dot-${option.id}`}
                  aria-hidden
                  className={cn(
                    'tm-mt-1.5',
                    'tm-size-2',
                    'tm-shrink-0',
                    'tm-rounded-full',
                    toneDotClass(option.tone),
                  )}
                />
                <span className="tm-flex tm-min-w-0 tm-flex-col tm-gap-0.5">
                  <span className="tm-font-medium tm-text-sm">{option.label}</span>
                  <span className="tm-text-13 tm-font-normal tm-text-secondary-default tm-whitespace-normal">
                    {option.description}
                  </span>
                </span>
              </span>
            </Radio>
          ))}
        </div>
      ) : null}
      <Option isSelected={status === 'archived'} onClick={selectArchived} className="tm-items-start">
        <span className="tm-flex tm-min-w-0 tm-items-start tm-gap-2">
          <span
            data-testid="job-card-status-option-dot-archived"
            aria-hidden
            className={cn(
              'tm-mt-1.5',
              'tm-size-2',
              'tm-shrink-0',
              'tm-rounded-full',
              toneDotClass(archived.tone),
            )}
          />
          <span className="tm-flex tm-min-w-0 tm-flex-col tm-gap-0.5">
            <span className="tm-font-medium">{archived.label}</span>
            <span className="tm-text-13 tm-font-normal tm-text-secondary-default tm-whitespace-normal">
              {archived.description}
            </span>
          </span>
        </span>
      </Option>
    </OptionList>
  )
}

export function JobCardStatus({ status, onStatusChange }: JobCardStatusProps) {
  const current = JOB_CARD_STATUSES.find((option) => option.id === status) ?? JOB_CARD_STATUSES[0]

  return (
    <Dropdown autoClose={false} placement="bottom-end" className="tm-flex-none">
      <DropdownToggle
        variant="custom"
        aria-label={`Stav náboru: ${current.label}`}
        data-testid="job-card-status"
        className={cn(
          'tm-min-h-8',
          'tm-px-3',
          'tm-gap-2',
          'tm-rounded-full',
          'tm-border-0',
          'tm-text-sm',
          'tm-font-medium',
          toneClass(current.tone),
        )}
      >
        <span
          data-testid="job-card-status-dot"
          aria-hidden
          className="tm-size-2 tm-shrink-0 tm-rounded-full tm-bg-current"
        />
        {current.label}
        <Icon name="chevron-down" strokeWidth={2.75} className="tm-text-base" />
      </DropdownToggle>
      <DropdownBody
        data-testid="job-card-status-menu"
        className="tm-w-[22rem] tm-min-w-[22rem] tm-max-w-[22rem]"
      >
        <JobCardStatusMenu status={status} onStatusChange={onStatusChange} />
      </DropdownBody>
    </Dropdown>
  )
}

JobCardStatus.displayName = 'JobCardStatus'
