import { forwardRef, type ReactNode } from 'react'
import { Option } from '../OptionList'
import { PageHeader, type PageHeaderProps } from '../PageHeader'
import { SplitButton } from '../SplitButton'
import { TabsList, TabsTrigger } from '../Tabs'

function defaultNaboryTabs() {
  return (
    <TabsList aria-label="Filtry náborů">
      <TabsTrigger value="aktivni">Aktivní</TabsTrigger>
      <TabsTrigger value="archiv">Archiv</TabsTrigger>
      <TabsTrigger value="navrhy">Návrhy</TabsTrigger>
    </TabsList>
  )
}

export interface JobPageHeaderProps
  extends Omit<PageHeaderProps, 'title' | 'actions' | 'tabs'> {
  title?: ReactNode
  actions?: ReactNode
  tabs?: ReactNode
  onAddJob?: () => void
  onAddBrigade?: () => void
}

export const JobPageHeader = forwardRef<HTMLElement, JobPageHeaderProps>(
  function JobPageHeader(
    { title = 'Nábory', actions, tabs, onAddJob, onAddBrigade, ...rest },
    ref,
  ) {
    return (
      <PageHeader
        ref={ref}
        title={title}
        actions={
          actions ?? (
            <SplitButton
              label="Přidat nábor"
              onClick={onAddJob}
              menuLabel="Další možnosti přidání"
            >
              <Option onClick={onAddBrigade}>Přidat brigádu</Option>
            </SplitButton>
          )
        }
        tabs={tabs ?? defaultNaboryTabs()}
        {...rest}
      />
    )
  },
)

JobPageHeader.displayName = 'JobPageHeader'
