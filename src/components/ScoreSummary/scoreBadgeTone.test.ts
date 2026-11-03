import { describe, expect, it } from 'vitest'
import { clampScore, getScoreBadgeTone } from './scoreBadgeTone'

describe('clampScore', () => {
  it('keeps scores inside 0–100', () => {
    expect(clampScore(0)).toBe(0)
    expect(clampScore(39)).toBe(39)
    expect(clampScore(100)).toBe(100)
  })

  it('clamps out-of-range scores', () => {
    expect(clampScore(-10)).toBe(0)
    expect(clampScore(120)).toBe(100)
  })
})

describe('getScoreBadgeTone', () => {
  it('returns danger for 0–39', () => {
    expect(getScoreBadgeTone(0)).toBe('danger')
    expect(getScoreBadgeTone(39)).toBe('danger')
  })

  it('returns warning for 40–69', () => {
    expect(getScoreBadgeTone(40)).toBe('warning')
    expect(getScoreBadgeTone(69)).toBe('warning')
  })

  it('returns success for 70–100', () => {
    expect(getScoreBadgeTone(70)).toBe('success')
    expect(getScoreBadgeTone(100)).toBe('success')
  })

  it('clamps out-of-range scores before mapping tone', () => {
    expect(getScoreBadgeTone(-5)).toBe('danger')
    expect(getScoreBadgeTone(150)).toBe('success')
  })
})
