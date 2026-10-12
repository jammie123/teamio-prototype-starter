import { forwardRef, useId, type HTMLAttributes, type ReactNode } from 'react'
import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'
import { Button } from '../Button'
import { Icon } from '../Icon'
import { Input } from '../Input'
import { CANDIDATE_COPY } from './candidateCopy'
import { JobsPipelineV2, type JobsPipelineV2Props } from './JobsPipelineV2'

export interface CandidateListPanelProps
  extends StyleProps,
    Omit<HTMLAttributes<HTMLDivElement>, 'color' | 'onChange' | 'children'> {
  /** Candidate counts by status id, passed to the pipeline. */
  statusCounts: JobsPipelineV2Props['statusCounts']
  /** Count of new candidates by status id, passed to the pipeline. */
  newCounts?: JobsPipelineV2Props['newCounts']
  statusOptions?: JobsPipelineV2Props['statusOptions']
  /** Selected pipeline status id; undefined means no filter ("Celkem"). */
  statusValue: string | undefined
  onStatusChange: (status: string | undefined) => void
  searchValue: string
  onSearchChange: (value: string) => void
  searchPlaceholder?: string
  /** Called when the "Filtry" button is clicked. */
  onFiltersClick?: () => void
  /** Number of active filters, shown in the "Filtry" button label when greater than 0. */
  activeFiltersCount?: number
  /** Called when the "Přizpůsobit sloupce" button is clicked. The button is shown only when set. */
  onColumnsClick?: () => void
  /** Content below the toolbar, usually a `CandidateTable`. Its own border is removed. */
  children?: ReactNode
}

/**
 * Wrapper around the candidate list: the `JobsPipelineV2` tabs on top across the full width of the container, a toolbar with search and a
 * "Filtry" button underneath and the table (`children`) at the bottom, all in one bordered
 * container. The table's own border and corners are reset so it does not draw a second frame.
 */
export const CandidateListPanel = forwardRef<HTMLDivElement, CandidateListPanelProps>(
  function CandidateListPanel(
    {
      statusCounts,
      newCounts,
      statusOptions,
      statusValue,
      onStatusChange,
      searchValue,
      onSearchChange,
      searchPlaceholder = CANDIDATE_COPY.panel.searchPlaceholder,
      onFiltersClick,
      activeFiltersCount = 0,
      onColumnsClick,
      children,
      className,
      ...rest
    },
    ref,
  ) {
    const searchId = useId()

    return (
      <div
        ref={ref}
        data-testid="candidate-list-panel"
        className={cn(
          'tm-w-full',
          'tm-overflow-hidden',
          'tm-rounded',
          'tm-border',
          'tm-border-solid',
          'tm-border-secondary',
          'tm-bg-basic',
          className,
        )}
        {...rest}
      >
        <div data-testid="candidate-list-panel-pipeline" className="tm-bg-cover-light">
          <JobsPipelineV2
            statusCounts={statusCounts}
            newCounts={newCounts}
            statusOptions={statusOptions}
            value={statusValue}
            onChange={onStatusChange}
          />
        </div>
        <div
          data-testid="candidate-list-panel-toolbar"
          className="tm-flex tm-items-center tm-gap-3 tm-px-4 tm-py-4"
        >
          <div className="tm-relative tm-flex-1">
            <label htmlFor={searchId} className="tm-sr-only">
              {CANDIDATE_COPY.panel.searchLabel}
            </label>
            <Icon
              name="search"
              aria-hidden
              className="tm-pointer-events-none tm-absolute tm-left-3 tm-top-1/2 tm--translate-y-1/2 tm-text-secondary-default"
            />
            <Input
              id={searchId}
              type="search"
              size="small"
              value={searchValue}
              placeholder={searchPlaceholder}
              onChange={(event) => onSearchChange(event.target.value)}
              data-testid="candidate-list-panel-search"
              className="!tm-pl-9"
            />
          </div>
          <Button
            variant="secondary"
            data-testid="candidate-list-panel-filters"
            onClick={onFiltersClick}
          >
            <Icon name="sliders-horizontal" />
            {activeFiltersCount > 0
              ? CANDIDATE_COPY.panel.filtersWithCount(activeFiltersCount)
              : CANDIDATE_COPY.panel.filters}
          </Button>
          {onColumnsClick ? (
            <Button
              variant="secondary"
              data-testid="candidate-list-panel-columns"
              onClick={onColumnsClick}
            >
              <Icon name="columns-3" />
              {CANDIDATE_COPY.panel.columns}
            </Button>
          ) : null}
        </div>
        {children ? (
          <div
            data-testid="candidate-list-panel-content"
            className="tm-border-0 tm-border-t tm-border-solid tm-border-secondary [&>*]:!tm-rounded-none [&>*]:!tm-border-0"
          >
            {children}
          </div>
        ) : null}
      </div>
    )
  },
)

CandidateListPanel.displayName = 'CandidateListPanel'
