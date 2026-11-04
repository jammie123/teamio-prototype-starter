import { useCallback, useId, useMemo, useState, type MouseEvent } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '../../lib/cn'
import { formatCount } from '../JobCard/formatCount'
import { JOB_DETAIL_STATS_COPY } from './jobDetailStatsCopy'
import { formatJobDetailStatsChartDate, type JobDetailStatsTimeSeriesPoint } from './jobDetailStatsPeriod'

/** Matches theme purple.500 and brand-blue.600 from src/styles/colors.js */
const CHART_STROKE = {
  views: '#a866ff',
  reactions: '#0087d6',
} as const

const VIEWBOX = { width: 800, height: 216 }
const PLOT = { left: 44, right: 744, top: 16, bottom: 180 }
const GRID_YS = [16, 57, 98, 139]

export type JobDetailStatsSeriesKey = 'views' | 'reactions'

export interface JobDetailStatsHiddenSeries {
  views: boolean
  reactions: boolean
}

export interface JobDetailStatsChartProps {
  series: JobDetailStatsTimeSeriesPoint[]
  hiddenSeries: JobDetailStatsHiddenSeries
  onToggleSeries: (key: JobDetailStatsSeriesKey) => void
  ariaLabel?: string
  className?: string
}

function niceCeil(value: number): number {
  if (value <= 0) {
    return 1
  }
  const magnitude = 10 ** Math.floor(Math.log10(value))
  const normalized = value / magnitude
  let nice: number
  if (normalized <= 1) {
    nice = 1
  } else if (normalized <= 2) {
    nice = 2
  } else if (normalized <= 5) {
    nice = 5
  } else {
    nice = 10
  }
  return nice * magnitude
}

function buildTicks(maxValue: number): number[] {
  const top = niceCeil(maxValue)
  const step = top / 4
  return [top, step * 3, step * 2, step, 0]
}

function yForValue(value: number, max: number, bottom: number, top: number): number {
  if (max <= 0) {
    return bottom
  }
  const ratio = value / max
  return bottom - ratio * (bottom - top)
}

function pointsToPolyline(
  series: JobDetailStatsTimeSeriesPoint[],
  valueKey: 'views' | 'reactions',
  max: number,
): string {
  if (series.length === 0) {
    return ''
  }
  const width = PLOT.right - PLOT.left
  const lastIndex = Math.max(series.length - 1, 1)
  return series
    .map((point, index) => {
      const x = PLOT.left + (index / lastIndex) * width
      const y = yForValue(point[valueKey], max, PLOT.bottom, PLOT.top)
      return `${x},${y}`
    })
    .join(' ')
}

interface TooltipState {
  index: number
  clientX: number
  clientY: number
}

