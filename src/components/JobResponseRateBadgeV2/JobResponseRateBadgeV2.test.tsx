import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import {
  BAND_MARKER_MAX,
  BAND_MARKER_MIN,
  getBandMarkerPosition,
  getJobResponseRateBands,
  type JobResponseRateBandId,
} from '../JobResponseRateBadge/jobResponseRateCopy'
import { JobResponseRateBadgeV2 } from './JobResponseRateBadgeV2'

const cases: {
  status: JobResponseRateBandId
  label: string
  symbol: string
  title: string
  value: string
  caption: string
}[] = [
  {
    status: 'above',
    label: 'Nad očekáváním',
    symbol: '▲',
    title: 'Míra odpovědí je vyšší než obvykle',
    value: '5,2 %',
    caption: '43 odpovědí z 830 zobrazení',
  },
  {
    status: 'expected',
    label: 'Podle očekávání',
    symbol: '●',
    title: 'Míra odpovědí je zhruba obvyklá',
    value: '3,4 %',
    caption: '28 odpovědí z 830 zobrazení',
  },
  {
    status: 'below',
    label: 'Pod očekáváním',
    symbol: '▼',
    title: 'Míra odpovědí je nižší než obvykle',
    value: '1,1 %',
    caption: '9 odpovědí z 830 zobrazení',
  },
]

const BAND_IDS: JobResponseRateBandId[] = ['below', 'expected', 'above']

async function openDropdown() {
  const user = userEvent.setup()
  await user.hover(screen.getByTestId('job-response-rate-badge-v2-toggle'))
  await screen.findByTestId('job-response-rate-badge-v2-dropdown')
}

describe('JobResponseRateBadgeV2', () => {
  it.each(cases)('renders the $status badge label and symbol', ({ status, label, symbol }) => {
    render(<JobResponseRateBadgeV2 status={status} />)

    expect(screen.getByTestId('job-response-rate-badge-v2')).toHaveAttribute('data-status', status)
    expect(screen.getByTestId('job-response-rate-badge-v2-toggle')).toHaveTextContent(label)
    expect(screen.getByTestId('job-response-rate-badge-v2-symbol')).toHaveTextContent(symbol)
  })

  it('does not show the dropdown until hovered', () => {
    render(<JobResponseRateBadgeV2 status="expected" />)

    expect(screen.queryByTestId('job-response-rate-badge-v2-dropdown')).not.toBeInTheDocument()
  })

  it.each(cases)(
    'shows the $status title, bubble value and caption on hover',
    async ({ status, title, value, caption }) => {
      render(<JobResponseRateBadgeV2 status={status} />)
      await openDropdown()

      expect(screen.getByTestId('job-response-rate-badge-v2-title')).toHaveTextContent(title)
      expect(screen.getByTestId('job-response-rate-badge-v2-bubble')).toHaveTextContent('Tento inzerát:')
      expect(screen.getByTestId('job-response-rate-badge-v2-bubble-value')).toHaveTextContent(value)
      expect(screen.getByTestId('job-response-rate-badge-v2-caption')).toHaveTextContent(caption)
      expect(screen.getByTestId('job-response-rate-badge-v2-source')).toHaveTextContent(
        'Srovnáno s podobnými inzeráty (stejná pozice, lokalita a portály).',
      )
    },
  )

  it.each(cases)('highlights only the $status band', async ({ status }) => {
    render(<JobResponseRateBadgeV2 status={status} />)
    await openDropdown()

    for (const id of BAND_IDS) {
      expect(screen.getByTestId(`job-response-rate-badge-v2-band-${id}`)).toHaveAttribute(
        'data-active',
        String(id === status),
      )
    }
  })

  it('lists the three bands with their ranges', async () => {
    render(<JobResponseRateBadgeV2 status="expected" />)
    await openDropdown()

    expect(screen.getByText('Pod očekáváním')).toBeInTheDocument()
    expect(screen.getByText('Podle očekávání', { selector: 'span.tm-font-semibold' })).toBeInTheDocument()
    expect(screen.getByText('Nad očekáváním')).toBeInTheDocument()
    expect(screen.getByText('do 2,5 %')).toBeInTheDocument()
    expect(screen.getByText('2,5–4,6 %')).toBeInTheDocument()
    expect(screen.getByText('od 4,6 %')).toBeInTheDocument()
  })

  it('describes the chart for assistive technology', async () => {
    render(<JobResponseRateBadgeV2 status="expected" />)
    await openDropdown()

    const label = screen.getByRole('img').getAttribute('aria-label')?.replaceAll('\u00a0', ' ')
    expect(label).toBe(
      'Míra odpovědí 3,4 %, pásmo Podle očekávání, obvyklý rozsah 2,5 % až 4,6 %',
    )
  })

  it('places the bubble and connector over the active band', async () => {
    render(<JobResponseRateBadgeV2 status="expected" />)
    await openDropdown()

    // Middle band, rate 28 / 830 = 3,37 %: (3,37 - 2,5) / 2,1 = 0,42 of the band.
    const expectedLeft = ((1 + 0.4155) / 3) * 100
    const connector = screen.getByTestId('job-response-rate-badge-v2-connector')
    expect(parseFloat(connector.style.left)).toBeCloseTo(expectedLeft, 0)
    expect(screen.getByTestId('job-response-rate-badge-v2-bubble').style.left).toBe(
      connector.style.left,
    )
  })

  it('recomputes the bands from typicalMin and typicalMax', async () => {
    render(<JobResponseRateBadgeV2 status="above" responses={90} views={1000} typicalMin={3} typicalMax={6} />)
    await openDropdown()

    expect(screen.getByText('do 3,0 %')).toBeInTheDocument()
    expect(screen.getByText('3,0–6,0 %')).toBeInTheDocument()
    expect(screen.getByText('od 6,0 %')).toBeInTheDocument()
    expect(screen.getByTestId('job-response-rate-badge-v2-bubble-value')).toHaveTextContent('9,0 %')
  })
})

