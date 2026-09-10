import postcss from 'postcss'
import tailwindcss from 'tailwindcss'
import type { Config } from 'tailwindcss'
import { describe, expect, it } from 'vitest'
import config from '../../tailwind.config.js'
import colors from './colors.js'

describe('Teamio Tailwind config', () => {
  it('uses tm- prefix and representative design tokens', () => {
    expect(config.prefix).toBe('tm-')

    expect(colors.brand.blue).toBe('#0096ee')
    expect(colors.gray[800]).toBe('#2a2536')
    expect(colors['brand-blue'][300]).toBe('#69cdf6')

    expect(config.theme.colors.teamio.blue).toBe('#0096ee')
    expect(config.theme.colors.action.primary.default).toBe('#69cdf6')
    expect(config.theme.colors.text.primary.default).toBe('#2a2536')
    expect(config.theme.colors.emotion.success.default).toBe('#93d77b')
    expect(config.theme.colors.border.primary).toBe('#c2c8ce')
    expect(config.theme.colors.background['cover-light']).toBe('#f5f6fa')

    expect(config.theme.spacing[4]).toBe('1rem')
    expect(config.theme.spacing.checkbox).toBe('1.625rem')
    expect(config.theme.spacing['3/4']).toBe('75%')

    expect(config.theme.fontFamily.poppins).toEqual(['Poppins', 'sans-serif'])
    expect(config.theme.fontSize.base).toBe('1rem')
    expect(config.theme.fontSize[13]).toBe('.8125rem')
    expect(config.theme.letterSpacing.normal).toBe('-.015em')
    expect(config.theme.lineHeight.tight).toBe(1.3)

    expect(config.theme.borderRadius.DEFAULT).toBe('.5rem')
    expect(config.theme.borderRadius.lg).toBe('1rem')

    expect(config.theme.boxShadow.sm).toBe('0px 2px 8px rgba(0 13 60 / .12)')
    expect(config.theme.boxShadow.xl).toBe('0px 24px 64px rgba(0 13 60 / .16)')

    expect(config.theme.screens.sm).toBe('750px')
    expect(config.theme.screens.md).toBe('1200px')
    expect(config.theme.screens['max-xs']).toEqual({ max: '749.98px' })

    expect(config.theme.extend.backgroundImage['checkbox-checked']).toContain(
      'data:image/svg+xml',
    )
    expect(config.theme.extend.backgroundImage['skeleton-light']).toContain(
      'linear-gradient',
    )
    expect(config.theme.extend.backgroundImage['note-expand-overlay']).toContain(
      'linear-gradient(to left, var(--color-background-cover-dark)',
    )
    expect(config.theme.extend.keyframes.shimmer['0%']).toEqual({
      backgroundPosition: '200% 0',
    })
    expect(config.theme.extend.animation.shimmer).toBe(
      'shimmer 2s infinite linear',
    )

    expect(config.plugins).toHaveLength(1)
    expect(config.theme.ringColor.DEFAULT).toBe('#0096ee')
  })

  it('emits representative CSS custom properties from the theme plugin', async () => {
    const result = await postcss([
      tailwindcss(config as unknown as Config),
    ]).process('@tailwind base;', {
      from: undefined,
    })

    // DEFAULT radius flattens to --border-radius (no "-default" suffix).
    expect(result.css).toContain('--color-teamio-blue: #0096ee')
    expect(result.css).toContain('--font-size-base: 1rem')
    expect(result.css).toContain('--font-size-13: .8125rem')
    expect(result.css).toContain('--border-radius: .5rem')
    expect(result.css).toContain('--shadow-sm: 0px 2px 8px rgba(0 13 60 / .12)')
  })
})
