import { useEffect, useRef, useState } from 'react'
import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'
import { Button } from '../Button'
import { Icon } from '../Icon'
import { JOB_PREVIEW_COPY } from './jobPreviewCopy'

const COPIED_FEEDBACK_MS = 2000

export interface JobPreviewUrlBarProps extends StyleProps {
  url: string
  onCopy?: (url: string) => void
  /** Defaults to `window.print()`. */
  onPrint?: () => void
}

export function JobPreviewUrlBar({ url, onCopy, onPrint, className }: JobPreviewUrlBarProps) {
  const [copied, setCopied] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  // A different portal means a different URL: drop stale "copied" feedback.
  useEffect(() => {
    setCopied(false)
  }, [url])

  useEffect(() => () => clearTimeout(timeoutRef.current), [])

  async function handleCopy() {
    try {
      await navigator.clipboard?.writeText(url)
    } catch {
      // Clipboard may be unavailable (insecure context); feedback is still shown.
    }
    onCopy?.(url)
    setCopied(true)
    clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => setCopied(false), COPIED_FEEDBACK_MS)
  }

  return (
    <div
      data-testid="job-preview-url-bar"
      className={cn(
        'tm-flex',
        'tm-items-center',
        'tm-gap-2',
        'tm-rounded',
        'tm-border',
        'tm-border-primary',
        'tm-py-1',
        'tm-pl-4',
        'tm-pr-2',
        className,
      )}
    >
      <Icon name="link" className="tm-shrink-0 tm-text-lg tm-text-secondary-default" />
      <input
        type="text"
        readOnly
        value={url}
        aria-label={JOB_PREVIEW_COPY.urlAriaLabel}
        className="tm-min-w-0 tm-flex-1 tm-truncate tm-border-0 tm-bg-transparent tm-p-0 tm-font-poppins tm-text-sm tm-text-primary-default focus:tm-outline-0"
      />
      <Button variant="tertiary" onClick={handleCopy}>
        <Icon name={copied ? 'check' : 'copy'} />
        {copied ? JOB_PREVIEW_COPY.copied : JOB_PREVIEW_COPY.copyLink}
      </Button>
      <Button variant="tertiary" onClick={() => (onPrint ? onPrint() : window.print())}>
        <Icon name="print" />
        {JOB_PREVIEW_COPY.print}
      </Button>
    </div>
  )
}

JobPreviewUrlBar.displayName = 'JobPreviewUrlBar'
