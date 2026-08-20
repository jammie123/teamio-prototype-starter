import { cn } from '../../lib/cn'

export type OptionColor = 'primary' | 'danger'

export interface OptionClassOptions {
  color?: OptionColor
  isDisabled?: boolean
  isSelected?: boolean
  hasDescription?: boolean
}

export function optionClass({
  color = 'primary',
  isDisabled = false,
  isSelected = false,
  hasDescription = false,
}: OptionClassOptions = {}) {
  const colorClass =
    color === 'danger'
      ? cn(
          'tm-text-emotion-danger-active',
          'hover:tm-text-emotion-danger-active',
          'focus:tm-text-emotion-danger-active',
          !isDisabled &&
            (isSelected
              ? 'hover:tm-bg-interactive-danger-active'
              : 'hover:tm-bg-interactive-danger-hover'),
          !isDisabled && 'active:tm-bg-interactive-danger-active',
          isSelected
            ? 'focus-visible:tm-bg-interactive-danger-active'
            : 'focus-visible:tm-bg-interactive-danger-hover',
        )
      : cn(
          'tm-text-primary-default',
          'hover:tm-text-primary-default',
          'focus:tm-text-primary-default',
          !isDisabled &&
            (isSelected ? 'hover:tm-bg-interactive-active' : 'hover:tm-bg-interactive-hover'),
          !isDisabled && 'active:tm-bg-interactive-active',
          isSelected
            ? 'focus-visible:tm-bg-interactive-active'
            : 'focus-visible:tm-bg-interactive-hover',
        )

  return cn(
    'tm-w-full',
    'tm-flex',
    'tm-gap-2',
    hasDescription ? 'tm-items-start' : 'tm-items-center',
    'tm-flex-none',
    'tm-p-2',
    'tm-rounded',
    'tm-text-left',
    'tm-font-poppins',
    'tm-text-sm',
    'tm-no-underline',
    'tm-outline-0',
    'tm-cursor-default',
    'tm-border-0',
    // tm-bg-transparent by přebilo token vybraného stavu, protože cn neřeší konflikty
    // a bg-transparent je v Tailwind výstupu až za barvami z tokenů.
    isSelected
      ? color === 'danger'
        ? 'tm-bg-interactive-danger-active'
        : 'tm-bg-interactive-active'
      : 'tm-bg-transparent',
    'hover:tm-no-underline',
    'focus:tm-no-underline',
    colorClass,
    isDisabled && 'tm-opacity-40',
  )
}

export function optionDescriptionClass(color: OptionColor = 'primary') {
  return cn(
    'tm-text-13',
    'tm-font-normal',
    color === 'danger' ? 'tm-text-emotion-danger-active' : 'tm-text-secondary-default',
  )
}
