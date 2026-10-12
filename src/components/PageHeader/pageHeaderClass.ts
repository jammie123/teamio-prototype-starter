import { cn } from '../../lib/cn'

export function pageHeaderClass(className?: string) {
  return cn(
    'tm-flex',
    'tm-flex-col',
    'tm-bg-basic',
    // Shadow color of the sm token, but offset and pulled in so it only shows below the header.
    'tm-shadow-[0_8px_12px_-6px_rgba(0,13,60,0.12)]',
    'tm-px-6',
    'tm-pt-5',
    'tm-font-poppins',
    className,
  )
}

export function pageHeaderBreadcrumbsClass() {
  return cn('tm-pb-2')
}

// With tabs the row gives up its bottom padding, so the tabs reach the bottom edge.
export function pageHeaderRowClass(hasTabs = false) {
  return cn(
    'tm-flex',
    'tm-w-full',
    'tm-items-center',
    'tm-justify-between',
    'tm-gap-4',
    hasTabs ? 'tm-pb-2' : 'tm-pb-5',
  )
}

export function pageHeaderTitleClass() {
  return cn('tm-mb-0 tm-min-w-0')
}

export function pageHeaderActionsClass() {
  return cn('tm-flex tm-shrink-0 tm-items-center tm-gap-2')
}

// Full-bleed line under the tabs, so the active tab underline lands on it.
export function pageHeaderTabsClass() {
  return cn(
    'tm--mx-6',
    'tm-px-6',
    'tm-border-0',
    'tm-border-b',
    'tm-border-solid',
    'tm-border-secondary',
  )
}
