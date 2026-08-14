import { cn } from '../../lib/cn'

interface LeftMenuItemClassProps {
  isActive?: boolean
  isDisabled?: boolean
  isCollapsed?: boolean
}

export function leftMenuItemClass({
  isActive = false,
  isDisabled = false,
  isCollapsed = false,
}: LeftMenuItemClassProps): string {
  return cn(
    'tm-flex',
    'tm-w-full',
    'tm-items-center',
    'tm-gap-3',
    'tm-min-h-10',
    'tm-rounded',
    'tm-border-0',
    'tm-bg-transparent',
    'tm-font-poppins',
    'tm-text-sm',
    'tm-leading-tight',
    'tm-text-left',
    'hover:tm-no-underline',
    'focus:tm-outline-0',
    'focus-visible:tm-ring',
    isCollapsed ? 'tm-justify-center tm-px-2' : 'tm-px-3',
    isActive
      ? 'tm-bg-basic/20 tm-font-semibold tm-text-primary-inverted-default'
      : 'tm-font-normal tm-text-secondary-inverted-default',
    isDisabled
      ? 'tm-cursor-not-allowed tm-opacity-50'
      : cn(
          'tm-cursor-pointer',
          'hover:tm-bg-basic/10',
          'hover:tm-text-primary-inverted-default',
          'focus-visible:tm-text-primary-inverted-default',
          'active:tm-bg-basic/20',
        ),
  )
}
