import type { JobPublication } from '../JobCardSynteza/types'
import { SIMPLIFY_12_CHANNEL_ORDER } from './constants'
import { JobCardSimplify12ChannelLogo } from './JobCardSimplify12ChannelLogo'

function sortPublicationsForRow(publications: JobPublication[]) {
  return [...publications].sort((left, right) => {
    const leftIndex = SIMPLIFY_12_CHANNEL_ORDER.indexOf(left.channel)
    const rightIndex = SIMPLIFY_12_CHANNEL_ORDER.indexOf(right.channel)
    return (leftIndex === -1 ? 999 : leftIndex) - (rightIndex === -1 ? 999 : rightIndex)
  })
}

export interface JobCardSimplify12LogoRowProps {
  publications: JobPublication[]
}

export function JobCardSimplify12LogoRow({ publications }: JobCardSimplify12LogoRowProps) {
  const visible = publications.filter((publication) => publication.status !== 'disabled')

  if (visible.length === 0) {
    return null
  }

  const ordered = sortPublicationsForRow(visible)

  return (
    <ul
      data-testid="job-card-simplify12-logo-row"
      className="tm-m-0 tm-flex tm-list-none tm-flex-row tm-flex-wrap tm-gap-2 tm-p-0"
    >
      {ordered.map((publication) => (
        <li key={publication.id}>
          <JobCardSimplify12ChannelLogo publication={publication} />
        </li>
      ))}
    </ul>
  )
}

JobCardSimplify12LogoRow.displayName = 'JobCardSimplify12LogoRow'
