import { Link } from '../Link'
import { ModalDescription, ModalTitle } from '../Modal'
import { EVALUATION_CRITERIA_COPY } from '../EvaluationCriteriaModal/EvaluationCriteriaModal'
import { EVALUATION_CRITERIA_HELP_URL } from '../EvaluationCriteriaModal/helpUrl'

/** Modal title and the perex with a link to the help article. Render inside `ModalContent`. */
export function CriteriaModalHeader() {
  return (
    <>
      <ModalTitle>{EVALUATION_CRITERIA_COPY.title}</ModalTitle>
      <ModalDescription className="tm--mt-3 tm-pb-4">
        {EVALUATION_CRITERIA_COPY.perex} {EVALUATION_CRITERIA_COPY.perexHelpLead}{' '}
        <Link href={EVALUATION_CRITERIA_HELP_URL} target="_blank">
          {EVALUATION_CRITERIA_COPY.perexHelpLink}
        </Link>
      </ModalDescription>
    </>
  )
}

CriteriaModalHeader.displayName = 'CriteriaModalHeader'