describe('JobResponseRateBadgeV2 inconclusive states', () => {
  it.each(['tooEarly', 'noComparison'] as const)('renders nothing for %s by default', (status) => {
    const { container } = render(<JobResponseRateBadgeV2 status={status} />)

    expect(container).toBeEmptyDOMElement()
  })

  it.each(['tooEarly', 'noComparison'] as const)(
    'shows %s without the segment chart when enabled',
    async (status) => {
      render(<JobResponseRateBadgeV2 status={status} showInconclusive />)
      await openDropdown()

      expect(screen.queryByTestId('job-response-rate-badge-v2-chart')).not.toBeInTheDocument()
      expect(screen.getByTestId('job-response-rate-badge-v2-metric-value')).toBeInTheDocument()
    },
  )
})

describe('getJobResponseRateBands', () => {
  it('returns the three bands from the lowest to the highest rate', () => {
    expect(getJobResponseRateBands(2.5, 4.6).map((band) => band.id)).toEqual(BAND_IDS)
  })
})

describe('getBandMarkerPosition', () => {
  it('positions the rate proportionally inside the usual range', () => {
    expect(getBandMarkerPosition('expected', 3.55, 2.5, 4.6)).toBeCloseTo(0.5, 2)
  })

  it('positions the rate proportionally below the usual range', () => {
    expect(getBandMarkerPosition('below', 1.25, 2.5, 4.6)).toBeCloseTo(0.5, 2)
  })

  it('positions the rate proportionally above the usual range', () => {
    expect(getBandMarkerPosition('above', 5.65, 2.5, 4.6)).toBeCloseTo(0.5, 2)
  })

  it('keeps the marker inside the band', () => {
    expect(getBandMarkerPosition('expected', 2.5, 2.5, 4.6)).toBe(BAND_MARKER_MIN)
    expect(getBandMarkerPosition('below', 0, 2.5, 4.6)).toBe(BAND_MARKER_MIN)
    expect(getBandMarkerPosition('above', 20, 2.5, 4.6)).toBe(BAND_MARKER_MAX)
  })

  it('falls back to the middle of a band with no usable range', () => {
    expect(getBandMarkerPosition('expected', 3, 3, 3)).toBe(0.5)
    expect(getBandMarkerPosition('below', 1, 0, 3)).toBe(0.5)
  })
})
