/** Placeholder help article URL for AI candidate scoring. */
export const SCORE_SUMMARY_HELP_URL = 'https://napoveda.teamio.com/ai-hodnoceni-uchazece'

export const SCORE_SUMMARY_COPY = {
  title: 'Shoda uchazeče s pozicí',
  evaluateLabel: 'Spustit AI hodnocení',
  summaryHeading: 'Shrnutí uchazeče',
  criteriaHeading: 'Jak uchazeč splňuje vaše požadavky',
  questionsHeading: 'Otázky na ověření',
  notEvaluated:
    'Umožňuje ohodnotit kandidáty pomocí AI podle kritérií náboru a zobrazit výslednou shodu uchazeče s pozicí.',
  helpLink: 'Více v nápovědě',
  insufficientData:
    'Uchazeče se nepodařilo ohodnotit – chybí podklady. Uchazeč buď nenahrál přílohy a odpovědi z formuláře nestačí, nebo jsou přílohy v nečitelném formátu (např. obrázky). Nahrajte přílohy v textovém formátu (PDF, DOCX apod.) a spusťte hodnocení znovu.',
  insufficientDataHelpLink: 'Více informací v nápovědě',
  error: 'Nepodařilo se ohodnotit. Zkuste znovu.',
  evaluating: 'Probíhá AI hodnocení uchazeče. Může to chvíli trvat.',
  evaluatingStatus: 'Probíhá AI hodnocení',
  insufficientDataBadge: 'Nedostatek dat pro hodnocení',
  errorBadge: 'Hodnocení se nepodařilo',
  criterionStatus: {
    met: 'splněno',
    partial: 'částečně splněno',
    unmet: 'nesplněno',
  },
  scoreBadgeLabel: (score: number) => `Shoda ${score} %`,
} as const
