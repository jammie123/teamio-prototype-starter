import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'
import type { Simplify26ListStatus } from './jobCardSimplify26Presentation'

export interface AdvertisementListProps extends StyleProps {
  status: Simplify26ListStatus
  children: ReactNode
}

export function AdvertisementList({ status, children, className }: AdvertisementListProps) {
  return (
    <ul
      data-testid="advertisement-list"
      data-status={status}
      data-layout="row"
      className={cn(
        'tm-m-0 tm-flex tm-list-none tm-flex-row tm-gap-2 tm-p-0',
        className,
      )}
    >
      {children}
    </ul>
  )
}

AdvertisementList.displayName = 'AdvertisementList'
