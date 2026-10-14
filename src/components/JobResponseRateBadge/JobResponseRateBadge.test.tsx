import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { JobResponseRateBadge } from './JobResponseRateBadge'
import {
  formatPercent,
  formatResponsesCount,
  getJobResponseRateCopy,
  getResponseRate,
  JOB_RESPONSE_RATE_DEFAULTS,
  type JobResponseRateStatus,
} from './jobResponseRateCopy'

const SOURCE = 'Srovnáno s podobnými inzeráty (stejná pozice, lokalita a portály).'

const cases: {
  status: JobResponseRateStatus
  label: string
  symbol: string | null
  title: string
  metric: { value: string; caption: string }
  hasScale: boolean
  lines: string[]
  source: string | null
}[] = [
  {
    status: 'above',
    label: 'Nad očekáváním',
    symbol: '▲',
    title: 'Míra odpovědí je vyšší než obvykle',
    metric: { value: '5,2 %', caption: '43 odpovědí z 830 zobrazení' },
    hasScale: true,
    lines: [],
    source: SOURCE,
  },
  {
    status: 'expected',
    label: 'Podle očekávání',
    symbol: '●',
    title: 'Míra odpovědí je zhruba obvyklá',
    metric: { value: '3,4 %', caption: '28 odpovědí z 830 zobrazení' },
    hasScale: true,
    lines: [],
    source: SOURCE,
  },
  {
    status: 'below',
    label: 'Pod očekáváním',
    symbol: '▼',
    title: 'Míra odpovědí je nižší než obvykle',
    metric: { value: '1,1 %', caption: '9 odpovědí z 830 zobrazení' },
    hasScale: true,
    lines: [],
    source: SOURCE,
  },
  {
    status: 'tooEarly',
    label: 'Zatím brzy',
    symbol: null,
    title: 'Zatím nelze spolehlivě vyhodnotit',
    metric: { value: '2,5 %', caption: '3 odpovědi ze 120 zobrazení' },
    hasScale: false,
    lines: ['Inzerát vyhodnotíme, až bude zobrazení víc (obvykle od 200).'],
    source: null,
  },
  {
    status: 'noComparison',
    label: 'Bez srovnání',
    symbol: null,
    title: 'Pro tuto pozici nemáme dost srovnatelných inzerátů',
    metric: { value: '2,8 %', caption: '14 odpovědí z 500 zobrazení' },
    hasScale: false,
    lines: ['Míru odpovědí neporovnáváme. Číslo míry odpovědí vidíte výše.'],
    source: null,
  },
]

