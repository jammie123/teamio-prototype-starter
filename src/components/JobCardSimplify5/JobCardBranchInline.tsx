import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../Tooltip'

export interface JobCardBranch {
  id: string
  name: string
}

export function JobCardBranchInline({ branches }: { branches: JobCardBranch[] }) {
  if (branches.length === 0) {
    return null
  }

  const isSingle = branches.length === 1
  const extraCount = branches.length - 1

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span
            className="tm-inline-flex tm-items-baseline tm-gap-1 tm-font-normal tm-text-primary-default"
            data-testid="job-card-branch-inline"
          >
            <span aria-hidden className="tm-text-secondary-default">
              ·
            </span>
            <span>{branches[0].name}</span>
            {!isSingle ? (
              <span className="tm-text-sm tm-text-secondary-default">+{extraCount}</span>
            ) : null}
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

JobCardBranchInline.displayName = 'JobCardBranchInline'
