import { useState } from 'react'
import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'
import { Button } from '../Button'
import { Icon } from '../Icon'
import { JobPortalLogo } from '../JobPortalLogo'
import {
  Modal,
  ModalBody,
  ModalClose,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalTitle,
} from '../Modal'
import { formatAdvertisementTimelineTimestamp } from './formatTimestamp'
import {
  ADVERTISEMENT_TIMELINE_CYCLE_HEADING,
  ADVERTISEMENT_TIMELINE_DETAIL_CLOSE_ARIA_LABEL,
  ADVERTISEMENT_TIMELINE_EMPTY_MESSAGE,
  ADVERTISEMENT_TIMELINE_ENDED_MANUAL_LABEL,
  ADVERTISEMENT_TIMELINE_EVENT_LABELS,
  type AdvertisementTimelineCycle,
  type AdvertisementTimelineEvent,
} from './types'

export interface AdvertisementTimelineProps extends StyleProps {
  events: AdvertisementTimelineEvent[]
  cycles: AdvertisementTimelineCycle[]
  openEventId?: string | null
  defaultOpenEventId?: string
  onOpenEventIdChange?: (id: string | null) => void
}

function sortEventsNewestFirst(events: AdvertisementTimelineEvent[]) {
  return [...events].sort((left, right) => {
    const timeDiff = Date.parse(right.occurredAt) - Date.parse(left.occurredAt)
    return timeDiff !== 0 ? timeDiff : left.id.localeCompare(right.id)
  })
}

function CycleDetail({ cycle }: { cycle: AdvertisementTimelineCycle }) {
  const endLabel =
    cycle.endedReason === 'manual'
      ? ADVERTISEMENT_TIMELINE_ENDED_MANUAL_LABEL
      : cycle.endedReason === 'expired'
        ? ADVERTISEMENT_TIMELINE_EVENT_LABELS.expired
        : null

  return (
    <dl className="tm-m-0 tm-flex tm-flex-col tm-gap-4">
      <div>
        <dt className="tm-text-sm tm-font-normal tm-text-secondary-default">
          {ADVERTISEMENT_TIMELINE_EVENT_LABELS.published}
        </dt>
        <dd className="tm-m-0 tm-mt-1 tm-font-normal">{formatAdvertisementTimelineTimestamp(cycle.publishedAt)}</dd>
      </div>
      {(cycle.tops ?? []).map((topAt) => (
        <div key={topAt}>
          <dt className="tm-text-sm tm-font-normal tm-text-secondary-default">
            {ADVERTISEMENT_TIMELINE_EVENT_LABELS.topped}
          </dt>
          <dd className="tm-m-0 tm-mt-1 tm-font-normal">{formatAdvertisementTimelineTimestamp(topAt)}</dd>
        </div>
      ))}
      {endLabel && cycle.endedAt ? (
        <div>
          <dt className="tm-text-sm tm-font-normal tm-text-secondary-default">{endLabel}</dt>
          <dd className="tm-m-0 tm-mt-1 tm-font-normal">{formatAdvertisementTimelineTimestamp(cycle.endedAt)}</dd>
        </div>
      ) : null}
    </dl>
  )
}

