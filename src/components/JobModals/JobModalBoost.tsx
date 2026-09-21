import { JobModalActionPlaces, type JobModalActionPlacesProps } from './JobModalActionPlaces'
import { JOB_MODAL_COPY } from './jobModalCopy'

export type JobModalBoostProps = Omit<JobModalActionPlacesProps, 'title' | 'confirmLabel'> & {
  title?: string
  confirmLabel?: string
}

export function JobModalBoost({
  title = JOB_MODAL_COPY.boost.title,
  confirmLabel = JOB_MODAL_COPY.boost.confirm,
  ...rest
}: JobModalBoostProps) {
  return <JobModalActionPlaces title={title} confirmLabel={confirmLabel} {...rest} />
}

JobModalBoost.displayName = 'JobModalBoost'
