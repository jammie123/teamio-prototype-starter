import { JobModalActionPlaces, type JobModalActionPlacesProps } from './JobModalActionPlaces'
import { JOB_MODAL_COPY } from './jobModalCopy'

export type JobModalPublishProps = Omit<JobModalActionPlacesProps, 'title' | 'confirmLabel'> & {
  title?: string
  confirmLabel?: string
}

export function JobModalPublish({
  title = JOB_MODAL_COPY.publish.title,
  confirmLabel = JOB_MODAL_COPY.publish.confirm,
  ...rest
}: JobModalPublishProps) {
  return <JobModalActionPlaces title={title} confirmLabel={confirmLabel} {...rest} />
}

JobModalPublish.displayName = 'JobModalPublish'
