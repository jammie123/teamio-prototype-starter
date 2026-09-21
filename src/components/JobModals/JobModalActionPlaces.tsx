import { useState, type ReactNode } from 'react'
import type { StyleProps } from '../../lib/types'
import { Divider } from '../Divider'
import { Link } from '../Link'
import type { ModalProps } from '../Modal'
import { JobModalFrame } from './JobModalFrame'
import { JobPublicationPlaceCard } from './JobPublicationPlaceCard'
import { JOB_MODAL_COPY } from './jobModalCopy'
import type { JobModalPublicationPlace } from './types'

export interface JobModalActionPlacesProps extends StyleProps {
  open?: ModalProps['open']
  defaultOpen?: ModalProps['defaultOpen']
  onOpenChange?: ModalProps['onOpenChange']
  title: string
  confirmLabel: string
  cancelLabel?: string
  trigger?: ReactNode
  places: JobModalPublicationPlace[]
  additionalPlaces?: JobModalPublicationPlace[]
  additionalPlacesLabel?: string
  additionalPlacesHideLabel?: string
  selectedPlaceIds?: string[]
  defaultSelectedPlaceIds?: string[]
  onSelectedPlaceIdsChange?: (ids: string[]) => void
  onConfirm?: (selectedPlaceIds: string[]) => void
}

function toggleId(ids: string[], id: string) {
  return ids.includes(id) ? ids.filter((item) => item !== id) : [...ids, id]
}

export function JobModalActionPlaces({
  open,
  defaultOpen,
  onOpenChange,
  title,
  confirmLabel,
  cancelLabel,
  trigger,
  places,
  additionalPlaces = [],
  additionalPlacesLabel = JOB_MODAL_COPY.prolong.showAdditionalPlaces,
  additionalPlacesHideLabel = JOB_MODAL_COPY.prolong.hideAdditionalPlaces,
  selectedPlaceIds,
  defaultSelectedPlaceIds,
  onSelectedPlaceIdsChange,
  onConfirm,
  className,
}: JobModalActionPlacesProps) {
  const isControlled = selectedPlaceIds !== undefined
  const [uncontrolledIds, setUncontrolledIds] = useState(
    () => defaultSelectedPlaceIds ?? places.map((place) => place.id),
  )
  const [additionalPlacesOpen, setAdditionalPlacesOpen] = useState(false)
  const selectedIds = isControlled ? selectedPlaceIds : uncontrolledIds
  const hasAdditionalPlaces = additionalPlaces.length > 0

  function setSelectedIds(next: string[]) {
    if (!isControlled) {
      setUncontrolledIds(next)
    }
    onSelectedPlaceIdsChange?.(next)
  }

  return (
    <JobModalFrame
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      title={title}
      confirmLabel={confirmLabel}
      cancelLabel={cancelLabel}
      trigger={trigger}
      confirmDisabled={selectedIds.length === 0}
      onConfirm={() => onConfirm?.(selectedIds)}
      className={className}
    >
      {places.map((place) => (
        <JobPublicationPlaceCard
          key={place.id}
          place={place}
          checked={selectedIds.includes(place.id)}
          onCheckedChange={() => setSelectedIds(toggleId(selectedIds, place.id))}
        />
      ))}
      {hasAdditionalPlaces ? (
        <div
          data-testid="job-modal-additional-places"
          className="tm-flex tm-shrink-0 tm-items-center tm-gap-3 tm-py-1"
        >
          <Divider className="tm-min-w-0 tm-flex-1" />
          <Link
            variant="secondary"
            className="tm-shrink-0 tm-text-sm"
            aria-expanded={additionalPlacesOpen}
            onClick={() => setAdditionalPlacesOpen((isOpen) => !isOpen)}
          >
            {additionalPlacesOpen ? additionalPlacesHideLabel : additionalPlacesLabel}
          </Link>
          <Divider className="tm-min-w-0 tm-flex-1" />
        </div>
      ) : null}
      {hasAdditionalPlaces && additionalPlacesOpen
        ? additionalPlaces.map((place) => (
            <JobPublicationPlaceCard
              key={place.id}
              place={place}
              checked={selectedIds.includes(place.id)}
              onCheckedChange={() => setSelectedIds(toggleId(selectedIds, place.id))}
            />
          ))
        : null}
    </JobModalFrame>
  )
}

JobModalActionPlaces.displayName = 'JobModalActionPlaces'
