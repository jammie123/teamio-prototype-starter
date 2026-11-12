/** Czech plural of "kritérium": 1 kritérium, 2-4 kritéria, 0 and 5+ kritérií. */
export function formatCriteriaCount(count: number): string {
  if (count === 1) return `${count} kritérium`
  if (count >= 2 && count <= 4) return `${count} kritéria`
  return `${count} kritérií`
}
