import { useState, type ReactNode } from 'react'
import type { StyleProps } from '../../lib/types'
import type { ModalProps } from '../Modal'
import { JobAdvertisementChoiceCard } from './JobAdvertisementChoiceCard'
import { JobModalFrame } from './JobModalFrame'
import { JOB_MODAL_COPY } from './jobModalCopy'
import type { JobModalAdvertisement } from './types'

export interface JobModalChooseAdsProps extends StyleProps {
  open?: ModalProps['open']
  defaultOpen?: ModalProps['defaultOpen']
  onOpenChange?: ModalProps['onOpenChange']
  title?: string
  confirmLabel?: string
  cancelLabel?: string
  trigger?: ReactNode
  advertisements: JobModalAdvertisement[]
  selectedAdvertisementIds?: string[]
  defaultSelectedAdvertisementIds?: string[]
  onSelectedAdvertisementIdsChange?: (advertisementIds: string[]) => void
  onConfirm?: (advertisementIds: string[]) => void
}

function toggleId(ids: string[], id: string) {
  return ids.includes(id) ? ids.filter((item) => item !== id) : [...ids, id]
}

export function JobModalChooseAds({
  open,
  defaultOpen,
  onOpenChange,
  title = JOB_MODAL_COPY.chooseAds.title,
  confirmLabel = JOB_MODAL_COPY.chooseAds.confirm,
  cancelLabel,
  trigger,
  advertisements,
  selectedAdvertisementIds,
  defaultSelectedAdvertisementIds,
  onSelectedAdvertisementIdsChange,
  onConfirm,
  className,
}: JobModalChooseAdsProps) {
  const isControlled = selectedAdvertisementIds !== undefined
  const [uncontrolledIds, setUncontrolledIds] = useState<string[]>(
    () => defaultSelectedAdvertisementIds ?? [],
  )
  const selectedIds = isControlled ? selectedAdvertisementIds : uncontrolledIds

  function toggle(id: string) {
    const next = toggleId(selectedIds, id)
    if (!isControlled) {
      setUncontrolledIds(next)
    }
    onSelectedAdvertisementIdsChange?.(next)
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
      onConfirm={() => {
        if (selectedIds.length > 0) {
          onConfirm?.(selectedIds)
        }
      }}
      className={className}
    >
      {advertisements.map((advertisement) => (
        <JobAdvertisementChoiceCard
          key={advertisement.id}
          advertisement={advertisement}
          checked={selectedIds.includes(advertisement.id)}
          onSelect={toggle}
        />
      ))}
    </JobModalFrame>
  )
}

JobModalChooseAds.displayName = 'JobModalChooseAds'
