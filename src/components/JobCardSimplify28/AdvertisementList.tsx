import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'
import { Tag } from '../Tag'
import type { Simplify28ListStatus } from './jobCardSimplify28Presentation'

export interface AdvertisementListProps extends StyleProps {
  status: Simplify28ListStatus
  badge: string
  children: ReactNode
}

export function AdvertisementList({ status, badge, children, className }: AdvertisementListProps) {
  return (
    <div
      data-testid="advertisement-list"
      data-status={status}
      data-layout="column"
      className={cn('tm-flex tm-flex-col tm-gap-2', className)}
    >
      <Tag
        color={status === 'success' ? 'success' : 'neutral'}
        isSubtle
        className="!tm-w-fit !tm-text-xs !tm-font-medium"
        data-testid="advertisement-list-badge"
        data-tone={status}
      >
        {badge}
      </Tag>
      <ul className="tm-m-0 tm-flex tm-list-none tm-flex-col tm-gap-2 tm-p-0">{children}</ul>
    </div>
  )
}

AdvertisementList.displayName = 'AdvertisementList'
