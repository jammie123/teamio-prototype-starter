import { Button } from '../Button'
import { Icon } from '../Icon'

export function JobCardSimplify23ChevronEditButton({
  onEditAdvertisement,
}: {
  onEditAdvertisement: () => void
}) {
  return (
    <Button
      variant="tertiary"
      size="small"
      isCircle
      aria-label="Spravovat inzerci"
      data-testid="job-card-simplify23-edit-advertisement"
      className="tm-shrink-0"
      onClick={(event) => {
        event.preventDefault()
        event.stopPropagation()
        onEditAdvertisement()
      }}
    >
      <Icon name="chevron-right" />
    </Button>
  )
}
