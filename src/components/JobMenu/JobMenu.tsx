import type { StyleProps } from '../../lib/types'
import { JobCardActions } from '../JobCardSynteza/JobCardActions'
import {
  buildJobCardMenuSections,
  type JobCardMenuHandlers,
} from '../JobCardSynteza/jobCardMenu'
import type { JobAdvertisement, JobCardAction } from '../JobCardSynteza/types'

export const JOB_MENU_LABEL = 'Akce nad náborem a inzerátem'

export interface JobMenuProps extends StyleProps, JobCardMenuHandlers {
  advertisements?: JobAdvertisement[]
  actions?: JobCardAction[]
  label?: string
  testId?: string
}

export function JobMenu({
  advertisements,
  actions,
  onEditJob,
  onDuplicateJob,
  onInviteColleagues,
  onTransferJob,
  onArchiveJob,
  onEditAdvertisement,
  onExtendAndRepublish,
  onEndPublication,
  onTopAdvertisement,
  onCreateAdvertisement,
  onAddNote,
  label = JOB_MENU_LABEL,
  testId = 'job-menu-toggle',
  className,
}: JobMenuProps) {
  const sections = buildJobCardMenuSections({
    advertisements,
    actions,
    onEditJob,
    onDuplicateJob,
    onInviteColleagues,
    onTransferJob,
    onArchiveJob,
    onEditAdvertisement,
    onExtendAndRepublish,
    onEndPublication,
    onTopAdvertisement,
    onCreateAdvertisement,
    onAddNote,
  })

  if (!sections.length) {
    return null
  }

  return (
    <JobCardActions sections={sections} label={label} testId={testId} className={className} />
  )
}

JobMenu.displayName = 'JobMenu'
