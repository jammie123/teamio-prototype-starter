import { cn } from '../../lib/cn'
import { Dropdown, DropdownBody, DropdownToggle } from '../Dropdown'
import {
  JOB_RESPONSE_RATE_DEFAULTS,
  getBandMarkerPosition,
  getJobResponseRateBands,
  getJobResponseRateCopy,
  formatPercent,
  getResponseRate,
  type JobResponseRateBandId,
  type JobResponseRateData,
  type JobResponseRateStatus,
} from '../JobResponseRateBadge/jobResponseRateCopy'
import { Tag, type TagColor } from '../Tag'

export interface JobResponseRateBadgeV2Props extends Partial<JobResponseRateData> {
  status: JobResponseRateStatus
  /**
   * Show the badge for `tooEarly` and `noComparison` too. By default these inconclusive
   * states render nothing; the copy is kept so they can be switched back on.
   */
  showInconclusive?: boolean
  className?: string
}

const INCONCLUSIVE_STATUSES: JobResponseRateStatus[] = ['tooEarly', 'noComparison']

const STATUS_COLOR: Record<JobResponseRateStatus, TagColor> = {
  above: 'success',
  expected: 'informative',
  below: 'warning',
  tooEarly: 'neutral',
  noComparison: 'neutral',
}

interface BandStyle {
  /** Colored bar on top of the band. */
  bar: string
  /** Band name and range color. */
  text: string
  /** Light background of the active band. */
  activeBackground: string
  /** Callout bubble and connector. */
  callout: string
}

const BAND_STYLE: Record<JobResponseRateBandId, BandStyle> = {
  below: {
    bar: 'tm-bg-emotion-warning-hover',
    text: 'tm-text-emotion-warning-emphasis',
    activeBackground: 'tm-bg-emotion-warning-background',
    callout: 'tm-bg-emotion-warning-hover',
  },
  expected: {
    bar: 'tm-bg-emotion-info-active',
    text: 'tm-text-emotion-info-emphasis',
    activeBackground: 'tm-bg-emotion-info-background',
    callout: 'tm-bg-emotion-info-active',
  },
  above: {
    bar: 'tm-bg-emotion-success-active',
    text: 'tm-text-emotion-success-emphasis',
    activeBackground: 'tm-bg-emotion-success-background',
    callout: 'tm-bg-emotion-success-active',
  },
}

function isBandStatus(status: JobResponseRateStatus): status is JobResponseRateBandId {
  return status === 'below' || status === 'expected' || status === 'above'
}

