import { cn } from '../../lib/cn'

export function pageTemplateClass(className?: string) {
  return cn('tm-min-h-screen', className)
}

export function pageTemplateColumnClass(isCollapsed: boolean) {
  return cn(
    isCollapsed ? 'tm-ml-left-menu-collapsed' : 'tm-ml-left-menu',
    'tm-flex',
    'tm-min-h-screen',
    'tm-min-w-0',
    'tm-flex-1',
    'tm-flex-col',
  )
}

export function pageTemplateMainClass(hasPageHeader = false) {
  return cn('tm-flex-1', 'tm-bg-cover-light', !hasPageHeader && 'tm-p-6')
}

export function pageTemplateBodyClass() {
  return cn('tm-p-6')
}
