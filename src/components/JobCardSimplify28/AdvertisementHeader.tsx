import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'

export interface AdvertisementHeaderProps extends StyleProps {
  /** Status title: „Běží“, „Běží od–do“, „Běží v různá období“, „Ukončeno“, „Neinzeruje se“. */
  title?: string
  titleTestId?: string
}

export function AdvertisementHeader({ title, titleTestId, className }: AdvertisementHeaderProps) {
  if (!title) {
    return null
  }

  return (
    <div data-testid="advertisement-header" className="tm-flex tm-flex-wrap tm-items-center tm-gap-2">
      <p data-testid={titleTestId} className={cn('tm-m-0 tm-text-sm tm-font-medium', className)}>
        {title}
      </p>
    </div>
  )
}

AdvertisementHeader.displayName = 'AdvertisementHeader'
