import { describe, expect, it } from 'vitest'
import { findEeoViolation } from './evaluationCriteriaRules'

describe('findEeoViolation', () => {
  it('detects "muž" and "žena" regardless of case and diacritics', () => {
    expect(findEeoViolation('Hledáme muže do týmu')).toBe('muze')
    expect(findEeoViolation('MUŽ s praxí')).toBe('muz')
    expect(findEeoViolation('Ideálně žena')).toBe('zena')
    expect(findEeoViolation('zeny preferovany')).toBe('zeny')
  })

  it('returns null for neutral text', () => {
    expect(findEeoViolation('Praxe v oboru alespoň 3 roky')).toBeNull()
    expect(findEeoViolation('')).toBeNull()
  })

  it('does not match words that only contain the keywords', () => {
    expect(findEeoViolation('Zenit a muzeum')).toBeNull()
  })
})
