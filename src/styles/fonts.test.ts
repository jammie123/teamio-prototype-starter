import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const require = createRequire(resolve(process.cwd(), 'package.json'))

const WEIGHTS = [400, 500, 600, 700] as const

// Caron/ring letters live in Latin Extended-A, outside the `latin` subset.
const CZECH_ONLY_IN_LATIN_EXT = 'čďěňřšťžůČĎĚŇŘŠŤŽŮ'

function readGlobalCss() {
  return readFileSync(resolve(process.cwd(), 'src/styles/global.css'), 'utf8')
}

function readFontsourceCss(specifier: string) {
  return readFileSync(require.resolve(specifier), 'utf8')
}

describe('Poppins font loading', () => {
  it('imports a Poppins stylesheet for every weight the theme uses', () => {
    const globalCss = readGlobalCss()

    for (const weight of WEIGHTS) {
      expect(globalCss).toMatch(
        new RegExp(`@fontsource/poppins/${weight}\\.css`),
      )
    }
  })

  it('serves Latin Extended glyphs from Poppins so Czech diacritics do not fall back', () => {
    expect(CZECH_ONLY_IN_LATIN_EXT.length).toBeGreaterThan(0)

    for (const weight of WEIGHTS) {
      const css = readFontsourceCss(`@fontsource/poppins/${weight}.css`)

      expect(css).toContain('poppins-latin-ext')
      // U+0100-02BA covers Latin Extended-A, where č/ě/š/ř/ž/ů live.
      expect(css).toMatch(/unicode-range:[^;]*U\+0100-02BA/)
    }
  })

  it('scopes each subset with a unicode-range so weights cannot shadow each other', () => {
    for (const weight of WEIGHTS) {
      const css = readFontsourceCss(`@fontsource/poppins/${weight}.css`)
      const faceCount = css.match(/@font-face/g)?.length ?? 0
      const rangeCount = css.match(/unicode-range:/g)?.length ?? 0

      expect(faceCount).toBeGreaterThan(1)
      expect(rangeCount).toBe(faceCount)
    }
  })
})
