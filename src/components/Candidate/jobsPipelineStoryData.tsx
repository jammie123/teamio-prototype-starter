import { useMemo, useState, type ComponentType } from 'react'
import { CandidateColumnsDrawer } from './CandidateColumnsDrawer'
import { CANDIDATE_DEFAULT_COLUMNS } from './candidateCopy'
import { CandidateListPanel } from './CandidateListPanel'
import { CandidateTable } from './CandidateTable'
import { sampleCandidates } from './fixtures'
import type { JobsPipelineProps } from './JobsPipeline'

/** Pipeline status of each sample candidate; the table's own statuses are a separate concept. */
const storyStatuses: Record<string, string> = {
  minayeva: 'hired',
  cerny: 'hired',
  karl: 'invited',
  sousek: 'unassessed',
  prijmeni: 'preselected',
  zamitnuty: 'rejected',
}

/** Candidates a hiring manager has rated; shown under "Opalcovaný" in the story. */
const storyOpalcovani = new Set(['karl', 'prijmeni'])

function matchesStatus(id: string, status: string | undefined) {
  if (!status) return true
  return status === 'opalcovani' ? storyOpalcovani.has(id) : storyStatuses[id] === status
}

function useStoryCounts() {
  return useMemo(() => {
    const result: Record<string, number> = {
      opalcovani: storyOpalcovani.size,
      total: sampleCandidates.length,
    }
    for (const candidate of sampleCandidates) {
      const status = storyStatuses[candidate.id]
      result[status] = (result[status] ?? 0) + 1
    }
    return result
  }, [])
}

/** Renders a pipeline variant above `CandidateTable` in one container and filters the same rows. */
export function PipelineWithTable({ Pipeline }: { Pipeline: ComponentType<JobsPipelineProps> }) {
  const [value, setValue] = useState<string | undefined>()
  const counts = useStoryCounts()

  const visible = sampleCandidates.filter((candidate) => matchesStatus(candidate.id, value))

  return (
    <div className="tm-flex tm-flex-col tm-gap-3 tm-max-w-[1100px]">
      <Pipeline statusCounts={counts} newCounts={{ unassessed: 1 }} value={value} onChange={setValue} />
      <CandidateTable candidates={visible} emptyMessage="Filtru neodpovídá žádný uchazeč" />
    </div>
  )
}

/** `CandidateListPanel` with working pipeline and search over the sample candidates. */
export function PanelWithTable() {
  const [status, setStatus] = useState<string | undefined>()
  const [search, setSearch] = useState('')
  const [columns, setColumns] = useState(CANDIDATE_DEFAULT_COLUMNS)
  const [columnsOpen, setColumnsOpen] = useState(false)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const counts = useStoryCounts()

  const query = search.trim().toLowerCase()
  const visible = sampleCandidates.filter(
    (candidate) =>
      matchesStatus(candidate.id, status) && candidate.name.toLowerCase().includes(query),
  )

  return (
    <>
      <CandidateListPanel
        statusCounts={counts}
        newCounts={{ unassessed: 1 }}
        statusValue={status}
        onStatusChange={setStatus}
        searchValue={search}
        onSearchChange={setSearch}
        onColumnsClick={() => setColumnsOpen(true)}
        selectedCount={selectedIds.length}
        bulkActions={{ onClear: () => setSelectedIds([]) }}
      >
        <CandidateTable
          candidates={visible}
          columns={columns}
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
          onAction={() => undefined}
          emptyMessage="Filtru neodpovídá žádný uchazeč"
        />
      </CandidateListPanel>
      <CandidateColumnsDrawer
        open={columnsOpen}
        onOpenChange={setColumnsOpen}
        columns={columns}
        onApply={setColumns}
      />
    </>
  )
}
