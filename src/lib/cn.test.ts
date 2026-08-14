import { describe, expect, it } from 'vitest'
import { cn } from './cn'

describe('cn', () => {
  it('merges class names and skips falsy values', () => {
    const maybeFalse: string | false = false
    expect(cn('tm-a', maybeFalse, undefined, 'tm-c')).toBe('tm-a tm-c')
  })
})
