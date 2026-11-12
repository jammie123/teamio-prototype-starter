import { LottieSvg } from 'lottie-react'
import criteriaEmptyAnimation from './CriteriaEmptyAnimation.json'

export interface EvaluationCriteriaGeneratingIllustrationProps {
  className?: string
}

export function EvaluationCriteriaGeneratingIllustration({
  className,
}: EvaluationCriteriaGeneratingIllustrationProps) {
  return (
    <LottieSvg
      src={criteriaEmptyAnimation}
      autoplay
      loop
      aria-hidden="true"
      className={className}
      style={{ width: 200, height: 142 }}
    />
  )
}

EvaluationCriteriaGeneratingIllustration.displayName = 'EvaluationCriteriaGeneratingIllustration'
