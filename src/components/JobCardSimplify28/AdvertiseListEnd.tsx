import { useId, useState, type ReactNode } from 'react'
import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'
import { Icon } from '../Icon'
import { channelLogoPresentationClass } from '../JobCardSyntezaAds/JobCardPublicationPortal'
import { JobPortalLogo, jobPortalLogoTypeFromChannel } from '../JobPortalLogo'
import { JOB_CARD_SIMPLIFY_28_CHANNEL_LOGO_SIZE } from './constants'

export interface AdvertiseListEndProps extends StyleProps {
  channels: string[]
  title: string
  children: ReactNode
  defaultExpanded?: boolean
}

export function AdvertiseListEnd({
  channels,
  title,
  children,
  defaultExpanded = false,
  className,
}: AdvertiseListEndProps) {
  const [expanded, setExpanded] = useState(defaultExpanded)
  const listId = useId()

  return (
    <div
      data-testid="advertise-list-end"
      data-expanded={expanded ? 'true' : 'false'}
      className={cn('tm-flex tm-flex-col tm-gap-2', className)}
    >
      <button
        type="button"
        data-testid="advertise-list-end-toggle"
        aria-expanded={expanded}
        aria-controls={listId}
        className="tm-flex tm-w-full tm-items-center tm-gap-2 tm-border-0 tm-bg-transparent tm-p-0 tm-text-left"
        onClick={(event) => {
          event.preventDefault()
          event.stopPropagation()
          setExpanded((current) => !current)
        }}
      >
        {channels.length > 0 ? (
          <ul className="tm-m-0 tm-flex tm-list-none tm-items-center tm-p-0">
            {channels.map((channel, index) => (
              <li
                key={`${channel}-${index}`}
                className={cn('tm-relative', index > 0 && '-tm-ml-2')}
                style={{ zIndex: index + 1 }}
              >
                <JobPortalLogo
                  type={jobPortalLogoTypeFromChannel(channel)}
                  title=""
                  className={cn(
                    channelLogoPresentationClass(JOB_CARD_SIMPLIFY_28_CHANNEL_LOGO_SIZE),
                    'tm-ring-2 tm-ring-white',
                  )}
                />
              </li>
            ))}
          </ul>
        ) : null}
        <span className="tm-min-w-0 tm-flex-1 tm-text-sm tm-font-medium tm-text-primary-default">
          {title}
        </span>
        <Icon
          name="chevron-down"
          className={cn('tm-shrink-0 tm-text-secondary-default', !expanded && '-tm-rotate-90')}
        />
      </button>
      {expanded ? (
        <ul
          id={listId}
          data-testid="advertise-list-end-items"
          className="tm-m-0 tm-flex tm-list-none tm-flex-col tm-gap-2 tm-p-0"
        >
          {children}
        </ul>
      ) : null}
    </div>
  )
}

AdvertiseListEnd.displayName = 'AdvertiseListEnd'
