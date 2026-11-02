import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'

export interface AdvertisementListProps extends StyleProps {
  children: ReactNode
}

export function AdvertisementList({ children, className }: AdvertisementListProps) {
  return (
    <div
      data-testid="advertisement-list"
      data-layout="row"
      className={cn('tm-flex tm-flex-row tm-flex-wrap tm-items-start tm-gap-2', className)}
    >
      {children}
    </div>
  )
}

export function AdvertisementListGroup({ children, className }: AdvertisementListProps) {
  return (
    <ul
      className={cn(
        'tm-contents tm-m-0 tm-list-none tm-p-0',
        className,
      )}
    >
      {children}
    </ul>
  )
}

export function AdvertisementListDivider({ className }: StyleProps) {
  return (
    <div
      role="separator"
      data-testid="advertisement-list-divider"
      className={cn(
        'tm-min-h-10 tm-self-stretch tm-border-0 tm-border-l tm-border-solid tm-border-secondary',
        className,
      )}
    />
  )
}

AdvertisementList.displayName = 'AdvertisementList'
AdvertisementListGroup.displayName = 'AdvertisementListGroup'
AdvertisementListDivider.displayName = 'AdvertisementListDivider'
