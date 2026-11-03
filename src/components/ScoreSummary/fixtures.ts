import type { EvaluationItemData } from './types'

export const sampleScoreSummaryCriteria: EvaluationItemData[] = [
  { id: 'endpoint', label: 'Endpoint management expertise', status: 'partial' },
  { id: 'm365', label: 'M365, AV/meeting rooms, telephony', status: 'partial' },
  { id: 'itsm', label: 'ITSM, governance, asset mgmt', status: 'met' },
  { id: 'vendor', label: 'Outsourced/multi-vendor operations', status: 'met' },
  { id: 'english', label: 'Pokročilá znalost angličtiny', status: 'unmet' },
]

export const sampleScoreSummaryQuestions = [
  'Describe hands-on experience with Intune, SCCM, or JAMF.',
  'Share a concrete case of a multi-vendor outsourcing setup.',
]

export const sampleScoreSummaryText =
  'With 23+ years of international IT experience, the candidate demonstrates strong strategic leadership and budget ownership.'
