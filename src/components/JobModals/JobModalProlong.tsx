import { JobModalActionPlaces, type JobModalActionPlacesProps } from './JobModalActionPlaces'
import { JOB_MODAL_COPY } from './jobModalCopy'

export type JobModalProlongProps = Omit<JobModalActionPlacesProps, 'title' | 'confirmLabel'> & {
  title?: string
  confirmLabel?: string
}

export function JobModalProlong({
  title = JOB_MODAL_COPY.prolong.title,
  confirmLabel = JOB_MODAL_COPY.prolong.confirm,
  ...rest
}: JobModalProlongProps) {
  return <JobModalActionPlaces title={title} confirmLabel={confirmLabel} {...rest} />
}

JobModalProlong.displayName = 'JobModalProlong'
