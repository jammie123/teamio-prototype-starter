import { JobModalActionPlaces, type JobModalActionPlacesProps } from './JobModalActionPlaces'
import { JOB_MODAL_COPY } from './jobModalCopy'

export type JobModalUnpublishProps = Omit<
  JobModalActionPlacesProps,
  'title' | 'confirmLabel' | 'hideCostColumn' | 'placesTableVariant'
> & {
  title?: string
  confirmLabel?: string
}

export function JobModalUnpublish({
  title = JOB_MODAL_COPY.unpublish.title,
  confirmLabel = JOB_MODAL_COPY.unpublish.confirm,
  ...rest
}: JobModalUnpublishProps) {
  return (
    <JobModalActionPlaces
      {...rest}
      title={title}
      confirmLabel={confirmLabel}
      hideCostColumn
      placesTableVariant="unpublish"
    />
  )
}

JobModalUnpublish.displayName = 'JobModalUnpublish'