describe('JobResponseRateBadge', () => {
  it.each(cases)('renders the $status label and symbol', ({ status, label, symbol }) => {
    render(<JobResponseRateBadge status={status} showInconclusive />)

    expect(screen.getByTestId('job-response-rate-badge')).toHaveAttribute('data-status', status)
    expect(screen.getByTestId('job-response-rate-badge-toggle')).toHaveTextContent(label)
    if (symbol) {
      expect(screen.getByTestId('job-response-rate-badge-symbol')).toHaveTextContent(symbol)
    } else {
      expect(screen.queryByTestId('job-response-rate-badge-symbol')).not.toBeInTheDocument()
    }
  })

  it('does not show the dropdown until hovered', () => {
    render(<JobResponseRateBadge status="above" />)

    expect(screen.queryByTestId('job-response-rate-badge-dropdown')).not.toBeInTheDocument()
  })

  it.each(cases)(
    'shows the $status dropdown content on hover',
    async ({ status, title, metric, hasScale, lines, source }) => {
      const user = userEvent.setup()
      render(<JobResponseRateBadge status={status} showInconclusive />)

      await user.hover(screen.getByTestId('job-response-rate-badge-toggle'))

      expect(await screen.findByTestId('job-response-rate-badge-title')).toHaveTextContent(title)
      expect(screen.getByTestId('job-response-rate-badge-metric-value')).toHaveTextContent(
        metric.value,
      )
      expect(screen.getByText(metric.caption)).toBeInTheDocument()

      if (hasScale) {
        expect(screen.getByTestId('job-response-rate-badge-scale')).toBeInTheDocument()
        expect(screen.getByText('2,5 %')).toBeInTheDocument()
        expect(screen.getByText('4,6 %')).toBeInTheDocument()
        expect(screen.getByText('Typická míra odpovědí u podobných inzerátů je 2–5 %.')).toBeInTheDocument()
      } else {
        expect(screen.queryByTestId('job-response-rate-badge-scale')).not.toBeInTheDocument()
      }

      for (const line of lines) {
        expect(screen.getByText(line)).toBeInTheDocument()
      }

      if (source) {
        expect(screen.getByTestId('job-response-rate-badge-source')).toHaveTextContent(source)
      } else {
        expect(screen.queryByTestId('job-response-rate-badge-source')).not.toBeInTheDocument()
      }
    },
  )

  it('positions the marker and the usual range on the scale', async () => {
    const user = userEvent.setup()
    render(<JobResponseRateBadge status="expected" />)

    await user.hover(screen.getByTestId('job-response-rate-badge-toggle'))

    const band = await screen.findByTestId('job-response-rate-badge-scale-band')
    const marker = screen.getByTestId('job-response-rate-badge-scale-marker')
    // Scale spans 0–8 %: usual range 2,5–4,6 %, rate 28 / 830 = 3,4 %.
    expect(parseFloat(band.style.left)).toBeCloseTo(31.25, 1)
    expect(parseFloat(band.style.width)).toBeCloseTo(26.25, 1)
    expect(parseFloat(marker.style.left)).toBeCloseTo(42.2, 0)
    expect(screen.getByRole('img').getAttribute('aria-label')?.replaceAll('\u00a0', ' ')).toBe(
      'Míra odpovědí 3,4 %, obvyklý rozsah 2,5 % až 4,6 %',
    )
  })

  it('derives the rate from responses and views and lets props override the numbers', async () => {
    const user = userEvent.setup()
    render(
      <JobResponseRateBadge
        status="above"
        responses={6}
        views={100}
        typicalMin={1}
        typicalMax={2}
      />,
    )

    await user.hover(screen.getByTestId('job-response-rate-badge-toggle'))

    expect(await screen.findByTestId('job-response-rate-badge-metric-value')).toHaveTextContent(
      '6,0 %',
    )
    expect(screen.getByText('6 odpovědí ze 100 zobrazení')).toBeInTheDocument()
    expect(screen.getByText('1,0 %')).toBeInTheDocument()
    expect(screen.getByText('2,0 %')).toBeInTheDocument()
    expect(screen.getByText('Typická míra odpovědí u podobných inzerátů je 1–2 %.')).toBeInTheDocument()
    expect(screen.getByTestId('job-response-rate-badge-source')).toHaveTextContent(
      'Srovnáno s podobnými inzeráty (stejná pozice, lokalita a portály).',
    )
  })
})

describe('JobResponseRateBadge inconclusive states', () => {
  it.each(['tooEarly', 'noComparison'] as const)('renders nothing for %s by default', (status) => {
    const { container } = render(<JobResponseRateBadge status={status} />)

    expect(container).toBeEmptyDOMElement()
  })

  it.each(['above', 'expected', 'below'] as const)('always renders %s', (status) => {
    render(<JobResponseRateBadge status={status} />)

    expect(screen.getByTestId('job-response-rate-badge')).toBeInTheDocument()
  })
})

describe('response rate helpers', () => {
  it('uses Czech plural forms', () => {
    expect(formatResponsesCount(0)).toBe('0 odpovědí')
    expect(formatResponsesCount(1)).toBe('1 odpověď')
    expect(formatResponsesCount(3)).toBe('3 odpovědi')
    expect(formatResponsesCount(5)).toBe('5 odpovědí')
  })

  it('formats percentages with a decimal comma', () => {
    expect(formatPercent(5.18)).toBe('5,2\u00a0%')
    expect(getResponseRate(43, 830)).toBeCloseTo(5.18, 2)
    expect(getResponseRate(0, 0)).toBe(0)
  })

  it('widens the scale when the rate exceeds the default range', () => {
    const copy = getJobResponseRateCopy('above', {
      ...JOB_RESPONSE_RATE_DEFAULTS.above,
      responses: 120,
      views: 830,
    })

    expect(copy.scale?.marker).toBeLessThanOrEqual(100)
    expect(copy.scale?.marker).toBeGreaterThan(copy.scale?.bandEnd ?? 0)
  })
})
