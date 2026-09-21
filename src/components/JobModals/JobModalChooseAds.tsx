import { useId, useState, type ReactNode } from 'react'
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
  selectedAdvertisementId?: string
  onSelectedAdvertisementIdChange?: (advertisementId: string) => void
  onConfirm?: (advertisementId: string) => void
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
  selectedAdvertisementId,
  onSelectedAdvertisementIdChange,
  onConfirm,
  className,
}: JobModalChooseAdsProps) {
  const radioName = useId()
  const isControlled = selectedAdvertisementId !== undefined
  const [uncontrolledId, setUncontrolledId] = useState<string | undefined>(undefined)
  const selectedId = isControlled ? selectedAdvertisementId : uncontrolledId

  function select(id: string) {
    if (!isControlled) {
      setUncontrolledId(id)
    }
    onSelectedAdvertisementIdChange?.(id)
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
      confirmDisabled={!selectedId}
      onConfirm={() => {
        if (selectedId) {
          onConfirm?.(selectedId)
        }
      }}
      className={className}
    >
      {advertisements.map((advertisement) => (
        <JobAdvertisementChoiceCard
          key={advertisement.id}
          advertisement={advertisement}
          name={radioName}
          checked={selectedId === advertisement.id}
          onSelect={select}
        />
      ))}
    </JobModalFrame>
  )
}

JobModalChooseAds.displayName = 'JobModalChooseAds'
