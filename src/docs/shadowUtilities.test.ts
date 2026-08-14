import postcss from 'postcss'
import tailwindcss from 'tailwindcss'
import type { Config } from 'tailwindcss'
import { describe, expect, it } from 'vitest'
import config from '../../tailwind.config.js'
import { shadowUtilityClass, shadowUtilityClasses } from './shadowUtilities'

describe('shadow utility class map', () => {
  it('covers every boxShadow token from the Tailwind theme', () => {
    expect(Object.keys(shadowUtilityClasses).sort()).toEqual(
      Object.keys(config.theme.boxShadow).sort(),
    )
    expect(shadowUtilityClass('none')).toBe('')
    expect(shadowUtilityClass('DEFAULT')).toBe('tm-shadow')
    expect(shadowUtilityClass('sm')).toBe('tm-shadow-sm')
    expect(shadowUtilityClass('xl')).toBe('tm-shadow-xl')
    expect(shadowUtilityClass('unknown')).toBe('')
  })

  it('compiles every mapped utility from static class literals', async () => {
    const utilities = Object.values(shadowUtilityClasses).filter(Boolean)
    expect(utilities).toEqual(
      expect.arrayContaining([
        'tm-shadow',
        'tm-shadow-xs',
        'tm-shadow-sm',
        'tm-shadow-md',
        'tm-shadow-lg',
        'tm-shadow-xl',
      ]),
    )

    const result = await postcss([
      tailwindcss({
        ...config,
        content: [{ raw: utilities.join(' '), extension: 'html' }],
      } as unknown as Config),
    ]).process('@tailwind utilities;', { from: undefined })

    for (const utility of utilities) {
      expect(result.css).toContain(`.${utility} {`)
    }
    expect(result.css).toContain('--tw-shadow: 0px 2px 8px rgba(0 13 60 / .12)')
    expect(result.css).toContain('--tw-shadow: 0px 24px 64px rgba(0 13 60 / .16)')
  })
})
