import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'
import { Button } from '../Button'

export interface AdvertisementEmptyStateProps extends StyleProps {
  onCreateAdvertisement?: () => void
}

/**
 * Promotional empty state for a job that has no published advertisement yet.
 * Below md the CTA sits to the right of the copy; from md the button is full width.
 */
export function AdvertisementEmptyState({
  onCreateAdvertisement,
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
        'tm-rounded-xl',
        'tm-bg-emotion-info-background',
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
        Relevantní kandidáti z našich portálů se na inzerát ozvou rychle.
      </p>
      {onCreateAdvertisement ? (
        <Button
          variant="primary"
          data-testid="job-card-advertisement-empty-publish"
          className="tm-col-start-2 tm-row-start-1 tm-row-span-2 tm-shrink-0 tm-self-center tm-whitespace-nowrap md:tm-col-start-1 md:tm-row-start-3 md:tm-row-span-1 md:tm-w-full"
          onClick={(event) => {
            event.preventDefault()
            event.stopPropagation()
            onCreateAdvertisement()
          }}
        >
          Vystavit inzerát
        </Button>
      ) : null}
    </div>
  )
}

AdvertisementEmptyState.displayName = 'AdvertisementEmptyState'
