import { Tag } from '../Tag'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../Tooltip'

export interface JobCardBranch {
  id: string
  name: string
}

export function JobCardBranchBadge({ branches }: { branches: JobCardBranch[] }) {
  if (branches.length === 0) {
    return null
  }

  const isSingle = branches.length === 1
  const label = isSingle ? branches[0].name : `Inzerce na ${branches.length} pobočkách`

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="tm-inline-flex" data-testid="job-card-branch-badge">
            <Tag color="informative" isSubtle>
              {label}
            </Tag>
          </span>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          {isSingle ? (
            `Pobočka ${branches[0].name}`
          ) : (
            <span className="tm-flex tm-flex-col">
              {branches.map((branch) => (
                <span key={branch.id}>Pobočka {branch.name}</span>
              ))}
            </span>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

JobCardBranchBadge.displayName = 'JobCardBranchBadge'
