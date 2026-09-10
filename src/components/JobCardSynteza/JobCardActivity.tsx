import { useEffect, useState } from 'react'
import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'
import { Dropdown, DropdownBody, DropdownToggle } from '../Dropdown'
import { Icon } from '../Icon'
import type { JobCardActivity as JobCardActivityItem } from './types'

export interface JobCardActivityProps extends StyleProps {
  activities?: JobCardActivityItem[]
  onActivityClick?: (activity: JobCardActivityItem) => void
}

function activityText(activity: JobCardActivityItem) {
  if (activity.type === 'rating') {
    return `${activity.actor} ohodnotil/a uchazeče ${activity.candidateName}`
  }

  return `${activity.actor} přidal/a poznámku k uchazeči ${activity.candidateName}`
}

const FALL_DOTS = [
  { left: '18%', delay: '0s' },
  { left: '42%', delay: '0.25s' },
  { left: '62%', delay: '0.5s' },
  { left: '78%', delay: '0.75s' },
]

export function JobCardActivity({
  activities = [],
  onActivityClick,
  className,
}: JobCardActivityProps) {
  const [items, setItems] = useState(activities)

  useEffect(() => {
    setItems(activities)
  }, [activities])

  const hasUnread = items.some((activity) => activity.unread)

  function markRead() {
    setItems((current) => current.map((activity) => ({ ...activity, unread: false })))
  }

  return (
    <Dropdown
      openOnHover
      hoverDelay={150}
      placement="bottom-end"
      className={cn('tm-flex-none', className)}
      onOpenChange={(isOpen) => {
        if (isOpen) {
          markRead()
        }
      }}
    >
      <DropdownToggle
        variant="button-tertiary-circle"
        aria-label="Aktivity liniového manažera"
        data-testid="job-card-activity-toggle"
        className="tm-relative tm-overflow-visible"
      >
        <Icon name="notification" />
        {hasUnread
          ? FALL_DOTS.map((dot, index) => (
              <span
                key={index}
                data-testid="job-card-activity-dot"
                aria-hidden
                className="tm-pointer-events-none tm-absolute tm-top-0 tm-size-1.5 tm-rounded-full tm-bg-teamio-pink tm-animate-fall-dot"
                style={{ left: dot.left, animationDelay: dot.delay }}
              />
            ))
          : null}
      </DropdownToggle>
      <DropdownBody
        data-testid="job-card-activity-menu"
        initialFocus={-1}
        className="tm-w-72 tm-min-w-72"
      >
        {items.length === 0 ? (
          <p
            data-testid="job-card-activity-empty"
            className="tm-m-0 tm-px-3 tm-py-2 tm-text-sm tm-text-secondary-default"
          >
            Žádné nové aktivity
          </p>
        ) : (
          <ul className="tm-m-0 tm-flex tm-list-none tm-flex-col tm-p-0">
            {items.map((activity) => (
              <li key={activity.id}>
                <button
                  type="button"
                  data-testid={`job-card-activity-${activity.id}`}
                  className={cn(
                    'tm-flex',
                    'tm-w-full',
                    'tm-flex-col',
                    'tm-items-start',
                    'tm-gap-0.5',
                    'tm-border-0',
                    'tm-bg-transparent',
                    'tm-px-3',
                    'tm-py-2',
                    'tm-text-left',
                    'tm-font-inherit',
                    'tm-cursor-pointer',
                    'hover:tm-bg-interactive-hover',
                  )}
                  onClick={() => onActivityClick?.(activity)}
                >
                  <span className="tm-text-sm tm-text-primary-default">{activityText(activity)}</span>
                  <span className="tm-text-13 tm-text-secondary-default">{activity.occurredAt}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </DropdownBody>
    </Dropdown>
  )
}

JobCardActivity.displayName = 'JobCardActivity'
