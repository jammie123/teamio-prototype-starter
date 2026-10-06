import { JobModalActionPlaces, type JobModalActionPlacesProps } from './JobModalActionPlaces'
import { JOB_MODAL_COPY } from './jobModalCopy'

export type JobModalProlongProps = Omit<
  JobModalActionPlacesProps,
  'title' | 'confirmLabel' | 'placesTableVariant'
> & {
  title?: string
  confirmLabel?: string
}

export function JobModalProlong({
  title = JOB_MODAL_COPY.prolong.title,
  confirmLabel,
  ...rest
}: JobModalProlongProps) {
  return (
    <JobModalActionPlaces
      {...rest}
      title={title}
      confirmLabel={confirmLabel}
      placesTableVariant="prolong"
    />
  )
}

JobModalProlong.displayName = 'JobModalProlong'
