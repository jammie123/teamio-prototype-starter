import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'
import { Button } from '../Button'

export const EMPTY_JOB_SEARCH_COPY = {
  title: 'Nic jsme nenašli',
  resetFilters: 'Resetovat filtry',
  filtersDescription:
    'Pro vybrané filtry nemáme žádný nábor. Zkuste některý filtr zrušit nebo nastavit šířeji.',
  queryDescription: (query: string) =>
    `Pro „${query}“ nemáme žádný nábor. Zkontrolujte překlepy nebo zkuste obecnější hledání.`,
} as const

export interface EmptyJobSearchProps extends StyleProps {
  /** Fulltext query. Shown in copy when no filters are active. */
  query?: string
  /** When true, uses the filter empty copy even if a query is present. */
  hasFilters?: boolean
  onResetFilters?: () => void
}

export function EmptyJobSearch({
  query = '',
  hasFilters = false,
  onResetFilters,
  className,
}: EmptyJobSearchProps) {
  const description = hasFilters
    ? EMPTY_JOB_SEARCH_COPY.filtersDescription
    : EMPTY_JOB_SEARCH_COPY.queryDescription(query)

  return (
    <div
      role="status"
      data-testid="empty-job-search"
      className={cn(
        'tm-flex',
        'tm-w-full',
        'tm-flex-col',
        'tm-items-center',
        'tm-gap-6',
        'tm-px-6',
        'tm-py-16',
        'tm-text-center',
        className,
      )}
    >
      <div className="tm-flex tm-max-w-[32rem] tm-flex-col tm-gap-2">
        <h2 className="tm-m-0 tm-text-xl tm-font-semibold tm-text-primary-default">
          {EMPTY_JOB_SEARCH_COPY.title}
        </h2>
        <p className="tm-m-0 tm-text-base tm-text-secondary-default">{description}</p>
      </div>
      {onResetFilters ? (
        <Button variant="primary" onClick={onResetFilters}>
          {EMPTY_JOB_SEARCH_COPY.resetFilters}
        </Button>
      ) : null}
    </div>
  )
}

EmptyJobSearch.displayName = 'EmptyJobSearch'
