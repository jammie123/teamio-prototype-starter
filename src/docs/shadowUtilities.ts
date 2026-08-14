export type ShadowTokenName = 'none' | 'DEFAULT' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'

/**
 * Tailwind only emits utilities it can find as literals in the content sources,
 * so every documented shadow utility is spelled out here instead of being built
 * from a token name at runtime.
 */
export const shadowUtilityClasses: Record<ShadowTokenName, string> = {
  none: '',
  DEFAULT: 'tm-shadow',
  xs: 'tm-shadow-xs',
  sm: 'tm-shadow-sm',
  md: 'tm-shadow-md',
  lg: 'tm-shadow-lg',
  xl: 'tm-shadow-xl',
}

export function shadowUtilityClass(name: string): string {
  return shadowUtilityClasses[name as ShadowTokenName] ?? ''
}
