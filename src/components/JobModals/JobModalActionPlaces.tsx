import { useState, type ReactNode } from 'react'
import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'
import { Checkbox } from '../Checkbox'
import { Divider } from '../Divider'
import { formatPublicationRange } from '../JobCardSynteza/advertisementSummary'
import { JobPortalLogo, jobPortalLogoTypeFromChannel } from '../JobPortalLogo'
import { Link } from '../Link'
import type { ModalProps } from '../Modal'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../Table'
import { JobModalFrame } from './JobModalFrame'
import { JOB_MODAL_COPY } from './jobModalCopy'
import type { JobModalAdvertisementSection, JobModalPublicationPlace } from './types'

export interface JobModalActionPlacesProps extends StyleProps {
  open?: ModalProps['open']
  defaultOpen?: ModalProps['defaultOpen']
  onOpenChange?: ModalProps['onOpenChange']
  title: string
  confirmLabel: string
  cancelLabel?: string
  trigger?: ReactNode
  places?: JobModalPublicationPlace[]
  advertisementSections?: JobModalAdvertisementSection[]
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

function resolveSections(
  places: JobModalPublicationPlace[],
  additionalPlaces: JobModalPublicationPlace[],
  advertisementSections?: JobModalAdvertisementSection[],
): JobModalAdvertisementSection[] {
  if (advertisementSections && advertisementSections.length > 0) {
    return advertisementSections
  }

  return [
    {
      advertisement: { id: '', title: '', createdAt: '' },
      places,
      additionalPlaces,
    },
  ]
}

function formatPlaceCost(place: JobModalPublicationPlace) {
  const parts: string[] = []
  if (place.priceLabel) {
    parts.push(place.priceLabel)
  }
  if (place.credits != null) {
    parts.push(`${place.credits} kreditů`)
  }
  return parts.join(' · ')
}

function PlaceRow({
  place,
  selectedIds,
  onToggle,
}: {
  place: JobModalPublicationPlace
  selectedIds: string[]
  onToggle: (id: string) => void
}) {
  const logoType = place.logoType ?? jobPortalLogoTypeFromChannel(place.name)
  const cost = formatPlaceCost(place)
  const checked = selectedIds.includes(place.id)

  return (
    <TableRow
      data-testid="job-modal-place-row"
      className="tm-cursor-pointer"
      onClick={() => onToggle(place.id)}
    >
      <TableCell className="tm-px-2 tm-py-1.5">
        <Checkbox
          checked={checked}
          aria-label={place.name}
          onChange={() => onToggle(place.id)}
          onClick={(event) => event.stopPropagation()}
        />
      </TableCell>
      <TableCell className="tm-px-2 tm-py-1.5">
        <span className="tm-inline-flex tm-items-center tm-gap-2">
          <JobPortalLogo type={logoType} title="" className="tm-size-5" />
          <span className="tm-flex tm-min-w-0 tm-flex-col tm-gap-0.5">
            <span className="tm-text-sm tm-font-medium tm-leading-tight tm-text-primary-default">
              {place.name}
            </span>
            {place.description ? (
              <span className="tm-text-13 tm-leading-tight tm-text-secondary-default">
                {place.description}
              </span>
            ) : null}
          </span>
        </span>
      </TableCell>
      <TableCell className="tm-px-2 tm-py-1.5 tm-text-13 tm-tabular-nums tm-whitespace-nowrap tm-text-secondary-default">
        {formatPublicationRange(place.startDate, place.endDate)}
      </TableCell>
      <TableCell className="tm-px-2 tm-py-1.5 tm-text-13 tm-text-primary-default">
        {cost || '–'}
      </TableCell>
    </TableRow>
  )
}

function PlacesTable({
  places,
  additionalPlaces = [],
  additionalOpen = false,
  selectedIds,
  onToggle,
}: {
  places: JobModalPublicationPlace[]
  additionalPlaces?: JobModalPublicationPlace[]
  additionalOpen?: boolean
  selectedIds: string[]
  onToggle: (id: string) => void
}) {
  return (
    <Table data-testid="job-modal-places-table" className="tm-text-sm">
      <TableHead>
        <TableRow>
          <TableHeader className="tm-w-10 tm-px-2 tm-py-1.5 tm-text-13 tm-font-medium">
            <span className="tm-sr-only">Vybrat</span>
          </TableHeader>
          <TableHeader className="tm-px-2 tm-py-1.5 tm-text-13 tm-font-medium">
            Název místa
          </TableHeader>
          <TableHeader className="tm-px-2 tm-py-1.5 tm-text-13 tm-font-medium tm-whitespace-nowrap">
            Vystavení
          </TableHeader>
          <TableHeader className="tm-px-2 tm-py-1.5 tm-text-13 tm-font-medium">
            Cena
          </TableHeader>
        </TableRow>
      </TableHead>
      <TableBody>
        {places.map((place) => (
          <PlaceRow key={place.id} place={place} selectedIds={selectedIds} onToggle={onToggle} />
        ))}
        {additionalOpen
          ? additionalPlaces.map((place) => (
              <PlaceRow key={place.id} place={place} selectedIds={selectedIds} onToggle={onToggle} />
            ))
          : null}
      </TableBody>
    </Table>
  )
}

export function JobModalActionPlaces({
  open,
  defaultOpen,
  onOpenChange,
  title,
  confirmLabel,
  cancelLabel,
  trigger,
  places = [],
  advertisementSections,
  additionalPlaces = [],
  additionalPlacesLabel = JOB_MODAL_COPY.prolong.showAdditionalPlaces,
  additionalPlacesHideLabel = JOB_MODAL_COPY.prolong.hideAdditionalPlaces,
  selectedPlaceIds,
  defaultSelectedPlaceIds,
  onSelectedPlaceIdsChange,
  onConfirm,
  className,
}: JobModalActionPlacesProps) {
  const sections = resolveSections(places, additionalPlaces, advertisementSections)
  const isControlled = selectedPlaceIds !== undefined
  const [uncontrolledIds, setUncontrolledIds] = useState(
    () => defaultSelectedPlaceIds ?? sections.flatMap((section) => section.places.map((place) => place.id)),
  )
  const [openAdditionalBySection, setOpenAdditionalBySection] = useState<Record<string, boolean>>({})
  const selectedIds = isControlled ? selectedPlaceIds : uncontrolledIds

  function setSelectedIds(next: string[]) {
    if (!isControlled) {
      setUncontrolledIds(next)
    }
    onSelectedPlaceIdsChange?.(next)
  }

  function togglePlace(id: string) {
    setSelectedIds(toggleId(selectedIds, id))
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
      size="wide"
      confirmDisabled={selectedIds.length === 0}
      onConfirm={() => onConfirm?.(selectedIds)}
      className={className}
    >
      {sections.map((section, index) => {
        const sectionKey = section.advertisement.id || `untitled-${index}`
        const extraPlaces = section.additionalPlaces ?? []
        const hasAdditionalPlaces = extraPlaces.length > 0
        const additionalOpen = Boolean(openAdditionalBySection[sectionKey])

        return (
          <div
            key={sectionKey}
            data-testid="job-modal-advertisement-section"
            className={cn('tm-flex tm-flex-col tm-gap-2', index > 0 && 'tm-pt-2')}
          >
            {section.advertisement.title ? (
              <h3
                data-testid="job-modal-advertisement-title"
                className="tm-m-0 tm-text-sm tm-font-semibold tm-text-primary-default"
              >
                {section.advertisement.title}
              </h3>
            ) : null}
            <PlacesTable
              places={section.places}
              additionalPlaces={extraPlaces}
              additionalOpen={additionalOpen}
              selectedIds={selectedIds}
              onToggle={togglePlace}
            />
            {hasAdditionalPlaces ? (
              <div
                data-testid="job-modal-additional-places"
                className="tm-flex tm-shrink-0 tm-items-center tm-gap-3 tm-py-1"
              >
                <Divider className="tm-min-w-0 tm-flex-1" />
                <Link
                  variant="secondary"
                  className="tm-shrink-0 tm-text-sm"
                  aria-expanded={additionalOpen}
                  onClick={() =>
                    setOpenAdditionalBySection((current) => ({
                      ...current,
                      [sectionKey]: !current[sectionKey],
                    }))
                  }
                >
                  {additionalOpen ? additionalPlacesHideLabel : additionalPlacesLabel}
                </Link>
                <Divider className="tm-min-w-0 tm-flex-1" />
              </div>
            ) : null}
          </div>
        )
      })}
    </JobModalFrame>
  )
}

JobModalActionPlaces.displayName = 'JobModalActionPlaces'
