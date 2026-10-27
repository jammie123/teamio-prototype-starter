import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'
import { Tag } from '../Tag'
import type { Simplify26HeaderBadge } from './jobCardSimplify26Presentation'

export interface AdvertisementHeaderProps extends StyleProps {
  /** Status title: „Běží“, „Běží od–do“, „Běží v různá období“, „Ukončeno“, „Neinzeruje se“. */
  title?: string
  titleTestId?: string
  /** Count badges such as „2 Běží“, „1 Brzy končí“, „3 ukončené“. */
  badges?: Simplify26HeaderBadge[]
}

export function AdvertisementHeader({
  title,
  titleTestId,
  badges = [],
  className,
}: AdvertisementHeaderProps) {
  return (
    <div
      data-testid="advertisement-header"
      className="tm-flex tm-flex-wrap tm-items-center tm-gap-2"
    >
      {title ? (
        <p data-testid={titleTestId} className={cn('tm-m-0 tm-text-sm tm-font-medium', className)}>
          {title}
        </p>
      ) : null}
      {badges.map((badge) => (
        <Tag
          key={badge.label}
          color={badge.color}
          isSubtle
          className="!tm-text-[11px] !tm-font-semibold"
          data-testid="advertisement-header-badge"
          data-tone={badge.color}
        >
          {badge.label}
        </Tag>
      ))}
    </div>
  )
}

AdvertisementHeader.displayName = 'AdvertisementHeader'
