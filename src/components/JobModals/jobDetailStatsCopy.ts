import type { JobDetailStatsPeriod } from './jobDetailStatsPeriod'

export const JOB_DETAIL_STATS_COPY = {
  title: 'Detail inzerátu',
  periodLabel: 'Období',
  tableSectionTitle: 'Přehled',
  empty: 'Pro vybrané období nejsou k dispozici žádná data',
  error: 'Statistiky se nepodařilo načíst.',
  retry: 'Zkusit znovu',
  legend: {
    views: 'Zobrazení',
    reactions: 'Reakce',
  },
  columns: {
    place: 'Místo vystavení',
    publication: 'Vystavení',
    views: 'Zobrazení',
    reactions: 'Reakce',
  },
  tableAriaLabel: 'Souhrn statistik inzerátu',
  chartAriaLabel: 'Čárový graf zobrazení a reakcí inzerátu',
  periodLoading: 'Načítání statistik',
} as const

export const JOB_DETAIL_STATS_PERIOD_LABELS: Record<JobDetailStatsPeriod, string> = {
  sincePublication: 'Od začátku náboru',
  last6Months: 'Posledních 6 měsíců',
  lastMonth: 'Poslední měsíc',
}