export function JobResponseRateBadgeV2({
  status,
  responses,
  views,
  typicalMin,
  typicalMax,
  minViews,
  showInconclusive = false,
  className,
}: JobResponseRateBadgeV2Props) {
  if (!showInconclusive && INCONCLUSIVE_STATUSES.includes(status)) {
    return null
  }

  const defaults = JOB_RESPONSE_RATE_DEFAULTS[status]
  const data: JobResponseRateData = {
    responses: responses ?? defaults.responses,
    views: views ?? defaults.views,
    typicalMin: typicalMin ?? defaults.typicalMin,
    typicalMax: typicalMax ?? defaults.typicalMax,
    minViews: minViews ?? defaults.minViews,
  }
  const copy = getJobResponseRateCopy(status, data)
  const rate = getResponseRate(data.responses, data.views)
  const rateLabel = formatPercent(rate)

  const bands = getJobResponseRateBands(data.typicalMin, data.typicalMax)
  const activeIndex = isBandStatus(status) ? bands.findIndex((band) => band.id === status) : -1
  const showChart = isBandStatus(status) && activeIndex >= 0

  // Marker position across the whole chart (three equally wide bands), in %.
  const markerLeft = showChart
    ? ((activeIndex + getBandMarkerPosition(status, rate, data.typicalMin, data.typicalMax)) /
        bands.length) *
      100
    : 0

  return (
    <Dropdown
      openOnHover
      hoverDelay={150}
      autoClose={false}
      placement="bottom-start"
      strategy="fixed"
      className={cn('tm-group', 'tm-inline-flex', className)}
      data-testid="job-response-rate-badge-v2"
      data-status={status}
    >
      <DropdownToggle
        variant="custom"
        className="tm-rounded-full tm-bg-transparent"
        data-testid="job-response-rate-badge-v2-toggle"
      >
        <Tag color={STATUS_COLOR[status]} isSubtle className="tm-cursor-default">
          <span>{copy.label}</span>
          {copy.symbol ? (
            <span aria-hidden="true" data-testid="job-response-rate-badge-v2-symbol">
              {copy.symbol}
            </span>
          ) : null}
        </Tag>
      </DropdownToggle>
      <DropdownBody
        data-testid="job-response-rate-badge-v2-dropdown"
        overflow="visible"
        initialFocus={-1}
        // DropdownBody caps its width at 20rem; this panel needs more room for three bands.
        className="!tm-max-w-none tm-rounded-[12px] tm-p-0"
      >
        <div className="tm-flex tm-w-[400px] tm-flex-col tm-px-4 tm-py-[14px] tm-text-13 tm-leading-tight">
          <div
            data-testid="job-response-rate-badge-v2-title"
            className="tm-mb-3 tm-font-semibold tm-text-primary-default"
          >
            {copy.title}
          </div>

          {showChart ? (
            <div
              role="img"
              aria-label={`Míra odpovědí ${rateLabel}, pásmo ${bands[activeIndex].label}, obvyklý rozsah ${formatPercent(data.typicalMin)} až ${formatPercent(data.typicalMax)}`}
              data-testid="job-response-rate-badge-v2-chart"
            >
              <div className="tm-relative tm-h-[52px]">
                <div
                  data-testid="job-response-rate-badge-v2-bubble"
                  className={cn(
                    'tm-absolute',
                    'tm-top-0',
                    'tm-w-max',
                    'tm-rounded-[8px]',
                    'tm-px-3',
                    'tm-py-[6px]',
                    'tm-text-center',
                    'tm-text-primary-inverted-default',
                    BAND_STYLE[status].callout,
                  )}
                  // Shifting by the same share keeps the bubble inside the chart at both ends.
                  style={{ left: `${markerLeft}%`, transform: `translateX(-${markerLeft}%)` }}
                >
                  <div className="tm-text-xs">Tento inzerát:</div>
                  <div
                    data-testid="job-response-rate-badge-v2-bubble-value"
                    className="tm-text-lg tm-font-bold tm-leading-tight tm-tabular-nums"
                  >
                    {rateLabel}
                  </div>
                </div>
              </div>
              <div className="tm-relative tm-h-[10px]">
                <div
                  data-testid="job-response-rate-badge-v2-connector"
                  className={cn(
                    'tm-absolute',
                    'tm-inset-y-0',
                    'tm-w-[2px]',
                    '-tm-ml-[1px]',
                    BAND_STYLE[status].callout,
                  )}
                  style={{ left: `${markerLeft}%` }}
                />
              </div>
              <div className="tm-grid tm-grid-cols-3 tm-gap-[2px]">
                {bands.map((band, index) => {
                  const isActive = index === activeIndex

                  return (
                    <div
                      key={band.id}
                      data-testid={`job-response-rate-badge-v2-band-${band.id}`}
                      data-active={isActive}
                      className="tm-flex tm-flex-col"
                    >
                      <div className={cn('tm-h-[6px]', 'tm-rounded-[3px]', BAND_STYLE[band.id].bar)} />
                      <div
                        className={cn(
                          'tm-flex',
                          'tm-flex-1',
                          'tm-flex-col',
                          'tm-items-center',
                          'tm-gap-0.5',
                          'tm-rounded-b-[4px]',
                          'tm-px-1',
                          'tm-pb-2',
                          'tm-pt-2',
                          'tm-text-center',
                          isActive && BAND_STYLE[band.id].activeBackground,
                        )}
                      >
                        <span
                          className={cn('tm-text-xs', 'tm-font-semibold', BAND_STYLE[band.id].text)}
                        >
                          {band.label}
                        </span>
                        <span className="tm-text-[11px] tm-tabular-nums tm-text-secondary-default">
                          {band.rangeLabel}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ) : copy.metric ? (
            <div className="tm-flex tm-items-baseline tm-gap-2">
              <span
                data-testid="job-response-rate-badge-v2-metric-value"
                className="tm-text-3xl tm-font-bold tm-leading-none tm-tabular-nums tm-text-primary-default"
              >
                {copy.metric.value}
              </span>
            </div>
          ) : null}

          {copy.metric ? (
            <div
              data-testid="job-response-rate-badge-v2-caption"
              className="tm-mt-3 tm-text-13 tm-text-secondary-default"
            >
              {copy.metric.caption}
            </div>
          ) : null}

          {copy.lines.map((line) => (
            <p key={line} className="tm-m-0 tm-mt-2 tm-text-secondary-default">
              {line}
            </p>
          ))}

          {copy.source ? (
            <div
              data-testid="job-response-rate-badge-v2-source"
              className="tm-mt-3 tm-border-0 tm-border-t tm-border-solid tm-border-secondary tm-pt-[9px] tm-text-xs tm-text-secondary-default"
            >
              {copy.source}
            </div>
          ) : null}
        </div>
      </DropdownBody>
    </Dropdown>
  )
}

JobResponseRateBadgeV2.displayName = 'JobResponseRateBadgeV2'
