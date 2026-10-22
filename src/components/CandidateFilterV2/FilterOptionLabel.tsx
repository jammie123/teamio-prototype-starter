import { Icon } from '../Icon'
import type { CandidateFilterModalOption } from '../Candidate/filterModalTypes'

export function FilterOptionLabel({ option }: { option: CandidateFilterModalOption }) {
  if (!option.icon) {
    return option.label
  }

  return (
    <span className="tm-flex tm-min-w-0 tm-items-center tm-gap-2">
      <Icon name={option.icon} className="tm-shrink-0 tm-text-base" aria-hidden />
      <span className="tm-truncate">{option.label}</span>
    </span>
  )
}
