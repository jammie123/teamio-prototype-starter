import * as DialogPrimitive from '@radix-ui/react-dialog'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import type { StyleProps } from '../../lib/types'
import { Button } from '../Button'
import { Icon } from '../Icon'
import { Modal, ModalClose, ModalContent, ModalTrigger, type ModalProps } from '../Modal'
import { JOB_PREVIEW_COPY } from './jobPreviewCopy'
import { JobPreviewPublicationsList } from './JobPreviewPublicationsList'
import { JobPreviewUrlBar } from './JobPreviewUrlBar'
import type { JobPreviewPublication } from './types'

export interface JobPreviewModalProps extends StyleProps {
  open?: ModalProps['open']
  defaultOpen?: ModalProps['defaultOpen']
  onOpenChange?: ModalProps['onOpenChange']
  trigger?: ReactNode
  /** Position name shown in the fixed header. */
  jobTitle: string
  /** Portals where the advertisement is published. */
  publications: JobPreviewPublication[]
  /** Controlled active publication id. */
  activeId?: string
  /** Initial active publication id (uncontrolled); defaults to the first publication. */
  defaultActiveId?: string
  onActiveChange?: (id: string) => void
  /** Renders the advertisement preview for the active publication. */
  renderPreview: (publication: JobPreviewPublication) => ReactNode
  onCopyUrl?: (url: string) => void
  /** Defaults to `window.print()`. */
  onPrint?: () => void
}

export function JobPreviewModal({
  open,
  defaultOpen,
  onOpenChange,
  trigger,
  jobTitle,
  publications,
  activeId: activeIdProp,
  defaultActiveId,
  onActiveChange,
  renderPreview,
  onCopyUrl,
  onPrint,
  className,
}: JobPreviewModalProps) {
  const [internalActiveId, setInternalActiveId] = useState(defaultActiveId)
  const bodyRef = useRef<HTMLDivElement>(null)

  const requestedId = activeIdProp ?? internalActiveId
  // One publication is always active: fall back to the first when the id is missing or unknown.
  const active = publications.find((p) => p.id === requestedId) ?? publications[0]

  useEffect(() => {
    bodyRef.current?.scrollTo?.({ top: 0 })
  }, [active?.id])

  function handleSelect(id: string) {
    if (activeIdProp === undefined) {
      setInternalActiveId(id)
    }
    onActiveChange?.(id)
  }

  return (
    <Modal open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      {trigger ? <ModalTrigger asChild>{trigger}</ModalTrigger> : null}
      <ModalContent size="fullscreen" className={className} aria-describedby={undefined}>
        <header
          data-testid="job-preview-header"
          className="tm-relative tm-shrink-0 tm-border-0 tm-border-b tm-border-solid tm-border-secondary tm-bg-basic tm-px-18 tm-py-4"
        >
          {/* Visually hidden: keeps the dialog's accessible name without a visible heading. */}
          <DialogPrimitive.Title className="tm-sr-only">{jobTitle}</DialogPrimitive.Title>
          {/* Same max width as the preview article; Close stays in the header's right corner. */}
          <div className="tm-mx-auto tm-flex tm-w-full tm-max-w-[920px] tm-items-center tm-gap-4">
            {active ? (
              <>
                <JobPreviewPublicationsList
                  publications={publications}
                  activeId={active.id}
                  onSelect={handleSelect}
                />
                <JobPreviewUrlBar
                  url={active.url}
                  onCopy={onCopyUrl}
                  onPrint={onPrint}
                  className="tm-h-12 tm-min-w-0 tm-flex-1"
                />
              </>
            ) : (
              <span className="tm-h-12" aria-hidden="true" />
            )}
          </div>
          <ModalClose asChild aria-label={JOB_PREVIEW_COPY.closeAriaLabel}>
            <Button
              variant="tertiary"
              size="large"
              isCircle
              className="tm-absolute tm-right-4 tm-top-1/2 tm--translate-y-1/2"
            >
              <Icon name="x" className="tm-text-xl" />
            </Button>
          </ModalClose>
        </header>
        <div
          ref={bodyRef}
          data-testid="job-preview-body"
          className="tm-flex tm-min-h-0 tm-flex-1 tm-justify-center tm-overflow-auto tm-bg-cover-dark tm-px-6 tm-py-8"
        >
          {active ? (
            <article
              key={active.id}
              data-testid="job-preview-article"
              className="tm-h-fit tm-w-full tm-max-w-[920px] tm-rounded tm-bg-basic tm-shadow"
            >
              {renderPreview(active)}
            </article>
          ) : null}
        </div>
      </ModalContent>
    </Modal>
  )
}

JobPreviewModal.displayName = 'JobPreviewModal'
