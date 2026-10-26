import { Button } from '../Button'
import { Link } from '../Link'
import { EvaluationCriteriaEmptyIllustration } from './EvaluationCriteriaEmptyIllustration'
import { EVALUATION_CRITERIA_HELP_URL } from './helpUrl'

export const EVALUATION_CRITERIA_EMPTY_COPY = {
  title: 'Zatím nemáte vytvořená kritéria pro hodnocení kandidátů',
  description:
    'Kritéria určují, podle čeho se budou kandidáti hodnotit. Nechte je navrhnout z inzerátu nebo je přidejte ručně.',
  helpLead: 'Více o této funkci zjistíte v',
  helpLink: 'nápovědě',
  generate: 'Vygenerovat z pozice',
  addManually: 'Přidat kritérium ručně',
} as const

export interface EvaluationCriteriaEmptyStateProps {
  onGenerate: () => void
  onAddManually: () => void
}

export function EvaluationCriteriaEmptyState({
  onGenerate,
  onAddManually,
}: EvaluationCriteriaEmptyStateProps) {
  return (
    <div
      data-testid="evaluation-criteria-empty"
      className="tm-flex tm-w-full tm-flex-col tm-items-center tm-gap-8 tm-px-16 tm-pb-12 tm-pt-16 tm-text-center"
    >
      <EvaluationCriteriaEmptyIllustration />
      <div className="tm-flex tm-max-w-[640px] tm-flex-col tm-gap-2">
        <h3 className="tm-m-0 tm-text-xl tm-font-semibold tm-text-primary-default">
          {EVALUATION_CRITERIA_EMPTY_COPY.title}
        </h3>
        <p className="tm-m-0 tm-text-base tm-text-secondary-default">
          {EVALUATION_CRITERIA_EMPTY_COPY.description}{' '}
          {EVALUATION_CRITERIA_EMPTY_COPY.helpLead}{' '}
          <Link href={EVALUATION_CRITERIA_HELP_URL} target="_blank">
            {EVALUATION_CRITERIA_EMPTY_COPY.helpLink}
          </Link>
          .
        </p>
      </div>
      <div className="tm-flex tm-flex-wrap tm-items-center tm-justify-center tm-gap-3">
        <Button onClick={onGenerate}>{EVALUATION_CRITERIA_EMPTY_COPY.generate}</Button>
        <Button variant="secondary" onClick={onAddManually}>
          {EVALUATION_CRITERIA_EMPTY_COPY.addManually}
        </Button>
      </div>
    </div>
  )
}

EvaluationCriteriaEmptyState.displayName = 'EvaluationCriteriaEmptyState'
