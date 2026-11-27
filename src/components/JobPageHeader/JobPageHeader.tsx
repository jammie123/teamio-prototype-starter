import { forwardRef, type ReactNode } from 'react'
import { cn } from '../../lib/cn'
import { Button } from '../Button'
import { Option } from '../OptionList'
import { PageHeader, type PageHeaderProps } from '../PageHeader'
import { SplitButton } from '../SplitButton'
import { TabsList, TabsTrigger } from '../Tabs'

export type JobPageHeaderTab =
  | 'open'
  | 'published'
  | 'unpublished'
  | 'draft'
  | 'archived'

export const JOB_PAGE_HEADER_TABS: ReadonlyArray<{
  value: JobPageHeaderTab
  label: string
  info?: string
}> = [
  {
    value: 'open',
    label: 'Otevřený',
    info: 'Otevřený nábor, který má alespoň jeden inzerát',
  },
  {
    value: 'published',
    label: 'Zveřejněný',
    info: 'Otevřený nábor, na kterém běží vystavená inzerce',
  },
  {
    value: 'unpublished',
    label: 'Nezveřejněný',
    info: 'Otevřený nábor s ukončenou nebo vypršelou inzercí',
  },
  { value: 'draft', label: 'Rozpracovaný' },
  { value: 'archived', label: 'Archivní' },
]

function defaultTitle(jobCount?: number): ReactNode {
  if (typeof jobCount !== 'number') {
    return 'Nábory'
  }

  return (
    <>
      Nábory{' '}
      <span className="tm-font-normal tm-text-secondary-default">({jobCount})</span>
    </>
  )
}

function defaultNaboryTabs(tabCounts?: Partial<Record<JobPageHeaderTab, number>>) {
  return (
    <TabsList aria-label="Filtry náborů">
      {JOB_PAGE_HEADER_TABS.map((item) => (
        <TabsTrigger
          key={item.value}
          value={item.value}
          count={tabCounts?.[item.value]}
          info={item.info}
        >
          {item.label}
        </TabsTrigger>
      ))}
    </TabsList>
  )
}

export interface JobPageHeaderProps
  extends Omit<PageHeaderProps, 'title' | 'actions' | 'tabs'> {
  title?: ReactNode
  /** When set and title is defaulted, renders: Nábory (N) with muted count. */
  jobCount?: number
  /** Counts for default tab triggers; ignored when `tabs` is provided. */
  tabCounts?: Partial<Record<JobPageHeaderTab, number>>
  actions?: ReactNode
  tabs?: ReactNode
  onAddJob?: () => void
  onAddBrigade?: () => void
  /** When true, the bulk-edit toggle shows as active: Vypnout hromadné úpravy. */
  bulkActionsActive?: boolean
  onBulkActionsToggle?: () => void
}

export const JobPageHeader = forwardRef<HTMLElement, JobPageHeaderProps>(
  function JobPageHeader(
    {
      title,
      jobCount,
      tabCounts,
      actions,
      tabs,
      onAddJob,
      onAddBrigade,
      bulkActionsActive = false,
      onBulkActionsToggle,
      'aria-label': ariaLabel,
      ...rest
    },
    ref,
  ) {
    const resolvedTitle = title ?? defaultTitle(jobCount)
    const resolvedAriaLabel =
      ariaLabel ?? (typeof jobCount === 'number' && title === undefined ? 'Nábory' : undefined)

    return (
      <PageHeader
        ref={ref}
        title={resolvedTitle}
        aria-label={resolvedAriaLabel}
        actions={
          actions ?? (
            <>
              <SplitButton
                label="Přidat nábor"
                onClick={onAddJob}
                menuLabel="Další možnosti přidání"
              >
                <Option onClick={onAddBrigade}>Přidat brigádu</Option>
              </SplitButton>
              <Button
                variant="secondary"
                data-testid="job-page-header-bulk-toggle"
                aria-pressed={bulkActionsActive}
                onClick={onBulkActionsToggle}
                className={cn(
                  bulkActionsActive &&
                    '!tm-bg-interactive-active !tm-border-action-secondary-active',
                )}
              >
                {bulkActionsActive ? 'Vypnout hromadné úpravy' : 'Hromadné akce'}
              </Button>
            </>
          )
        }
        tabs={tabs ?? defaultNaboryTabs(tabCounts)}
        {...rest}
      />
    )
  },
)

JobPageHeader.displayName = 'JobPageHeader'
