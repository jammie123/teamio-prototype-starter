import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'
import type { Simplify29ListStatus } from './jobCardSimplify29Presentation'

export interface AdvertisementListProps extends StyleProps {
  status: Simplify29ListStatus
  periodDate?: string
  children: ReactNode
}

export function AdvertisementList({
  status,
  periodDate,
  children,
  className,
}: AdvertisementListProps) {
  return (
    <div
      data-testid="advertisement-list"
      data-status={status}
      data-layout="row"
      className={cn('tm-flex tm-items-center tm-gap-3', className)}
    >
      {periodDate ? (
        <span
          data-testid="advertisement-list-period"
          className="tm-w-[11.5rem] tm-shrink-0 tm-whitespace-nowrap tm-text-xs tm-font-medium tm-text-secondary-default"
        >
          {periodDate}
        </span>
      ) : null}
      <ul className="tm-m-0 tm-flex tm-min-w-0 tm-list-none tm-flex-row tm-gap-2 tm-p-0">
        {children}
      </ul>
    </div>
  )
}

AdvertisementList.displayName = 'AdvertisementList'
