import { JobPortalLogo, jobPortalLogoTypeFromChannel } from '../JobPortalLogo'
import type { JobPublication } from '../JobCardSynteza/types'
export interface JobCardSimplify12ChannelLogoProps {
  publication: JobPublication
}

export function JobCardSimplify12ChannelLogo({ publication }: JobCardSimplify12ChannelLogoProps) {
  return (
    <JobPortalLogo
      type={jobPortalLogoTypeFromChannel(publication.channel)}
      title=""
      className="tm-size-[36px] tm-shrink-0 tm-overflow-hidden tm-rounded-full"
    />
  )
}

JobCardSimplify12ChannelLogo.displayName = 'JobCardSimplify12ChannelLogo'
