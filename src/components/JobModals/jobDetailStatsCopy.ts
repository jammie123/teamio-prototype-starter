import type { JobDetailStatsPeriod } from './jobDetailStatsPeriod'

export const JOB_DETAIL_STATS_COPY = {
  title: 'Detail inzerátu',
  periodLabel: 'Období',
  changePeriod: 'Změnit',
  empty: 'Pro vybrané období nejsou k dispozici žádná data',
  error: 'Statistiky se nepodařilo načíst.',
  retry: 'Zkusit znovu',
  legend: {
    views: 'Zobrazení',
    reactions: 'Reakce',
  },
  columns: {
    place: 'Místo vystavení',
    published: 'Vystaveno',
    views: 'Zobrazení',
    reactions: 'Reakce',
    reactionRate: 'Míra reakce',
    total: 'Celkem',
  },
  tooltip: {
    total: 'Celkem',
  },
  openPlace: 'Otevřít na portálu',
  tableAriaLabel: 'Souhrn statistik inzerátu',
  chartAriaLabel: 'Čárový graf zobrazení a reakcí inzerátu',
  periodLoading: 'Načítání statistik',
} as const

export const JOB_DETAIL_STATS_PERIOD_LABELS: Record<JobDetailStatsPeriod, string> = {
  sincePublication: 'Od začátku náboru',
  last6Months: 'Posledních 6 měsíců',
  lastMonth: 'Poslední měsíc',
}
