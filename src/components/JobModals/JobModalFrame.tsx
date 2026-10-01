import type { ReactNode } from 'react'
import type { StyleProps } from '../../lib/types'
import { Button } from '../Button'
import {
  Modal,
  ModalBody,
  ModalClose,
  ModalContent,
  ModalFooter,
  ModalTitle,
  ModalTrigger,
  type ModalProps,
  type ModalSize,
} from '../Modal'

export const JOB_MODAL_CANCEL_LABEL = 'Zrušit'
export const JOB_MODAL_CLOSE_ARIA_LABEL = 'Zavřít dialog'

export interface JobModalFrameProps extends StyleProps {
  open?: ModalProps['open']
  defaultOpen?: ModalProps['defaultOpen']
  onOpenChange?: ModalProps['onOpenChange']
  title: string
  children: ReactNode
  confirmLabel: string
  confirmDisabled?: boolean
  onConfirm?: () => void
  cancelLabel?: string
  trigger?: ReactNode
  size?: ModalSize
}

export function JobModalFrame({
  open,
  defaultOpen,
  onOpenChange,
  title,
  children,
  confirmLabel,
  confirmDisabled = false,
  onConfirm,
  cancelLabel = JOB_MODAL_CANCEL_LABEL,
  trigger,
  size = 'default',
  className,
}: JobModalFrameProps) {
  return (
    <Modal open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      {trigger ? <ModalTrigger asChild>{trigger}</ModalTrigger> : null}
      <ModalContent size={size} className={className}>
        <ModalTitle>{title}</ModalTitle>
        <ModalClose aria-label={JOB_MODAL_CLOSE_ARIA_LABEL} />
        <ModalBody className="tm-flex tm-min-h-0 tm-max-h-[calc(100vh-10rem)] tm-flex-col tm-gap-2 tm-overflow-y-auto tm-py-2">
          {children}
        </ModalBody>
        <ModalFooter className="tm-shrink-0 tm-bg-basic">
          <Button isDisabled={confirmDisabled} onClick={onConfirm}>
            {confirmLabel}
          </Button>
          <ModalClose asChild aria-label={cancelLabel}>
            <Button variant="secondary">{cancelLabel}</Button>
          </ModalClose>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

JobModalFrame.displayName = 'JobModalFrame'
