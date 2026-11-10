import { Dropdown, DropdownBody, DropdownToggle } from '../Dropdown'
import { Option, OptionList } from '../OptionList'
import { JOB_DETAIL_STATS_COPY, JOB_DETAIL_STATS_PERIOD_LABELS } from './jobDetailStatsCopy'
import {
  JOB_DETAIL_STATS_PERIODS,
  type JobDetailStatsPeriod,
} from './jobDetailStatsPeriod'

export interface JobDetailStatsPeriodHeaderProps {
  period: JobDetailStatsPeriod
  /** Formatted from–to dates for the selected period. */
  periodRangeLabel: string
  onPeriodChange: (period: JobDetailStatsPeriod) => void
  isDisabled?: boolean
}

export function JobDetailStatsPeriodHeader({
  period,
  periodRangeLabel,
  onPeriodChange,
  isDisabled = false,
}: JobDetailStatsPeriodHeaderProps) {
  return (
    <div
      className="tm-flex tm-flex-wrap tm-items-center tm-gap-x-2 tm-gap-y-1 tm-pb-8 tm-text-sm"
      data-testid="job-detail-stats-period-header"
    >
      <span className="tm-text-secondary-default">{JOB_DETAIL_STATS_COPY.periodLabel}:</span>
      <span
        className="tm-font-medium tm-text-primary-default"
        data-testid="job-detail-stats-period-label"
      >
        {periodRangeLabel}
      </span>
      <Dropdown strategy="fixed" placement="bottom-start" className="tm-inline-flex">
        <DropdownToggle
          variant="custom"
          data-testid="job-detail-stats-period-change"
          aria-disabled={isDisabled || undefined}
          className="tm-inline-flex tm-cursor-pointer tm-border-0 tm-bg-transparent tm-p-0 tm-text-sm tm-font-normal tm-text-action-link-default hover:tm-underline focus:tm-outline-0 focus-visible:tm-ring aria-disabled:tm-pointer-events-none aria-disabled:tm-opacity-50"
        >
          {JOB_DETAIL_STATS_COPY.changePeriod}
        </DropdownToggle>
        <DropdownBody className="tm-min-w-[16rem]">
          <OptionList>
            {JOB_DETAIL_STATS_PERIODS.map((option) => (
              <Option
                key={option}
                isSelected={option === period}
                onClick={() => {
                  if (option !== period) {
                    onPeriodChange(option)
                  }
                }}
              >
                {JOB_DETAIL_STATS_PERIOD_LABELS[option]}
              </Option>
            ))}
          </OptionList>
        </DropdownBody>
      </Dropdown>
    </div>
  )
}

JobDetailStatsPeriodHeader.displayName = 'JobDetailStatsPeriodHeader'
