import { SCORE_SUMMARY_COPY, SCORE_SUMMARY_HELP_URL } from '../ScoreSummary/copy'
import type { ScoreBadgeTone } from '../ScoreSummary/types'
import type { ScoreUiLanguage } from './types'

export { SCORE_SUMMARY_HELP_URL }

export const SCORE_SUMMARY_V2_COPY = {
  title: SCORE_SUMMARY_COPY.title,
  evaluateLabel: SCORE_SUMMARY_COPY.evaluateLabel,
  criteriaLabel: 'Kritéria hodnocení',
  moreActionsLabel: 'Další možnosti',
  languageHeading: 'Jazyk AI hodnocení',
  languageEn: 'English',
  languageCs: 'Čeština',
  notEvaluatedStatus:
    'AI porovná životopis s kritérii pozice a ukáže, co kandidát splňuje a co ne.',
  insufficientData: SCORE_SUMMARY_COPY.insufficientData,
  insufficientDataHelpLink: SCORE_SUMMARY_COPY.insufficientDataHelpLink,
  insufficientDataStatus: SCORE_SUMMARY_COPY.insufficientDataBadge,
  error: SCORE_SUMMARY_COPY.error,
  errorStatus: SCORE_SUMMARY_COPY.errorBadge,
  summaryHeading: SCORE_SUMMARY_COPY.summaryHeading,
  matchesHeading: SCORE_SUMMARY_COPY.criteriaHeading,
  questionsHeading: SCORE_SUMMARY_COPY.questionsHeading,
  showDetail: 'Zobrazit detail',
  hideDetail: 'Skrýt detail',
  closeDialog: 'Zavřít shodu uchazeče',
  badgeTooltip: {
    insufficientData: 'Nepodařilo se ohodnotit.',
    error: 'Něco se pokazilo',
    evaluating: 'Probíhá vyhodnocování',
  },
  verifiesPrefix: 'Ověřuje:',
  matchQuality: {
    success: 'Výborná shoda',
    warning: 'Střední shoda',
    danger: 'Nízká shoda',
  } satisfies Record<ScoreBadgeTone, string>,
  matchStatus: {
    met: 'Splňuje',
    partial: 'Částečně splňuje',
    unmet: 'Nesplňuje',
  },
  matchCount: {
    met: (count: number) => `${count} splňuje`,
    partial: (count: number) => `${count} částečně`,
    unmet: (count: number) => `${count} nesplňuje`,
  },
  scoreRingLabel: (score: number, quality: string) => `Shoda ${score} procent, ${quality.toLowerCase()}`,
  scorePendingLabel: 'Zatím nehodnoceno pomocí AI',
  evaluatingTitle: 'Probíhá AI hodnocení uchazeče',
  evaluatingDescription: 'Může to chvíli trvat.',
  translatingTitle: (language: string) => `Překládám hodnocení do jazyka ${language}`,
  translationOffer: 'This summary is in Czech. Translate it to English?',
  translateAction: 'Translate',
} as const

export const SCORE_SUMMARY_V2_COPY_EN = {
  title: 'Candidate match with the job',
  evaluateLabel: 'Start AI evaluation',
  criteriaLabel: 'Evaluation criteria',
  moreActionsLabel: 'More options',
  languageHeading: 'AI evaluation language',
  languageEn: 'English',
  languageCs: 'Čeština',
  notEvaluatedStatus:
    'AI compares the CV with the job criteria and shows what the candidate meets and what they do not.',
  insufficientData:
    'The candidate could not be evaluated — supporting documents are missing. Either the candidate did not upload attachments and the form answers are not enough, or the attachments are unreadable (for example images). Upload attachments in a text format (PDF, DOCX, and similar) and run the evaluation again.',
  insufficientDataHelpLink: 'More information in the help',
  insufficientDataStatus: 'Not enough data to evaluate',
  error: 'Evaluation failed. Try again.',
  errorStatus: 'Evaluation failed',
  summaryHeading: 'Candidate summary',
  matchesHeading: 'How the candidate meets your requirements',
  questionsHeading: 'Verification questions',
  showDetail: 'Show details',
  hideDetail: 'Hide details',
  closeDialog: 'Close candidate match',
  badgeTooltip: {
    insufficientData: 'Could not evaluate.',
    error: 'Something went wrong',
    evaluating: 'Evaluation in progress',
  },
  verifiesPrefix: 'Verifies:',
  matchQuality: {
    success: 'Excellent match',
    warning: 'Medium match',
    danger: 'Low match',
  } satisfies Record<ScoreBadgeTone, string>,
  matchStatus: {
    met: 'Met',
    partial: 'Partially met',
    unmet: 'Not met',
  },
  matchCount: {
    met: (count: number) => `${count} met`,
    partial: (count: number) => `${count} partial`,
    unmet: (count: number) => `${count} unmet`,
  },
  scoreRingLabel: (score: number, quality: string) => `Match ${score} percent, ${quality.toLowerCase()}`,
  scorePendingLabel: 'Not yet evaluated with AI',
  evaluatingTitle: 'AI candidate evaluation in progress',
  evaluatingDescription: 'This may take a moment.',
  translatingTitle: (language: string) => `Translating the evaluation into ${language}`,
  translationOffer: 'This summary is in Czech. Translate it to English?',
  translateAction: 'Translate',
} as const

export function getScoreSummaryV2Copy(uiLanguage: ScoreUiLanguage = 'cs') {
  return uiLanguage === 'en' ? SCORE_SUMMARY_V2_COPY_EN : SCORE_SUMMARY_V2_COPY
}
