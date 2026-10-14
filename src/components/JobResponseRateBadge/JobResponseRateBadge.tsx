import { cn } from '../../lib/cn'
import { Dropdown, DropdownBody, DropdownToggle } from '../Dropdown'
import { Tag, type TagColor } from '../Tag'
import {
  JOB_RESPONSE_RATE_DEFAULTS,
  getJobResponseRateCopy,
  type JobResponseRateData,
  type JobResponseRateStatus,
} from './jobResponseRateCopy'

export interface JobResponseRateBadgeProps extends Partial<JobResponseRateData> {
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

/** Emphasis color of the highlighted rate, matching the badge color. */
const STATUS_VALUE_CLASS: Record<JobResponseRateStatus, string> = {
  above: 'tm-text-emotion-success-emphasis',
  expected: 'tm-text-emotion-info-emphasis',
  below: 'tm-text-emotion-warning-emphasis',
  tooEarly: 'tm-text-primary-default',
  noComparison: 'tm-text-primary-default',
}

const STATUS_MARKER_CLASS: Record<JobResponseRateStatus, string> = {
  above: 'tm-bg-emotion-success-emphasis',
  expected: 'tm-bg-emotion-info-emphasis',
  below: 'tm-bg-emotion-warning-emphasis',
  tooEarly: 'tm-bg-text-primary-default',
  noComparison: 'tm-bg-text-primary-default',
}

export function JobResponseRateBadge({
  status,
  responses,
  views,
  typicalMin,
  typicalMax,
  minViews,
  showInconclusive = false,
  className,
}: JobResponseRateBadgeProps) {
  if (!showInconclusive && INCONCLUSIVE_STATUSES.includes(status)) {
    return null
  }

  const defaults = JOB_RESPONSE_RATE_DEFAULTS[status]
  const copy = getJobResponseRateCopy(status, {
    responses: responses ?? defaults.responses,
    views: views ?? defaults.views,
    typicalMin: typicalMin ?? defaults.typicalMin,
    typicalMax: typicalMax ?? defaults.typicalMax,
    minViews: minViews ?? defaults.minViews,
  })

  return (
    <Dropdown
      openOnHover
      hoverDelay={150}
      autoClose={false}
      placement="bottom-start"
      strategy="fixed"
      className={cn('tm-group', 'tm-inline-flex', className)}
      data-testid="job-response-rate-badge"
      data-status={status}
    >
      <DropdownToggle
        variant="custom"
        className="tm-rounded-full tm-bg-transparent"
        data-testid="job-response-rate-badge-toggle"
      >
        <Tag color={STATUS_COLOR[status]} isSubtle className="tm-cursor-default">
          <span>{copy.label}</span>
          {copy.symbol ? (
            <span aria-hidden="true" data-testid="job-response-rate-badge-symbol">
              {copy.symbol}
            </span>
          ) : null}
        </Tag>
      </DropdownToggle>
      <DropdownBody
        data-testid="job-response-rate-badge-dropdown"
        overflow="visible"
        initialFocus={-1}
        className="tm-rounded-[12px] tm-p-0"
      >
        <div className="tm-flex tm-w-[290px] tm-flex-col tm-px-4 tm-py-[14px] tm-text-13 tm-leading-tight">
          <div
            data-testid="job-response-rate-badge-title"
            className="tm-mb-1 tm-font-semibold tm-text-primary-default"
          >
            {copy.title}
          </div>
          {copy.metric ? (
            <div
              className="tm-flex tm-items-baseline tm-gap-2"
              data-testid="job-response-rate-badge-metric"
            >
              <span
                data-testid="job-response-rate-badge-metric-value"
                className={cn(
                  'tm-text-3xl',
                  'tm-font-bold',
                  'tm-leading-none',
                  'tm-tracking-[-0.5px]',
                  'tm-tabular-nums',
                  'tm-whitespace-nowrap',
                  STATUS_VALUE_CLASS[status],
                )}
              >
                {copy.metric.value}
              </span>
              <span className="tm-text-13 tm-text-secondary-default">{copy.metric.caption}</span>
            </div>
          ) : null}
          {copy.scale ? (
            <div data-testid="job-response-rate-badge-scale">
              <div
                role="img"
                aria-label={copy.scale.description}
                className="tm-relative tm-mb-[6px] tm-mt-[18px] tm-h-[6px] tm-rounded-[3px] tm-bg-cover-dark"
              >
                <div
                  data-testid="job-response-rate-badge-scale-band"
                  className="tm-absolute tm-inset-y-0 tm-rounded-[3px] tm-bg-text-light-default"
                  style={{
                    left: `${copy.scale.bandStart}%`,
                    width: `${copy.scale.bandEnd - copy.scale.bandStart}%`,
                  }}
                />
                <div
                  data-testid="job-response-rate-badge-scale-marker"
                  className={cn(
                    'tm-absolute',
                    'tm-top-[-5px]',
                    'tm-h-[16px]',
                    'tm-w-[4px]',
                    '-tm-ml-[2px]',
                    'tm-rounded-[2px]',
                    STATUS_MARKER_CLASS[status],
                  )}
                  style={{ left: `${copy.scale.marker}%` }}
                />
              </div>
              <div
                aria-hidden="true"
                className="tm-relative tm-h-[16px] tm-text-[11px] tm-text-secondary-default"
              >
                <span
                  className="tm-absolute -tm-translate-x-1/2 tm-whitespace-nowrap"
                  style={{ left: `${copy.scale.bandStart}%` }}
                >
                  {copy.scale.bandStartLabel}
                </span>
                <span
                  className="tm-absolute -tm-translate-x-1/2 tm-whitespace-nowrap"
                  style={{ left: `${copy.scale.bandEnd}%` }}
                >
                  {copy.scale.bandEndLabel}
                </span>
              </div>
              <div className="tm-mt-0.5 tm-text-xs tm-text-secondary-default">
                {copy.scale.caption}
              </div>
            </div>
          ) : null}
          {copy.lines.map((line) => (
            <p key={line} className="tm-m-0 tm-mt-[10px] tm-text-secondary-default">
              {line}
            </p>
          ))}
          {copy.source ? (
            <div
              data-testid="job-response-rate-badge-source"
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

JobResponseRateBadge.displayName = 'JobResponseRateBadge'
