import { cn } from '../../lib/cn'
import type { JobPublication } from '../JobCardSynteza/types'
import { JobCardSimplify11ChannelChip } from '../JobCardSimplify11/JobCardSimplify11ChannelChip'
import {
  formatSimplify14ChannelDateLabel,
  resolveSimplify14ChannelDateLabelTone,
  simplify14ChannelDateLabelClassName,
} from './jobCardSimplify14Presentation'

const STRIP_CHANNEL_ORDER = ['Jobs.cz', 'Prace.cz', 'Kariérní stránky']

function sortPublicationsForStrip(publications: JobPublication[]) {
  return [...publications].sort((left, right) => {
    const leftIndex = STRIP_CHANNEL_ORDER.indexOf(left.channel)
    const rightIndex = STRIP_CHANNEL_ORDER.indexOf(right.channel)
    return (leftIndex === -1 ? 999 : leftIndex) - (rightIndex === -1 ? 999 : rightIndex)
  })
}

export interface JobCardSimplify14ChannelStripProps {
  publications: JobPublication[]
  showDateLabels: boolean
  now?: Date
  onExtendPublication?: (publication: JobPublication) => void
  onEnablePublication?: (publication: JobPublication) => void
}

export function JobCardSimplify14ChannelStrip({
  publications,
  showDateLabels,
  now,
  onExtendPublication,
  onEnablePublication,
}: JobCardSimplify14ChannelStripProps) {
  if (publications.length === 0) {
    return null
  }

  const ordered = sortPublicationsForStrip(publications)

  return (
    <ul
      data-testid="job-card-simplify14-channel-strip"
      className="tm-m-0 tm-flex tm-list-none tm-flex-row tm-flex-wrap tm-gap-2 tm-p-0"
    >
      {ordered.map((publication) => {
        const label = formatSimplify14ChannelDateLabel(publication, now)
        const tone = resolveSimplify14ChannelDateLabelTone(publication, now)

        return (
          <li key={publication.id}>
            <div className="tm-flex tm-w-[42px] tm-flex-col tm-items-center tm-gap-0.5">
              <JobCardSimplify11ChannelChip
                publication={publication}
                now={now}
                onExtendPublication={onExtendPublication}
                onEnablePublication={onEnablePublication}
              />
              {showDateLabels ? (
                <span
                  data-testid="job-card-simplify14-channel-date"
                  className={cn(
                    'tm-max-w-full tm-truncate tm-text-center tm-text-[11px] tm-leading-tight tm-whitespace-nowrap',
                    simplify14ChannelDateLabelClassName(tone),
                  )}
                >
                  {label}
                </span>
              ) : null}
            </div>
          </li>
        )
      })}
    </ul>
  )
}

JobCardSimplify14ChannelStrip.displayName = 'JobCardSimplify14ChannelStrip'
