import { Button } from '../Button'
import { EvaluationCriteriaGeneratingIllustration } from './EvaluationCriteriaGeneratingIllustration'

export const EVALUATION_CRITERIA_GENERATING_COPY = {
  title: 'Navrhuji kritéria z inzerátu',
  description:
    'Navrhujeme kritéria podle inzerátu. Okno můžete zavřít, generování poběží na pozadí. Zabere to jenom chvilku.',
  loading: 'Generujeme kritéria…',
} as const

export function EvaluationCriteriaGeneratingState() {
  return (
    <div
      data-testid="evaluation-criteria-generating"
      role="status"
      className="tm-flex tm-w-full tm-flex-col tm-items-center tm-gap-8 tm-px-16 tm-pb-12 tm-pt-16 tm-text-center"
    >
      <EvaluationCriteriaGeneratingIllustration />
      <div className="tm-flex tm-max-w-[640px] tm-flex-col tm-gap-2">
        <h3 className="tm-m-0 tm-text-xl tm-font-semibold tm-text-primary-default">
          {EVALUATION_CRITERIA_GENERATING_COPY.title}
        </h3>
        <p className="tm-m-0 tm-text-base tm-text-secondary-default">
          {EVALUATION_CRITERIA_GENERATING_COPY.description}
        </p>
      </div>
      <Button isLoading>{EVALUATION_CRITERIA_GENERATING_COPY.loading}</Button>
    </div>
  )
}

EvaluationCriteriaGeneratingState.displayName = 'EvaluationCriteriaGeneratingState'
