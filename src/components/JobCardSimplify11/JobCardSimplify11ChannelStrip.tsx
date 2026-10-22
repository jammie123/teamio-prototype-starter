import type { JobPublication } from '../JobCardSynteza/types'
import { JobCardSimplify11ChannelChip } from './JobCardSimplify11ChannelChip'

const STRIP_CHANNEL_ORDER = ['Jobs.cz', 'Prace.cz', 'Kariérní stránky']

function sortPublicationsForStrip(publications: JobPublication[]) {
  return [...publications].sort((left, right) => {
    const leftIndex = STRIP_CHANNEL_ORDER.indexOf(left.channel)
    const rightIndex = STRIP_CHANNEL_ORDER.indexOf(right.channel)
    return (leftIndex === -1 ? 999 : leftIndex) - (rightIndex === -1 ? 999 : rightIndex)
  })
}

export interface JobCardSimplify11ChannelStripProps {
  publications: JobPublication[]
  now?: Date
  onExtendPublication?: (publication: JobPublication) => void
  onEnablePublication?: (publication: JobPublication) => void
}

export function JobCardSimplify11ChannelStrip({
  publications,
  now,
  onExtendPublication,
  onEnablePublication,
}: JobCardSimplify11ChannelStripProps) {
  if (publications.length === 0) {
    return null
  }

  const ordered = sortPublicationsForStrip(publications)

  return (
    <ul
      data-testid="job-card-simplify11-channel-strip"
      className="tm-m-0 tm-flex tm-list-none tm-flex-row tm-flex-wrap tm-gap-2 tm-p-0"
    >
      {ordered.map((publication) => (
        <li key={publication.id}>
          <JobCardSimplify11ChannelChip
            publication={publication}
            now={now}
            onExtendPublication={onExtendPublication}
            onEnablePublication={onEnablePublication}
          />
        </li>
      ))}
    </ul>
  )
}

JobCardSimplify11ChannelStrip.displayName = 'JobCardSimplify11ChannelStrip'
