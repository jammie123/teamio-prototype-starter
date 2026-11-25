import type { ScoreMatchItem, ScoreQuestionItem } from './types'

export const sampleScoreSummaryV2Matches: ScoreMatchItem[] = [
  {
    id: 'endpoint',
    title: 'Zkušenosti se správou koncových zařízení',
    description:
      'Zmiňuje správu flotil zařízení koncových uživatelů, ale v CV chybí konkrétní nástroje jako Intune, SCCM nebo JAMF.',
    status: 'partial',
  },
  {
    id: 'm365',
    title: 'M365, AV/zasedací místnosti, telefonie',
    description:
      'Správa Microsoft 365 je pokryta; AV v zasedacích místnostech a telefonie se objevují jen okrajově.',
    status: 'partial',
  },
  {
    id: 'itsm',
    title: 'ITSM, governance, správa aktiv',
    description:
      'Vedl procesy ITSM a IT governance včetně odpovědnosti za životní cyklus aktiv ve více zemích.',
    status: 'met',
  },
  {
    id: 'vendor',
    title: 'Outsourcovaný/multi-vendor provoz',
    description:
      'Řídil více externích dodavatelů s dohledem nad SLA a odpovědností za rozpočet na dodavatele.',
    status: 'met',
  },
  {
    id: 'english',
    title: 'Pokročilá znalost angličtiny',
    description:
      'V CV není uvedena úroveň ani certifikát angličtiny, pokročilou znalost proto nelze potvrdit.',
    status: 'unmet',
  },
]

export const sampleScoreSummaryV2Questions: ScoreQuestionItem[] = [
  {
    id: 'q-endpoint',
    text: 'Popište praktické zkušenosti s Intune, SCCM nebo JAMF.',
    verifies: 'Zkušenosti se správou koncových zařízení',
  },
  {
    id: 'q-vendor',
    text: 'Uveďte konkrétní příklad multi-vendor outsourcingu.',
    verifies: 'Outsourcovaný/multi-vendor provoz',
  },
]

export const sampleScoreSummaryV2Text =
  'S více než 23 lety mezinárodních zkušeností v IT kandidát prokazuje silné strategické vedení a odpovědnost za rozpočet.'

export const sampleScoreSummaryV2MatchesEn: ScoreMatchItem[] = [
  {
    id: 'endpoint',
    title: 'Endpoint management expertise',
    description:
      'Mentions managing end-user device fleets, but the CV names no hands-on tools such as Intune, SCCM or JAMF.',
    status: 'partial',
  },
  {
    id: 'm365',
    title: 'M365, AV/meeting rooms, telephony',
    description:
      'Microsoft 365 administration is covered; meeting-room AV and telephony appear only in passing.',
    status: 'partial',
  },
  {
    id: 'itsm',
    title: 'ITSM, governance, asset mgmt',
    description:
      'Led ITSM processes and IT governance, including ownership of the asset lifecycle across several countries.',
    status: 'met',
  },
  {
    id: 'vendor',
    title: 'Outsourced/multi-vendor operations',
    description:
      'Managed multiple external service providers with SLA oversight and responsibility for the vendor budget.',
    status: 'met',
  },
  {
    id: 'english',
    title: 'Advanced English',
    description:
      'The CV states no English level or certificate, so advanced proficiency cannot be confirmed.',
    status: 'unmet',
  },
]

export const sampleScoreSummaryV2QuestionsEn: ScoreQuestionItem[] = [
  {
    id: 'q-endpoint',
    text: 'Describe hands-on experience with Intune, SCCM, or JAMF.',
    verifies: 'Endpoint management expertise',
  },
  {
    id: 'q-vendor',
    text: 'Share a concrete case of a multi-vendor outsourcing setup.',
    verifies: 'Outsourced/multi-vendor operations',
  },
]

export const sampleScoreSummaryV2TextEn =
  'With 23+ years of international IT experience, the candidate demonstrates strong strategic leadership and budget ownership.'
