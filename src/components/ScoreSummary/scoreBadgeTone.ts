import type { ScoreBadgeTone } from './types'

export function clampScore(score: number): number {
  if (Number.isNaN(score)) {
    return 0
  }

  return Math.min(100, Math.max(0, Math.round(score)))
}

export function getScoreBadgeTone(score: number): ScoreBadgeTone {
  const value = clampScore(score)

  if (value <= 39) {
    return 'danger'
  }

  if (value <= 69) {
    return 'warning'
  }

  return 'success'
}