export function AdvertisementTimeline({
  events,
  cycles,
  openEventId,
  defaultOpenEventId,
  onOpenEventIdChange,
  className,
}: AdvertisementTimelineProps) {
  const isControlled = openEventId !== undefined
  const [uncontrolledId, setUncontrolledId] = useState<string | null>(defaultOpenEventId ?? null)
  const currentEventId = isControlled ? openEventId : uncontrolledId
  const cycleById = new Map(cycles.map((cycle) => [cycle.id, cycle]))
  const orderedEvents = sortEventsNewestFirst(events)
  const openEvent = orderedEvents.find((event) => event.id === currentEventId)
  const openCycle = openEvent ? cycleById.get(openEvent.cycleId) : undefined

  function setCurrentEventId(next: string | null) {
    if (!isControlled) {
      setUncontrolledId(next)
    }
    onOpenEventIdChange?.(next)
  }

  if (orderedEvents.length === 0) {
    return (
      <p className={cn('tm-m-0', 'tm-text-secondary-default', className)}>
        {ADVERTISEMENT_TIMELINE_EMPTY_MESSAGE}
      </p>
    )
  }

  return (
    <>
      <ol className={cn('tm-m-0', 'tm-list-none', 'tm-p-0', className)}>
        {orderedEvents.map((event, index) => {
          const cycle = cycleById.get(event.cycleId)
          const isOpen = currentEventId === event.id
          const isLast = index === orderedEvents.length - 1
          const label = ADVERTISEMENT_TIMELINE_EVENT_LABELS[event.type]
          const timestamp = formatAdvertisementTimelineTimestamp(event.occurredAt)

          return (
            <li key={event.id} className="tm-flex tm-gap-3">
              <div
                aria-hidden="true"
                className="tm-flex tm-w-[13px] tm-shrink-0 tm-flex-col tm-items-center"
              >
                <span
                  data-timeline-marker=""
                  className="tm-mt-0 tm-size-[13px] tm-rounded-full tm-border-2 tm-border-text-secondary-default tm-bg-transparent"
                />
                {isLast ? null : <span className="tm-w-px tm-grow tm-bg-cover-dark" />}
              </div>
              <button
                type="button"
                aria-haspopup="dialog"
                aria-expanded={isOpen}
                className={cn(
                  'tm-flex',
                  'tm-min-w-0',
                  'tm-flex-1',
                  'tm-items-start',
                  'tm-justify-between',
                  'tm-gap-3',
                  'tm-border-0',
                  'tm-bg-transparent',
                  'tm-px-0',
                  'tm-pt-0',
                  'tm-pb-3',
                  'tm-text-left',
                  'tm-font-poppins',
                  'tm-cursor-pointer',
                  'focus:tm-outline-0',
                  'focus-visible:tm-ring',
                )}
                onClick={() => setCurrentEventId(event.id)}
              >
                <span className="tm-flex tm-min-w-0 tm-flex-col tm-gap-1">
                  <span className="tm-text-base tm-font-medium tm-text-primary-default">{label}</span>
                  <time
                    className="tm-text-sm tm-font-normal tm-text-secondary-default"
                    dateTime={event.occurredAt}
                  >
                    {timestamp}
                  </time>
                  {cycle ? (
                    <span className="tm-flex tm-items-center tm-gap-2">
                      <JobPortalLogo
                        type={cycle.logoType}
                        title={cycle.portalName}
                        className="tm-size-4"
                      />
                      <span className="tm-text-sm tm-font-normal tm-text-secondary-default">
                        {cycle.portalName}
                      </span>
                    </span>
                  ) : null}
                </span>
                <Icon name="chevron-right" className="tm-mt-0.5 tm-text-base tm-text-secondary-default" />
              </button>
            </li>
          )
        })}
      </ol>

      <Modal
        open={openEvent != null && openCycle != null}
        onOpenChange={(open) => {
          if (!open) {
            setCurrentEventId(null)
          }
        }}
      >
        {openEvent && openCycle ? (
          <ModalContent className="tm-z-[60]" overlayClassName="tm-z-[60]">
            <ModalTitle>{ADVERTISEMENT_TIMELINE_CYCLE_HEADING}</ModalTitle>
            <ModalClose aria-label={ADVERTISEMENT_TIMELINE_DETAIL_CLOSE_ARIA_LABEL} />
            <ModalDescription>
              {ADVERTISEMENT_TIMELINE_EVENT_LABELS[openEvent.type]}
              {' · '}
              {openCycle.portalName}
              {' · '}
              {formatAdvertisementTimelineTimestamp(openEvent.occurredAt)}
            </ModalDescription>
            <ModalBody className="tm-py-4">
              <CycleDetail cycle={openCycle} />
            </ModalBody>
            <ModalFooter>
              <ModalClose asChild aria-label="Zavřít">
                <Button variant="secondary">Zavřít</Button>
              </ModalClose>
            </ModalFooter>
          </ModalContent>
        ) : null}
      </Modal>
    </>
  )
}

AdvertisementTimeline.displayName = 'AdvertisementTimeline'
