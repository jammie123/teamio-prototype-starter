import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'
import { Button } from '../Button'

export interface AdvertisementEmptyStateProps extends StyleProps {
  onCreateAdvertisement?: () => void
  onAdvertisementPreviewClick?: () => void
}

/**
 * Promotional empty state for a job that has no published advertisement yet.
 * Below md the CTAs sit to the right of the copy; from md they sit in a row under it.
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
        'tm-grid',
        'tm-w-full',
        'tm-grid-cols-[minmax(0,1fr)_auto]',
        'tm-items-center',
        'tm-gap-x-3',
        'tm-gap-y-1',
        'md:tm-grid-cols-1',
        'md:tm-items-start',
        'md:tm-gap-4',
        className,
      )}
    >
      <span
        data-testid="job-card-advertisement-empty-title"
        className="tm-col-start-1 tm-row-start-1 tm-min-w-0 tm-text-sm tm-font-semibold tm-leading-tight tm-text-primary-default"
      >
        Zatím neinzerujete
      </span>
      <p
        data-testid="job-card-advertisement-empty-body"
        className="tm-col-start-1 tm-row-start-2 tm-m-0 tm-min-w-0 tm-text-sm tm-text-primary-default"
      >
        Zkontrolujte náhled a publikujte. Kandidáti se ozvou rychle.
      </p>
      <div
        data-testid="job-card-advertisement-empty-actions"
        className="tm-col-start-2 tm-row-start-1 tm-row-span-2 tm-flex tm-shrink-0 tm-flex-row tm-gap-2 tm-self-center md:tm-col-start-1 md:tm-row-start-3 md:tm-row-span-1 md:tm-w-full"
      >
        <Button
          variant="secondary"
          data-testid="job-card-advertisement-empty-preview"
          className="tm-whitespace-nowrap"
          onClick={onAdvertisementPreviewClick}
        >
          Zobrazit náhled
        </Button>
        <Button
          variant="primary"
          data-testid="job-card-advertisement-empty-publish"
          className="tm-whitespace-nowrap"
          onClick={onCreateAdvertisement}
        >
          Publikovat
        </Button>
      </div>
    </div>
  )
}

AdvertisementEmptyState.displayName = 'AdvertisementEmptyState'
