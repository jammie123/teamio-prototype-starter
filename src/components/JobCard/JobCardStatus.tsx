import { cn } from '../../lib/cn'
import { Button } from '../Button'
import { Dropdown, DropdownBody, DropdownToggle } from '../Dropdown'
import { Icon } from '../Icon'
import { Option, OptionList } from '../OptionList'
import { Tag, type TagColor } from '../Tag'
import type { JobCardSelectableStatus, JobStatus } from './types'

export interface JobCardStatusProps {
  status: JobStatus
  onStatusChange: (status: JobCardSelectableStatus) => void
  onCompleteDraft?: () => void
  onGoToPublish?: () => void
  onRestoreFromArchive?: () => void
}

const BADGE_CONFIG: Record<
  JobCardSelectableStatus,
  { label: string; color: TagColor; indicatorClass: string }
> = {
  published: {
    label: 'Zveřejněný',
    color: 'success',
    indicatorClass: 'tm-bg-emotion-success-emphasis',
  },
  unpublished: {
    label: 'Nezveřejněný',
    color: 'warning',
    indicatorClass: 'tm-bg-emotion-warning-emphasis',
  },
}

const STATUS_ACTIONS: Array<{
  status: JobCardSelectableStatus
  label: string
  subtitle: string
}> = [
  {
    status: 'published',
    label: 'Zveřejněný',
    subtitle: 'Inzerát je viditelný na jobportálech a dalších místech vystavení.',
  },
  {
    status: 'unpublished',
    label: 'Nezveřejněný',
    subtitle:
      'Inzerát je dostupný pouze skrze interní odkaz na inzerát. Na všech ostatních místech je skrytý.',
  },
]

export function JobCardStatus({
  status,
  onStatusChange,
  onCompleteDraft,
  onGoToPublish,
  onRestoreFromArchive,
}: JobCardStatusProps) {
  if (status === 'draft') {
    return (
      <Button variant="secondary" onClick={onCompleteDraft}>
        Dokončit nábor
      </Button>
    )
  }

  if (status === 'active') {
    return (
      <Button variant="secondary" onClick={onGoToPublish}>
        Přejít na zveřejnění
      </Button>
    )
  }

  if (status === 'archived') {
    return (
      <Button
        variant="secondary"
        onClick={() => {
          onStatusChange('unpublished')
          onRestoreFromArchive?.()
        }}
      >
        Obnovit z archivu
      </Button>
    )
  }

  const badge = BADGE_CONFIG[status]

  return (
    <Dropdown placement="bottom-end">
      <DropdownToggle
        variant="custom"
        aria-label={`Změnit stav náboru, aktuálně ${badge.label}`}
        className="tm-rounded-full tm-p-0"
      >
        <Tag
          data-testid="job-card-status"
          color={badge.color}
          isSubtle
          className="tm-min-h-8 tm-px-3 !tm-font-medium"
        >
          <span
            aria-hidden="true"
            data-testid="job-card-status-indicator"
            className={cn('tm-size-2', 'tm-flex-none', 'tm-rounded-full', badge.indicatorClass)}
          />
          {badge.label}
          <Icon
            name="chevron-down"
            className="-tm-mr-0.5 tm-text-base [&>svg]:tm-stroke-[2.5]"
          />
        </Tag>
      </DropdownToggle>
      <DropdownBody className="tm-min-w-[18rem] tm-max-w-[22rem]">
        <OptionList>
          {STATUS_ACTIONS.map((action) => {
            const isSelected = action.status === status

            return (
              <Option
                key={action.status}
                isSelected={isSelected}
                onClick={() => {
                  if (!isSelected) {
                    onStatusChange(action.status)
                  }
                }}
              >
                <span className="tm-flex tm-min-w-0 tm-flex-1 tm-flex-col tm-gap-0.5 tm-text-left">
                  <span className={cn(isSelected && 'tm-font-medium')}>{action.label}</span>
                  <span className="tm-text-13 tm-font-normal tm-text-secondary-default">
                    {action.subtitle}
                  </span>
                </span>
              </Option>
            )
          })}
        </OptionList>
      </DropdownBody>
    </Dropdown>
  )
}

JobCardStatus.displayName = 'JobCardStatus'
