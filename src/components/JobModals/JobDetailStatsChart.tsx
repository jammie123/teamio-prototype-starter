import { useCallback, useId, useMemo, useState, type MouseEvent } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '../../lib/cn'
import { formatCount } from '../JobCard/formatCount'
import { JobPortalLogo, jobPortalLogoTypeFromChannel } from '../JobPortalLogo'
import { JOB_DETAIL_STATS_COPY } from './jobDetailStatsCopy'
import { formatJobDetailStatsChartDate, type JobDetailStatsTimeSeriesPoint } from './jobDetailStatsPeriod'

/** Matches theme purple.500 and brand-blue.600 from src/styles/colors.js */
export const JOB_DETAIL_STATS_CHART_STROKE = {
  views: '#a866ff',
  reactions: '#0087d6',
} as const

const VIEWBOX = { width: 800, height: 152 }
const PLOT = { left: 44, right: 744, top: 8, bottom: 128 }
const GRID_YS = [8, 38, 68, 98]
const X_LABEL_Y = 144

export type JobDetailStatsSeriesKey = 'views' | 'reactions'

export interface JobDetailStatsHiddenSeries {
  views: boolean
  reactions: boolean
}

export interface JobDetailStatsChartProps {
  series: JobDetailStatsTimeSeriesPoint[]
  hiddenSeries: JobDetailStatsHiddenSeries
  onToggleSeries: (key: JobDetailStatsSeriesKey) => void
  /** Render the legend above the chart. Set to `false` when placing `JobDetailStatsLegend` elsewhere. */
  showLegend?: boolean
  ariaLabel?: string
  className?: string
}

export interface JobDetailStatsLegendProps {
  hiddenSeries: JobDetailStatsHiddenSeries
  onToggleSeries: (key: JobDetailStatsSeriesKey) => void
  className?: string
}

