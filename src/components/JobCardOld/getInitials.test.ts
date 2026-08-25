import { describe, expect, it } from 'vitest'
import { getInitials } from './getInitials'

describe('getInitials', () => {
  it('uses the first and last name letters', () => {
    expect(getInitials('Petra Nováková')).toBe('PN')
    expect(getInitials('Lukáš Procházka')).toBe('LP')
  })

  it('keeps Czech diacritics on initials', () => {
    expect(getInitials('Čestmír Říha')).toBe('ČŘ')
  })

  it('uses two letters from a single word', () => {
    expect(getInitials('Petra')).toBe('PE')
  })
})