export function JobDetailStatsChart({
  series,
  hiddenSeries,
  onToggleSeries,
  ariaLabel = JOB_DETAIL_STATS_COPY.chartAriaLabel,
  className,
}: JobDetailStatsChartProps) {
  const legendId = useId()
  const [tooltip, setTooltip] = useState<TooltipState | null>(null)

  const maxViews = useMemo(
    () => Math.max(0, ...series.map((point) => point.views)),
    [series],
  )
  const maxReactions = useMemo(
    () => Math.max(0, ...series.map((point) => point.reactions)),
    [series],
  )

  const viewTicks = useMemo(() => buildTicks(maxViews), [maxViews])
  const reactionTicks = useMemo(() => buildTicks(maxReactions), [maxReactions])
  const viewsMax = viewTicks[0]
  const reactionsMax = reactionTicks[0]

  const xLabelIndices = useMemo(() => {
    if (series.length <= 1) {
      return series.length === 1 ? [0] : []
    }
    const count = Math.min(5, series.length)
    const indices: number[] = []
    for (let i = 0; i < count; i += 1) {
      indices.push(Math.round((i / (count - 1)) * (series.length - 1)))
    }
    return indices
  }, [series.length])

  const updateTooltipFromEvent = useCallback(
    (event: MouseEvent<SVGRectElement>) => {
      if (series.length === 0) {
        return
      }
      const svg = event.currentTarget.ownerSVGElement
      if (!svg) {
        return
      }
      const rect = svg.getBoundingClientRect()
      const relativeX = ((event.clientX - rect.left) / rect.width) * VIEWBOX.width
      const plotWidth = PLOT.right - PLOT.left
      const clamped = Math.min(Math.max(relativeX - PLOT.left, 0), plotWidth)
      const index =
        series.length === 1 ? 0 : Math.round((clamped / plotWidth) * (series.length - 1))
      setTooltip({
        index,
        clientX: event.clientX,
        clientY: event.clientY,
      })
    },
    [series.length],
  )

  const activePoint = tooltip != null ? series[tooltip.index] : null

  return (
    <div className={cn('tm-flex tm-flex-col tm-gap-4', className)}>
      <div
        id={legendId}
        className="tm-flex tm-flex-wrap tm-items-center tm-gap-x-6 tm-gap-y-2"
        role="group"
        aria-label="Legenda grafu"
      >
        <LegendToggle
          seriesKey="views"
          label={JOB_DETAIL_STATS_COPY.legend.views}
          color={CHART_STROKE.views}
          dashed={false}
          hidden={hiddenSeries.views}
          onToggle={() => onToggleSeries('views')}
        />
        <LegendToggle
          seriesKey="reactions"
          label={JOB_DETAIL_STATS_COPY.legend.reactions}
          color={CHART_STROKE.reactions}
          dashed
          hidden={hiddenSeries.reactions}
          onToggle={() => onToggleSeries('reactions')}
        />
      </div>

      <div className="tm-relative tm-w-full tm-overflow-visible">
        <svg
          viewBox={`0 0 ${VIEWBOX.width} ${VIEWBOX.height}`}
          width="100%"
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label={ariaLabel}
          className="tm-block tm-max-w-full"
        >
          <g stroke="#E0E0E0" strokeWidth={1}>
            {GRID_YS.map((y) => (
              <line key={y} x1={PLOT.left} y1={y} x2={PLOT.right} y2={y} />
            ))}
          </g>
          <line
            x1={PLOT.left}
            y1={PLOT.bottom}
            x2={PLOT.right}
            y2={PLOT.bottom}
            stroke="#999999"
            strokeWidth={1}
          />

          <g fontFamily="inherit" fontSize={12} fill="#666666" textAnchor="end">
            {viewTicks.map((tick) => (
              <text
                key={`views-${tick}`}
                x={36}
                y={yForValue(tick, viewsMax, PLOT.bottom, PLOT.top) + 4}
              >
                {formatCount(Math.round(tick))}
              </text>
            ))}
          </g>
          <g fontFamily="inherit" fontSize={12} fill="#666666" textAnchor="start">
            {reactionTicks.map((tick) => (
              <text
                key={`reactions-${tick}`}
                x={754}
                y={yForValue(tick, reactionsMax, PLOT.bottom, PLOT.top) + 4}
              >
                {formatCount(Math.round(tick))}
              </text>
            ))}
          </g>

          <g fontFamily="inherit" fontSize={12} fill="#666666" textAnchor="middle">
            {xLabelIndices.map((index) => {
              const width = PLOT.right - PLOT.left
              const lastIndex = Math.max(series.length - 1, 1)
              const x = PLOT.left + (index / lastIndex) * width
              return (
                <text key={series[index]?.date ?? index} x={x} y={204}>
                  {formatJobDetailStatsChartDate(series[index].date)}
                </text>
              )
            })}
          </g>

          {!hiddenSeries.views ? (
            <polyline
              fill="none"
              stroke={CHART_STROKE.views}
              strokeWidth={2.5}
              strokeLinejoin="round"
              strokeLinecap="round"
              points={pointsToPolyline(series, 'views', viewsMax)}
              data-testid="job-detail-stats-chart-views"
            />
          ) : null}

          {!hiddenSeries.reactions ? (
            <polyline
              fill="none"
              stroke={CHART_STROKE.reactions}
              strokeWidth={2.5}
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeDasharray="7 5"
              points={pointsToPolyline(series, 'reactions', reactionsMax)}
              data-testid="job-detail-stats-chart-reactions"
            />
          ) : null}

          {series.length > 0 ? (
            <rect
              x={PLOT.left}
              y={PLOT.top}
              width={PLOT.right - PLOT.left}
              height={PLOT.bottom - PLOT.top}
              fill="transparent"
              onMouseMove={updateTooltipFromEvent}
              onMouseLeave={() => setTooltip(null)}
            />
          ) : null}
        </svg>

        {tooltip != null && activePoint
          ? createPortal(
              <div
                role="tooltip"
                data-testid="job-detail-stats-chart-tooltip"
                className={cn(
                  'tm-pointer-events-none',
                  'tm-fixed',
                  'tm-z-[100]',
                  'tm-max-w-xs',
                  'tm-rounded',
                  'tm-border',
                  'tm-border-secondary',
                  'tm-bg-basic',
                  'tm-px-3',
                  'tm-py-2',
                  'tm-text-sm',
                  'tm-shadow',
                  'tm-font-poppins',
                )}
                style={{
                  left: tooltip.clientX + 12,
                  top: tooltip.clientY + 12,
                }}
              >
                <p className="tm-m-0 tm-font-semibold tm-text-primary-default">
                  {formatJobDetailStatsChartDate(activePoint.date)}
                </p>
                <p className="tm-m-0 tm-mt-1 tm-text-secondary-default">
                  {JOB_DETAIL_STATS_COPY.legend.views}: {formatCount(activePoint.views)}
                </p>
                <p className="tm-m-0 tm-text-secondary-default">
                  {JOB_DETAIL_STATS_COPY.legend.reactions}: {formatCount(activePoint.reactions)}
                </p>
              </div>,
              document.body,
            )
          : null}
      </div>
    </div>
  )
}

JobDetailStatsChart.displayName = 'JobDetailStatsChart'

interface LegendToggleProps {
  seriesKey: JobDetailStatsSeriesKey
  label: string
  color: string
  dashed: boolean
  hidden: boolean
  onToggle: () => void
}

function LegendToggle({ seriesKey, label, color, dashed, hidden, onToggle }: LegendToggleProps) {
  return (
    <button
      type="button"
      data-testid={`job-detail-stats-legend-${seriesKey}`}
      aria-pressed={!hidden}
      onClick={onToggle}
      className={cn(
        'tm-inline-flex',
        'tm-items-center',
        'tm-gap-2',
        'tm-rounded',
        'tm-border-0',
        'tm-bg-transparent',
        'tm-p-1',
        'tm-text-sm',
        'tm-cursor-pointer',
        'focus:tm-outline-0',
        'focus-visible:tm-ring',
        hidden && 'tm-opacity-50',
      )}
    >
      <svg width={28} height={8} aria-hidden="true" className="tm-shrink-0">
        <line
          x1={0}
          y1={4}
          x2={28}
          y2={4}
          stroke={color}
          strokeWidth={3}
          strokeLinecap="round"
          strokeDasharray={dashed ? '6 5' : undefined}
        />
      </svg>
      <span className="tm-text-secondary-default">{label}</span>
    </button>
  )
}