export function JobDetailStatsLegend({
  hiddenSeries,
  onToggleSeries,
  className,
}: JobDetailStatsLegendProps) {
  const legendId = useId()

  return (
    <div
      id={legendId}
      className={cn(
        'tm-flex tm-flex-wrap tm-items-center tm-gap-x-6 tm-gap-y-2',
        className,
      )}
      role="group"
      aria-label="Legenda grafu"
    >
      <LegendToggle
        seriesKey="views"
        label={JOB_DETAIL_STATS_COPY.legend.views}
        color={JOB_DETAIL_STATS_CHART_STROKE.views}
        dashed={false}
        hidden={hiddenSeries.views}
        onToggle={() => onToggleSeries('views')}
      />
      <LegendToggle
        seriesKey="reactions"
        label={JOB_DETAIL_STATS_COPY.legend.reactions}
        color={JOB_DETAIL_STATS_CHART_STROKE.reactions}
        dashed
        hidden={hiddenSeries.reactions}
        onToggle={() => onToggleSeries('reactions')}
      />
    </div>
  )
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

function indexToPlotX(index: number, seriesLength: number): number {
  const width = PLOT.right - PLOT.left
  const lastIndex = Math.max(seriesLength - 1, 1)
  return PLOT.left + (index / lastIndex) * width
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
  anchorLeft: number
  anchorTop: number
}

function ChartLegendLine({
  color,
  dashed = false,
  width = 20,
}: {
  color: string
  dashed?: boolean
  width?: number
}) {
  return (
    <svg width={width} height={8} aria-hidden="true" className="tm-shrink-0">
      <line
        x1={0}
        y1={4}
        x2={width}
        y2={4}
        stroke={color}
        strokeWidth={3}
        strokeLinecap="round"
        strokeDasharray={dashed ? '6 5' : undefined}
      />
    </svg>
  )
}

export function JobDetailStatsChart({
  series,
  hiddenSeries,
  onToggleSeries,
  showLegend = true,
  ariaLabel = JOB_DETAIL_STATS_COPY.chartAriaLabel,
  className,
}: JobDetailStatsChartProps) {
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

  const resolveIndexFromEvent = useCallback(
    (event: MouseEvent<SVGRectElement>) => {
      const svg = event.currentTarget.ownerSVGElement
      if (!svg || series.length === 0) {
        return null
      }
      const rect = svg.getBoundingClientRect()
      const relativeX = ((event.clientX - rect.left) / rect.width) * VIEWBOX.width
      const plotWidth = PLOT.right - PLOT.left
      const clamped = Math.min(Math.max(relativeX - PLOT.left, 0), plotWidth)
      const index =
        series.length === 1 ? 0 : Math.round((clamped / plotWidth) * (series.length - 1))
      const xView = indexToPlotX(index, series.length)
      const anchorLeft = rect.left + (xView / VIEWBOX.width) * rect.width
      return { index, anchorLeft, anchorTop: rect.top }
    },
    [series.length],
  )

  const updateTooltipFromEvent = useCallback(
    (event: MouseEvent<SVGRectElement>) => {
      const next = resolveIndexFromEvent(event)
      if (next) {
        setTooltip(next)
      }
    },
    [resolveIndexFromEvent],
  )

  const activePoint = tooltip != null ? series[tooltip.index] : null
  const crosshairX = tooltip != null ? indexToPlotX(tooltip.index, series.length) : null

  return (
    <div className={cn('tm-flex tm-flex-col tm-gap-2', className)}>
      {showLegend ? (
        <JobDetailStatsLegend hiddenSeries={hiddenSeries} onToggleSeries={onToggleSeries} />
      ) : null}

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
                <text key={series[index]?.date ?? index} x={x} y={X_LABEL_Y}>
                  {formatJobDetailStatsChartDate(series[index].date)}
                </text>
              )
            })}
          </g>

          {!hiddenSeries.views ? (
            <polyline
              fill="none"
              stroke={JOB_DETAIL_STATS_CHART_STROKE.views}
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
              stroke={JOB_DETAIL_STATS_CHART_STROKE.reactions}
              strokeWidth={2.5}
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeDasharray="7 5"
              points={pointsToPolyline(series, 'reactions', reactionsMax)}
              data-testid="job-detail-stats-chart-reactions"
            />
          ) : null}

          {crosshairX != null ? (
            <g pointerEvents="none" data-testid="job-detail-stats-chart-crosshair">
              <line
                x1={crosshairX}
                y1={PLOT.top}
                x2={crosshairX}
                y2={PLOT.bottom}
                stroke="#767676"
                strokeWidth={1}
                strokeDasharray="4 3"
              />
              {!hiddenSeries.views && activePoint ? (
                <circle
                  cx={crosshairX}
                  cy={yForValue(activePoint.views, viewsMax, PLOT.bottom, PLOT.top)}
                  r={4.5}
                  fill={JOB_DETAIL_STATS_CHART_STROKE.views}
                  stroke="#FFFFFF"
                  strokeWidth={2}
                />
              ) : null}
              {!hiddenSeries.reactions && activePoint ? (
                <circle
                  cx={crosshairX}
                  cy={yForValue(activePoint.reactions, reactionsMax, PLOT.bottom, PLOT.top)}
                  r={4.5}
                  fill={JOB_DETAIL_STATS_CHART_STROKE.reactions}
                  stroke="#FFFFFF"
                  strokeWidth={2}
                />
              ) : null}
            </g>
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
                  'tm-min-w-[14rem]',
                  'tm-max-w-sm',
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
                  left: tooltip.anchorLeft,
                  top: tooltip.anchorTop - 8,
                  transform: 'translate(-50%, -100%)',
                }}
              >
                <p className="tm-m-0 tm-mb-2 tm-border-b tm-border-secondary tm-pb-2 tm-text-center tm-font-semibold tm-text-primary-default">
                  {formatJobDetailStatsChartDate(activePoint.date)}
                </p>
                <ul className="tm-m-0 tm-flex tm-list-none tm-flex-col tm-gap-2 tm-p-0">
                  {(activePoint.byPlace ?? []).map((place) => (
                    <li
                      key={place.placeId}
                      className="tm-flex tm-items-center tm-gap-2 tm-text-secondary-default"
                    >
                      <JobPortalLogo
                        type={place.logoType ?? jobPortalLogoTypeFromChannel(place.placeName)}
                        title=""
                        className="tm-size-4"
                      />
                      <span className="tm-min-w-0 tm-flex-1 tm-truncate tm-font-medium tm-text-primary-default">
                        {place.placeName}
                      </span>
                      <span className="tm-flex tm-shrink-0 tm-items-center tm-gap-2 tm-tabular-nums">
                        <span
                          className="tm-inline-flex tm-items-center tm-gap-1"
                          title={JOB_DETAIL_STATS_COPY.legend.views}
                        >
                          <ChartLegendLine color={JOB_DETAIL_STATS_CHART_STROKE.views} width={16} />
                          {formatCount(place.views)}
                        </span>
                        <span
                          className="tm-inline-flex tm-items-center tm-gap-1"
                          title={JOB_DETAIL_STATS_COPY.legend.reactions}
                        >
                          <ChartLegendLine
                            color={JOB_DETAIL_STATS_CHART_STROKE.reactions}
                            dashed
                            width={16}
                          />
                          {formatCount(place.reactions)}
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>
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
      <ChartLegendLine color={color} dashed={dashed} width={28} />
      <span className="tm-text-secondary-default">{label}</span>
    </button>
  )
}
