import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'
import { Tag, type TagColor } from '../Tag'
import type { Simplify28ListStatus } from './jobCardSimplify28Presentation'

export interface AdvertisementListProps extends StyleProps {
  status: Simplify28ListStatus
  badge: string
  extraBadge?: string
  extraBadgeTone?: Simplify28ListStatus
  children: ReactNode
}

function tagColor(status: Simplify28ListStatus): TagColor {
  if (status === 'success') {
    return 'success'
  }

  if (status === 'warning') {
    return 'warning'
  }

  return 'neutral'
}

export function AdvertisementList({
  status,
  badge,
  extraBadge,
  extraBadgeTone = 'warning',
  children,
  className,
}: AdvertisementListProps) {
  return (
    <div
      data-testid="advertisement-list"
      data-status={status}
      data-layout="column"
      className={cn('tm-flex tm-flex-col tm-gap-2', className)}
    >
      <div className="tm-flex tm-flex-wrap tm-items-center tm-gap-1">
        <Tag
          color={tagColor(status)}
          isSubtle
          className="!tm-w-fit !tm-text-xs !tm-font-medium"
          data-testid="advertisement-list-badge"
          data-tone={status}
        >
          {badge}
        </Tag>
        {extraBadge ? (
          <Tag
            color={tagColor(extraBadgeTone)}
            isSubtle
            className="!tm-w-fit !tm-text-xs !tm-font-medium"
            data-testid="advertisement-list-extra-badge"
            data-tone={extraBadgeTone}
          >
            {extraBadge}
          </Tag>
        ) : null}
      </div>
      <ul className="tm-m-0 tm-flex tm-list-none tm-flex-col tm-gap-2 tm-p-0">{children}</ul>
    </div>
  )
}

AdvertisementList.displayName = 'AdvertisementList'
