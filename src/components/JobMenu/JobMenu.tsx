import type { StyleProps } from '../../lib/types'
import { JobCardActions } from '../JobShared/JobCardActions'
import type { JobAdvertisement } from '../JobShared/types'
import { buildJobMenuItems, type JobMenuHandlers } from './jobMenuItems'

export const JOB_MENU_LABEL = 'Akce nad náborem a inzerátem'

export interface JobMenuProps extends StyleProps, JobMenuHandlers {
  /**
   * Advertisement actions follow the advertising: end needs any advertising, highlight and top need
   * running advertising, extend is always offered.
   */
  advertisements?: JobAdvertisement[]
  label?: string
  testId?: string
}

export function JobMenu({
  advertisements,
  onEditJob,
  onDuplicateJob,
  onEndPublication,
  onExtendAndRepublish,
  onHighlightAdvertisement,
  onTopAdvertisement,
  onAddNote,
  onInviteColleagues,
  onTransferJob,
  onArchiveJob,
  label = JOB_MENU_LABEL,
  testId = 'job-menu-toggle',
  className,
}: JobMenuProps) {
  const items = buildJobMenuItems({
    advertisements,
    onEditJob,
    onDuplicateJob,
    onEndPublication,
    onExtendAndRepublish,
    onHighlightAdvertisement,
    onTopAdvertisement,
    onAddNote,
    onInviteColleagues,
    onTransferJob,
    onArchiveJob,
  })

  if (!items.length) {
    return null
  }

  return (
    <JobCardActions
      sections={[{ id: 'job-menu', items }]}
      label={label}
      testId={testId}
      className={className}
    />
  )
}

JobMenu.displayName = 'JobMenu'
