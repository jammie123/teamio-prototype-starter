import type { JobAdvertisement, JobCardMenuItem, JobPublication } from '../JobShared/types'

export const JOB_MENU_LABELS = {
  editJob: 'Editovat nábor',
  duplicateJob: 'Duplikovat',
  endPublication: 'Ukončit vystavování',
  extendAndRepublish: 'Prodloužit a znovuvystavit',
  highlightAdvertisement: 'Zvýraznit',
  topAdvertisement: 'Topovat',
  addNote: 'Přidat poznámku',
  inviteColleagues: 'Zapojit kolegu',
  transferJob: 'Předat nábor',
  archiveJob: 'Archivovat',
} as const

export interface JobMenuHandlers {
  onEditJob?: () => void
  onDuplicateJob?: () => void
  onEndPublication?: () => void
  onExtendAndRepublish?: () => void
  onHighlightAdvertisement?: () => void
  onTopAdvertisement?: () => void
  onAddNote?: () => void
  onInviteColleagues?: () => void
  onTransferJob?: () => void
  onArchiveJob?: () => void
}

export interface BuildJobMenuItemsOptions extends JobMenuHandlers {
  advertisements?: JobAdvertisement[]
}

/** A portal that is neither ended nor disabled; a missing status counts as running. */
function isRunningPublication({ status }: JobPublication) {
  return status !== 'expired' && status !== 'disabled'
}

/** The job has advertising: at least one advertisement with a portal, running or already ended. */
export function hasAdvertising(advertisements: JobAdvertisement[] = []) {
  return advertisements.some((advertisement) => (advertisement.publications?.length ?? 0) > 0)
}

/** The job has running advertising: at least one portal that has not ended yet. */
export function hasRunningAdvertising(advertisements: JobAdvertisement[] = []) {
  return advertisements.some((advertisement) =>
    (advertisement.publications ?? []).some(isRunningPublication),
  )
}

/**
 * The menu is a single flat list in a fixed order. Actions without a handler
 * are left out, and the advertisement actions follow the state of the advertising:
 * - Ukončit vystavování needs any advertising (running or ended),
 * - Prodloužit a znovuvystavit is always offered,
 * - Zvýraznit and Topovat need running advertising.
 */
export function buildJobMenuItems({
  advertisements = [],
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
}: BuildJobMenuItemsOptions): JobCardMenuItem[] {
  const hasAds = hasAdvertising(advertisements)
  const hasRunningAds = hasRunningAdvertising(advertisements)

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
      enabled: hasAds,
    },
    {
      id: 'advertisement-extend',
      label: JOB_MENU_LABELS.extendAndRepublish,
      onClick: onExtendAndRepublish,
      enabled: true,
    },
    {
      id: 'advertisement-highlight',
      label: JOB_MENU_LABELS.highlightAdvertisement,
      onClick: onHighlightAdvertisement,
      enabled: hasRunningAds,
    },
    {
      id: 'advertisement-top',
      label: JOB_MENU_LABELS.topAdvertisement,
      onClick: onTopAdvertisement,
      enabled: hasRunningAds,
    },
    { id: 'job-add-note', label: JOB_MENU_LABELS.addNote, onClick: onAddNote, enabled: true },
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
