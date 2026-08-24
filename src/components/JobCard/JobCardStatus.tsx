import { Button } from '../Button'
import type { JobCardSelectableStatus, JobStatus } from './types'

export interface JobCardStatusProps {
  status: JobStatus
  onStatusChange: (status: JobCardSelectableStatus) => void
  onCompleteDraft?: () => void
  onGoToPublish?: () => void
  onRestoreFromArchive?: () => void
}

export function JobCardStatus({
  status,
  onStatusChange,
  onCompleteDraft,
  onGoToPublish,
  onRestoreFromArchive,
}: JobCardStatusProps) {
  if (status === 'draft') {
    return (
      <Button variant="secondary" onClick={onCompleteDraft}>
        Dokončit nábor
      </Button>
    )
  }

  if (status === 'active') {
    return (
      <Button variant="secondary" onClick={onGoToPublish}>
        Přejít na zveřejnění
      </Button>
    )
  }

  if (status === 'archived') {
    return (
      <Button
        variant="secondary"
        onClick={() => {
          onStatusChange('unpublished')
          onRestoreFromArchive?.()
        }}
      >
        Obnovit z archivu
      </Button>
    )
  }

  return null
}

JobCardStatus.displayName = 'JobCardStatus'
