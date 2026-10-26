import emptyIllustration from './evaluation-criteria-empty.png'

export interface EvaluationCriteriaEmptyIllustrationProps {
  className?: string
}

export function EvaluationCriteriaEmptyIllustration({
  className,
}: EvaluationCriteriaEmptyIllustrationProps) {
  return (
    <img
      src={emptyIllustration}
      alt=""
      aria-hidden="true"
      width={200}
      height={142}
      className={className}
    />
  )
}

EvaluationCriteriaEmptyIllustration.displayName = 'EvaluationCriteriaEmptyIllustration'
