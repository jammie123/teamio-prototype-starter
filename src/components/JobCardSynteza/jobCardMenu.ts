import type {
  JobAdvertisement,
  JobCardAction,
  JobCardMenuItem,
  JobCardMenuSection,
} from './types'

export const JOB_CARD_MENU_LABELS = {
  editAdvertisement: 'Editovat inzerát',
  editAdvertisementDescription: 'Popis a znění inzerátu',
  extendAndRepublish: 'Prodloužit a znovu vystavit',
  endPublication: 'Ukončit vystavení',
  topAdvertisement: 'Topovat',
  editJob: 'Editovat nábor',
  duplicateJob: 'Duplikovat',
  inviteColleagues: 'Zapojit kolegy',
  transferJob: 'Předat nábor',
  archiveJob: 'Archivovat',
  addNote: 'Přidat poznámku',
  addAdvertisement: 'Přidat inzerát',
} as const

export interface JobCardMenuHandlers {
  onEditJob?: () => void
  onDuplicateJob?: () => void
  onInviteColleagues?: () => void
  onTransferJob?: () => void
  onArchiveJob?: () => void
  onEditAdvertisement?: () => void
  onExtendAndRepublish?: () => void
  onEndPublication?: () => void
  onTopAdvertisement?: () => void
  onCreateAdvertisement?: () => void
  onAddNote?: () => void
}

export interface BuildJobCardMenuOptions extends JobCardMenuHandlers {
  advertisements?: JobAdvertisement[]
  actions?: JobCardAction[]
}

function advertisementItems({
  advertisements = [],
  onEditAdvertisement,
  onExtendAndRepublish,
  onEndPublication,
  onTopAdvertisement,
  onCreateAdvertisement,
}: BuildJobCardMenuOptions): JobCardMenuItem[] {
  if (advertisements.length === 0) {
    if (!onCreateAdvertisement) {
      return []
    }

    return [
      {
        id: 'advertisement-add',
        label: JOB_CARD_MENU_LABELS.addAdvertisement,
        onClick: onCreateAdvertisement,
      },
    ]
  }

  const items: JobCardMenuItem[] = []

  if (onEditAdvertisement) {
    items.push({
      id: 'advertisement-edit',
      label: JOB_CARD_MENU_LABELS.editAdvertisement,
      description: JOB_CARD_MENU_LABELS.editAdvertisementDescription,
      onClick: onEditAdvertisement,
    })
  }

  if (onExtendAndRepublish) {
    items.push({
      id: 'advertisement-extend',
      label: JOB_CARD_MENU_LABELS.extendAndRepublish,
      onClick: onExtendAndRepublish,
    })
  }

  if (onEndPublication) {
    items.push({
      id: 'advertisement-end-publication',
      label: JOB_CARD_MENU_LABELS.endPublication,
      onClick: onEndPublication,
    })
  }

  if (onTopAdvertisement) {
    items.push({
      id: 'advertisement-top',
      label: JOB_CARD_MENU_LABELS.topAdvertisement,
      onClick: onTopAdvertisement,
    })
  }

  return items
}

function jobItems({
  onEditJob,
  onDuplicateJob,
  onInviteColleagues,
  onTransferJob,
  onArchiveJob,
  onAddNote,
  actions = [],
}: BuildJobCardMenuOptions): JobCardMenuItem[] {
  const items: JobCardMenuItem[] = []

  if (onEditJob) {
    items.push({ id: 'job-edit', label: JOB_CARD_MENU_LABELS.editJob, onClick: onEditJob })
  }

  if (onDuplicateJob) {
    items.push({
      id: 'job-duplicate',
      label: JOB_CARD_MENU_LABELS.duplicateJob,
      onClick: onDuplicateJob,
    })
  }

  if (onInviteColleagues) {
    items.push({
      id: 'job-invite-colleagues',
      label: JOB_CARD_MENU_LABELS.inviteColleagues,
      onClick: onInviteColleagues,
    })
  }

  if (onTransferJob) {
    items.push({
      id: 'job-transfer',
      label: JOB_CARD_MENU_LABELS.transferJob,
      onClick: onTransferJob,
    })
  }

  if (onArchiveJob) {
    items.push({
      id: 'job-archive',
      label: JOB_CARD_MENU_LABELS.archiveJob,
      onClick: onArchiveJob,
    })
  }

  if (onAddNote) {
    items.push({
      id: 'job-add-note',
      label: JOB_CARD_MENU_LABELS.addNote,
      onClick: onAddNote,
    })
  }

  return [...items, ...actions]
}

/**
 * Advertisement actions come first because they are the ones recruiters reach
 * for most often; job actions follow in a separate section. With no advertisement
 * yet, the only ad action is creating one. Picking a specific advertisement is
 * left to the screen behind each action.
 */
export function buildJobCardMenuSections(options: BuildJobCardMenuOptions): JobCardMenuSection[] {
  return [
    { id: 'advertisement', items: advertisementItems(options) },
    { id: 'job', items: jobItems(options) },
  ].filter((section) => section.items.length > 0)
}
