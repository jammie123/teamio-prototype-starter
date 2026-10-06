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
import {
  formatAdvertisedFrom,
  formatNewPeriod,
  placeStatusLabel,
  resolvePlaceRunStatus,
  resolveProlongConfirmLabel,
  sortPlacesByOldestAdvertised,
} from './jobModalPlaces'
import { formatPlacesSummary, summarizeSelectedPlaces } from './jobModalSummary'
import type { JobModalAdvertisementSection, JobModalPublicationPlace } from './types'

export type JobModalPlacesTableVariant = 'default' | 'unpublish' | 'prolong'

/** Fixed widths so stacked advertisement tables keep the same column grid. */
const PLACE_COLUMN_CLASS = {
  select: 'tm-w-10',
  name: 'tm-w-56',
  advertised: 'tm-w-48',
  newPeriod: 'tm-w-52',
  cost: 'tm-w-40',
} as const

export interface JobModalActionPlacesProps extends StyleProps {
  open?: ModalProps['open']
  defaultOpen?: ModalProps['defaultOpen']
  onOpenChange?: ModalProps['onOpenChange']
  title: string
  confirmLabel?: string
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
  hideCostColumn?: boolean
  placesTableVariant?: JobModalPlacesTableVariant
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

function statusToneClass(status: ReturnType<typeof resolvePlaceRunStatus>) {
  if (status === 'running') {
    return 'tm-text-emotion-success-emphasis'
  }

  if (status === 'endingSoon') {
    return 'tm-text-emotion-warning-emphasis'
  }

  return 'tm-text-secondary-default'
}

function PlaceRow({
  place,
  selectedIds,
  onToggle,
  hideCostColumn = false,
  placesTableVariant = 'default',
  isLast = false,
}: {
  place: JobModalPublicationPlace
  selectedIds: string[]
  onToggle: (id: string) => void
  hideCostColumn?: boolean
  placesTableVariant?: JobModalPlacesTableVariant
  isLast?: boolean
}) {
  const logoType = place.logoType ?? jobPortalLogoTypeFromChannel(place.name)
  const cost = formatPlaceCost(place)
  const checked = selectedIds.includes(place.id)
  const isProlong = placesTableVariant === 'prolong'
  const showAdvertisedFrom = placesTableVariant !== 'default'
  const runStatus = resolvePlaceRunStatus(place)
  const showStatus = showAdvertisedFrom && runStatus !== 'never'
  const newPeriod = isProlong ? formatNewPeriod(place) : undefined
  const cellClass = cn('tm-px-2 tm-py-1.5', isLast && '!tm-border-b-0')

  return (
    <TableRow
      data-testid="job-modal-place-row"
      className="tm-cursor-pointer"
      onClick={() => onToggle(place.id)}
    >
      <TableCell className={cn(cellClass, PLACE_COLUMN_CLASS.select)}>
        <Checkbox
          checked={checked}
          aria-label={place.name}
          onChange={() => onToggle(place.id)}
          onClick={(event) => event.stopPropagation()}
        />
      </TableCell>
      <TableCell className={cn(cellClass, PLACE_COLUMN_CLASS.name)}>
        <span className="tm-inline-flex tm-min-w-0 tm-items-center tm-gap-2">
          <JobPortalLogo type={logoType} title="" className="tm-size-5 tm-shrink-0" />
          <span className="tm-min-w-0 tm-truncate tm-text-sm tm-font-medium tm-leading-tight tm-text-primary-default">
            {place.name}
          </span>
        </span>
      </TableCell>
      <TableCell
        className={cn(
          cellClass,
          PLACE_COLUMN_CLASS.advertised,
          'tm-text-13 tm-whitespace-nowrap tm-text-secondary-default',
        )}
      >
        <span className="tm-flex tm-flex-col tm-gap-0.5">
          <span
            data-testid={showAdvertisedFrom ? 'job-modal-place-advertised-from' : undefined}
            className="tm-tabular-nums tm-leading-tight"
          >
            {showAdvertisedFrom
              ? formatAdvertisedFrom(place)
              : formatPublicationRange(place.startDate ?? '', place.endDate)}
          </span>
          {showStatus ? (
            <span
              data-testid="job-modal-place-status"
              className={cn('tm-leading-tight', statusToneClass(runStatus))}
            >
              {placeStatusLabel(runStatus)}
            </span>
          ) : null}
        </span>
      </TableCell>
      {isProlong && newPeriod ? (
        <TableCell
          data-testid="job-modal-place-new-period"
          className={cn(cellClass, PLACE_COLUMN_CLASS.newPeriod)}
        >
          <span className="tm-flex tm-flex-col tm-gap-0.5">
            <span className="tm-text-13 tm-font-medium tm-leading-tight tm-text-primary-default">
              {newPeriod.title}
            </span>
            <span className="tm-text-13 tm-tabular-nums tm-leading-tight tm-text-secondary-default">
              {newPeriod.range}
            </span>
          </span>
        </TableCell>
      ) : null}
      {hideCostColumn ? null : (
        <TableCell className={cn(cellClass, PLACE_COLUMN_CLASS.cost, 'tm-text-13 tm-text-primary-default')}>
          {cost || '–'}
        </TableCell>
      )}
    </TableRow>
  )
}

function PlacesTable({
  places,
  additionalPlaces = [],
  additionalOpen = false,
  selectedIds,
  onToggle,
  onToggleVisible,
  hideCostColumn = false,
  placesTableVariant = 'default',
}: {
  places: JobModalPublicationPlace[]
  additionalPlaces?: JobModalPublicationPlace[]
  additionalOpen?: boolean
  selectedIds: string[]
  onToggle: (id: string) => void
  onToggleVisible: (placeIds: string[]) => void
  hideCostColumn?: boolean
  placesTableVariant?: JobModalPlacesTableVariant
}) {
  const isProlong = placesTableVariant === 'prolong'
  const dateColumnLabel =
    placesTableVariant === 'default'
      ? JOB_MODAL_COPY.columns.publication
      : JOB_MODAL_COPY.columns.advertisedFrom
  const visiblePlaces =
    placesTableVariant === 'default' ? places : sortPlacesByOldestAdvertised(places)
  const visibleAdditionalPlaces =
    placesTableVariant === 'default' ? additionalPlaces : sortPlacesByOldestAdvertised(additionalPlaces)
  const renderedPlaces = additionalOpen
    ? [...visiblePlaces, ...visibleAdditionalPlaces]
    : visiblePlaces
  const lastPlaceId = renderedPlaces.at(-1)?.id
  const visibleIds = renderedPlaces.map((place) => place.id)
  const visibleSelectedCount = visibleIds.filter((id) => selectedIds.includes(id)).length
  const allVisibleSelected = visibleIds.length > 0 && visibleSelectedCount === visibleIds.length
  const someVisibleSelected = visibleSelectedCount > 0 && !allVisibleSelected
  const headerClass = 'tm-px-2 tm-py-1.5 tm-text-13 tm-font-medium !tm-border-b-0'

  return (
    <Table data-testid="job-modal-places-table" className="tm-w-full tm-table-fixed tm-text-sm">
      <colgroup>
        <col className={PLACE_COLUMN_CLASS.select} />
        <col className={PLACE_COLUMN_CLASS.name} />
        <col className={PLACE_COLUMN_CLASS.advertised} />
        {isProlong ? <col className={PLACE_COLUMN_CLASS.newPeriod} /> : null}
        {hideCostColumn ? null : <col className={PLACE_COLUMN_CLASS.cost} />}
      </colgroup>
      <TableHead>
        <TableRow>
          <TableHeader className={cn(headerClass, PLACE_COLUMN_CLASS.select)}>
            <Checkbox
              checked={allVisibleSelected}
              indeterminate={someVisibleSelected}
              aria-label={JOB_MODAL_COPY.selectVisible}
              onChange={() => onToggleVisible(visibleIds)}
              onClick={(event) => event.stopPropagation()}
            />
          </TableHeader>
          <TableHeader className={cn(headerClass, PLACE_COLUMN_CLASS.name)}>
            {JOB_MODAL_COPY.columns.placeName}
          </TableHeader>
          <TableHeader className={cn(headerClass, PLACE_COLUMN_CLASS.advertised, 'tm-whitespace-nowrap')}>
            {dateColumnLabel}
          </TableHeader>
          {isProlong ? (
            <TableHeader className={cn(headerClass, PLACE_COLUMN_CLASS.newPeriod, 'tm-whitespace-nowrap')}>
              {JOB_MODAL_COPY.columns.newPeriod}
            </TableHeader>
          ) : null}
          {hideCostColumn ? null : (
            <TableHeader className={cn(headerClass, PLACE_COLUMN_CLASS.cost)}>
              {JOB_MODAL_COPY.columns.cost}
            </TableHeader>
          )}
        </TableRow>
      </TableHead>
      <TableBody>
        {visiblePlaces.map((place) => (
          <PlaceRow
            key={place.id}
            place={place}
            selectedIds={selectedIds}
            onToggle={onToggle}
            hideCostColumn={hideCostColumn}
            placesTableVariant={placesTableVariant}
            isLast={place.id === lastPlaceId}
          />
        ))}
        {additionalOpen
          ? visibleAdditionalPlaces.map((place) => (
              <PlaceRow
                key={place.id}
                place={place}
                selectedIds={selectedIds}
                onToggle={onToggle}
                hideCostColumn={hideCostColumn}
                placesTableVariant={placesTableVariant}
                isLast={place.id === lastPlaceId}
              />
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
  hideCostColumn = false,
  placesTableVariant = 'default',
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

  const allPlaces = sections.flatMap((section) => [
    ...section.places,
    ...(section.additionalPlaces ?? []),
  ])
  const selectedPlaces = allPlaces.filter((place) => selectedIds.includes(place.id))
  const resolvedConfirmLabel =
    confirmLabel ??
    (placesTableVariant === 'prolong'
      ? resolveProlongConfirmLabel(selectedPlaces)
      : JOB_MODAL_COPY.unpublish.confirm)

  const showSummary = placesTableVariant !== 'unpublish'
  const summary = showSummary
    ? formatPlacesSummary({
        ...summarizeSelectedPlaces(sections, selectedIds),
        hideCost: hideCostColumn,
      })
    : undefined

  function toggleVisiblePlaces(placeIds: string[]) {
    const allSelected = placeIds.length > 0 && placeIds.every((id) => selectedIds.includes(id))
    if (allSelected) {
      setSelectedIds(selectedIds.filter((id) => !placeIds.includes(id)))
      return
    }

    setSelectedIds([...new Set([...selectedIds, ...placeIds])])
  }

  return (
    <JobModalFrame
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      title={title}
      confirmLabel={resolvedConfirmLabel}
      cancelLabel={cancelLabel}
      trigger={trigger}
      size="wide"
      confirmDisabled={selectedIds.length === 0}
      onConfirm={() => onConfirm?.(selectedIds)}
      footerEnd={
        showSummary ? <span data-testid="job-modal-places-summary">{summary}</span> : undefined
      }
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
              onToggleVisible={toggleVisiblePlaces}
              hideCostColumn={hideCostColumn}
              placesTableVariant={placesTableVariant}
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
