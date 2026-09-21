import { JobModalActionPlaces, type JobModalActionPlacesProps } from './JobModalActionPlaces'
import { JOB_MODAL_COPY } from './jobModalCopy'

export type JobModalTopProps = Omit<JobModalActionPlacesProps, 'title' | 'confirmLabel'> & {
  title?: string
  confirmLabel?: string
}

export function JobModalTop({
  title = JOB_MODAL_COPY.top.title,
  confirmLabel = JOB_MODAL_COPY.top.confirm,
  ...rest
}: JobModalTopProps) {
  return <JobModalActionPlaces title={title} confirmLabel={confirmLabel} {...rest} />
}

JobModalTop.displayName = 'JobModalTop'
