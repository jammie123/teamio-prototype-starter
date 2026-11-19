import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'
import { Button } from '../Button'

export interface AdvertisementEmptyStateProps extends StyleProps {
  onCreateAdvertisement?: () => void
  onAdvertisementPreviewClick?: () => void
}

/**
 * Promotional empty state for a job that has no published advertisement yet.
 * Copy stacks above the CTAs so the block fits the full-width mobile ads column.
 */
export function AdvertisementEmptyState({
  onCreateAdvertisement,
  onAdvertisementPreviewClick,
  className,
}: AdvertisementEmptyStateProps) {
  return (
    <div
      data-testid="job-card-no-advertisement"
      className={cn(
        'tm-flex',
        'tm-w-full',
        'tm-flex-col',
        'tm-items-start',
        'tm-gap-4',
        className,
      )}
    >
      <div className="tm-flex tm-min-w-0 tm-flex-col tm-gap-1">
        <span
          data-testid="job-card-advertisement-empty-title"
          className="tm-min-w-0 tm-text-sm tm-font-semibold tm-leading-tight tm-text-primary-default"
        >
          Zatím neinzerujete
        </span>
        <p
          data-testid="job-card-advertisement-empty-body"
          className="tm-m-0 tm-min-w-0 tm-text-sm tm-text-primary-default"
        >
          Zkontrolujte náhled a publikujte. Kandidáti se ozvou rychle.
        </p>
      </div>
      <div
        data-testid="job-card-advertisement-empty-actions"
        className="tm-flex tm-w-full tm-shrink-0 tm-flex-row tm-flex-wrap tm-gap-2"
      >
        <Button
          variant="secondary"
          size="small"
          data-testid="job-card-advertisement-empty-preview"
          className="tm-whitespace-nowrap !tm-min-h-7 !tm-px-3"
          onClick={onAdvertisementPreviewClick}
        >
          Zobrazit náhled
        </Button>
        <Button
          variant="primary"
          size="small"
          data-testid="job-card-advertisement-empty-publish"
          className="tm-whitespace-nowrap !tm-min-h-7 !tm-px-3"
          onClick={onCreateAdvertisement}
        >
          Publikovat
        </Button>
      </div>
    </div>
  )
}

AdvertisementEmptyState.displayName = 'AdvertisementEmptyState'
