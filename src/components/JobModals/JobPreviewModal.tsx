import * as DialogPrimitive from '@radix-ui/react-dialog'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { cn } from '../../lib/cn'
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
          className="tm-flex tm-shrink-0 tm-flex-col tm-gap-3 tm-border-0 tm-border-b tm-border-solid tm-border-secondary tm-bg-basic tm-px-6 tm-py-4"
        >
          <div className="tm-flex tm-items-center tm-gap-6">
            <DialogPrimitive.Title
              className={cn(
                'tm-m-0',
                'tm-min-w-0',
                'tm-shrink',
                'tm-truncate',
                'tm-text-lg',
                'tm-font-semibold',
                'tm-font-inherit',
              )}
            >
              {jobTitle}
            </DialogPrimitive.Title>
            {active ? (
              <JobPreviewPublicationsList
                publications={publications}
                activeId={active.id}
                onSelect={handleSelect}
              />
            ) : null}
            <ModalClose asChild aria-label={JOB_PREVIEW_COPY.closeAriaLabel}>
              <Button variant="secondary" size="large" isCircle className="tm-ml-auto">
                <Icon name="x" className="tm-text-xl" />
              </Button>
            </ModalClose>
          </div>
          {active ? (
            <JobPreviewUrlBar url={active.url} onCopy={onCopyUrl} onPrint={onPrint} />
          ) : null}
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
