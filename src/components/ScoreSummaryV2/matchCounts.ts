import type { ScoreMatchItem, ScoreMatchStatus } from './types'

export interface MatchCounts {
  met: number
  partial: number
  unmet: number
}

export function countMatchStatuses(matches: ScoreMatchItem[]): MatchCounts {
  return matches.reduce<MatchCounts>(
    (counts, match) => {
      const key: ScoreMatchStatus = match.status
      counts[key] += 1
      return counts
    },
    { met: 0, partial: 0, unmet: 0 },
  )
}
