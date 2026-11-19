import type { JobAdvertisement, JobCardMenuItem } from '../JobShared/types'

export const JOB_MENU_LABELS = {
  editJob: 'Editovat nábor',
  duplicateJob: 'Duplikovat',
  endPublication: 'Ukončit vystavování',
  extendAndRepublish: 'Prodloužit a znovuvystavit',
  topAdvertisement: 'Topovat',
  inviteColleagues: 'Zapojit kolegu',
  transferJob: 'Předat nábor',
  archiveJob: 'Archivovat',
} as const

export interface JobMenuHandlers {
  onEditJob?: () => void
  onDuplicateJob?: () => void
  onEndPublication?: () => void
  onExtendAndRepublish?: () => void
  onTopAdvertisement?: () => void
  onInviteColleagues?: () => void
  onTransferJob?: () => void
  onArchiveJob?: () => void
}

export interface BuildJobMenuItemsOptions extends JobMenuHandlers {
  advertisements?: JobAdvertisement[]
}

/**
 * The menu is a single flat list in a fixed order. Actions without a handler
 * are left out, and the advertisement actions (end, extend, top) only appear
 * when the job has at least one advertisement.
 */
export function buildJobMenuItems({
  advertisements = [],
  onEditJob,
  onDuplicateJob,
  onEndPublication,
  onExtendAndRepublish,
  onTopAdvertisement,
  onInviteColleagues,
  onTransferJob,
  onArchiveJob,
}: BuildJobMenuItemsOptions): JobCardMenuItem[] {
  const hasAdvertisement = advertisements.length > 0

  const candidates: Array<JobCardMenuItem & { enabled: boolean }> = [
    { id: 'job-edit', label: JOB_MENU_LABELS.editJob, onClick: onEditJob, enabled: true },
    {
      id: 'job-duplicate',
      label: JOB_MENU_LABELS.duplicateJob,
      onClick: onDuplicateJob,
      enabled: true,
    },
    {
      id: 'advertisement-end-publication',
      label: JOB_MENU_LABELS.endPublication,
      onClick: onEndPublication,
      enabled: hasAdvertisement,
    },
    {
      id: 'advertisement-extend',
      label: JOB_MENU_LABELS.extendAndRepublish,
      onClick: onExtendAndRepublish,
      enabled: hasAdvertisement,
    },
    {
      id: 'advertisement-top',
      label: JOB_MENU_LABELS.topAdvertisement,
      onClick: onTopAdvertisement,
      enabled: hasAdvertisement,
    },
    {
      id: 'job-invite-colleagues',
      label: JOB_MENU_LABELS.inviteColleagues,
      onClick: onInviteColleagues,
      enabled: true,
    },
    {
      id: 'job-transfer',
      label: JOB_MENU_LABELS.transferJob,
      onClick: onTransferJob,
      enabled: true,
    },
    {
      id: 'job-archive',
      label: JOB_MENU_LABELS.archiveJob,
      onClick: onArchiveJob,
      enabled: true,
    },
  ]

  return candidates
    .filter((item) => item.enabled && item.onClick)
    .map(({ enabled: _enabled, ...item }) => item)
}
