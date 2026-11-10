import { useState, type ReactNode } from 'react'
import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'
import { Alert } from '../Alert'
import { Button } from '../Button'
import { formatCount } from '../JobCard/formatCount'
import { JobPortalLogo, jobPortalLogoTypeFromChannel } from '../JobPortalLogo'
import {
  Modal,
  ModalBody,
  ModalClose,
  ModalContent,
  ModalTitle,
  ModalTrigger,
  type ModalProps,
} from '../Modal'
import { Skeleton } from '../Skeleton'
import { Spinner } from '../Spinner'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../Table'
import {
  JobDetailStatsChart,
  type JobDetailStatsHiddenSeries,
  type JobDetailStatsSeriesKey,
} from './JobDetailStatsChart'
import { JOB_DETAIL_STATS_COPY, JOB_DETAIL_STATS_PERIOD_LABELS } from './jobDetailStatsCopy'
import { JOB_MODAL_CLOSE_ARIA_LABEL } from './JobModalFrame'
import { JobDetailStatsPeriodHeader } from './JobDetailStatsPeriodHeader'
import {
  formatJobDetailStatsPublicationRange,
  sumJobDetailStatsPlaces,
  type JobDetailStatsPeriod,
  type JobDetailStatsSummary,
  type JobDetailStatsTimeSeriesPoint,
} from './jobDetailStatsPeriod'

export type JobDetailStatsModalStatus = 'loading' | 'ready' | 'empty' | 'error'

export interface JobDetailStatsModalProps extends StyleProps {
  jobId: string
  open?: ModalProps['open']
  defaultOpen?: ModalProps['defaultOpen']
  onOpenChange?: ModalProps['onOpenChange']
  trigger?: ReactNode
  period?: JobDetailStatsPeriod
  defaultPeriod?: JobDetailStatsPeriod
  onPeriodChange?: (period: JobDetailStatsPeriod) => void
  status: JobDetailStatsModalStatus
  series?: JobDetailStatsTimeSeriesPoint[]
  summary?: JobDetailStatsSummary
  /** Volitelný nadpis pozice nad tabulkou (mimo sloupce). */
  jobTitle?: string
  isPeriodLoading?: boolean
  onRetry?: () => void
}

const DEFAULT_HIDDEN_SERIES: JobDetailStatsHiddenSeries = {
  views: false,
  reactions: false,
}

function resolvePeriodRangeLabel(
  period: JobDetailStatsPeriod,
  summary?: JobDetailStatsSummary,
  series: JobDetailStatsTimeSeriesPoint[] = [],
): string {
  if (summary?.periodStartDate && summary.periodEndDate) {
    return formatJobDetailStatsPublicationRange(summary.periodStartDate, summary.periodEndDate)
  }
  if (series.length > 0) {
    return formatJobDetailStatsPublicationRange(series[0].date, series[series.length - 1].date)
  }
  return JOB_DETAIL_STATS_PERIOD_LABELS[period]
}

export function JobDetailStatsModal({
  jobId,
  open,
  defaultOpen,
  onOpenChange,
  trigger,
  period: periodProp,
  defaultPeriod = 'sincePublication',
  onPeriodChange,
  status,
  series = [],
  summary,
  jobTitle,
  isPeriodLoading = false,
  onRetry,
  className,
}: JobDetailStatsModalProps) {
  const [internalPeriod, setInternalPeriod] = useState<JobDetailStatsPeriod>(defaultPeriod)
  const [hiddenSeries, setHiddenSeries] =
    useState<JobDetailStatsHiddenSeries>(DEFAULT_HIDDEN_SERIES)

  const period = periodProp ?? internalPeriod

  function handleOpenChange(nextOpen: boolean) {
    if (nextOpen) {
      if (periodProp === undefined) {
        setInternalPeriod(defaultPeriod)
      }
      onPeriodChange?.(defaultPeriod)
    }
    onOpenChange?.(nextOpen)
  }

  function handlePeriodChange(next: JobDetailStatsPeriod) {
    if (periodProp === undefined) {
      setInternalPeriod(next)
    }
    onPeriodChange?.(next)
  }

  function handleToggleSeries(key: JobDetailStatsSeriesKey) {
    setHiddenSeries((current) => ({
      ...current,
      [key]: !current[key],
    }))
  }

  const showInitialLoading = status === 'loading' && !isPeriodLoading
  const showContentLoading = showInitialLoading || isPeriodLoading
  const isEmpty =
    status === 'empty' || (status === 'ready' && series.length === 0 && !showContentLoading)
  const showChart = status === 'ready' && !isEmpty && !showInitialLoading
  const showError = status === 'error'
  const tableTotals =
    summary && summary.places.length > 0 ? sumJobDetailStatsPlaces(summary.places) : null

  return (
    <Modal open={open} defaultOpen={defaultOpen} onOpenChange={handleOpenChange}>
      {trigger ? <ModalTrigger asChild>{trigger}</ModalTrigger> : null}
      <ModalContent size="wide" className={className} data-testid="job-detail-stats-modal">
        <ModalTitle className="tm-pb-0 tm-text-2xl">{JOB_DETAIL_STATS_COPY.title}</ModalTitle>
        <div className="-tm-mt-6 tm-px-6 tm-pr-14">
          <JobDetailStatsPeriodHeader
            period={period}
            periodRangeLabel={resolvePeriodRangeLabel(period, summary, series)}
            onPeriodChange={handlePeriodChange}
          />
        </div>
        <ModalClose aria-label={JOB_MODAL_CLOSE_ARIA_LABEL} />
        <ModalBody
          className="tm-flex tm-min-h-0 tm-flex-col tm-gap-6 tm-pb-8"
          data-job-id={jobId}
        >
          <section
            aria-label="Statistický widget"
            className="tm-flex tm-flex-col tm-rounded-lg tm-border tm-border-secondary tm-px-3 tm-py-8"
          >
            <div className="tm-relative tm-min-h-[152px] tm-overflow-visible">
              {showError ? (
                <Alert variant="error">
                  <p className="tm-m-0">{JOB_DETAIL_STATS_COPY.error}</p>
                  {onRetry ? (
                    <Button variant="secondary" size="small" className="tm-mt-3" onClick={onRetry}>
                      {JOB_DETAIL_STATS_COPY.retry}
                    </Button>
                  ) : null}
                </Alert>
              ) : null}

              {showInitialLoading ? (
                <Skeleton variant="light" width="100%" height={152} className="tm-block" />
              ) : null}

              {!showError && !showInitialLoading && isEmpty ? (
                <p
                  className="tm-m-0 tm-py-8 tm-text-center tm-text-secondary-default"
                  data-testid="job-detail-stats-empty"
                >
                  {JOB_DETAIL_STATS_COPY.empty}
                </p>
              ) : null}

              {showChart ? (
                <>
                  <JobDetailStatsChart
                    series={series}
                    hiddenSeries={hiddenSeries}
                    onToggleSeries={handleToggleSeries}
                  />
                  {isPeriodLoading ? (
                    <div
                      className={cn(
                        'tm-absolute',
                        'tm-inset-0',
                        'tm-flex',
                        'tm-items-center',
                        'tm-justify-center',
                        'tm-rounded',
                        'tm-bg-basic/70',
                      )}
                      aria-busy="true"
                    >
                      <Spinner
                        className="tm-h-8 tm-w-8 tm-text-interaction-primary-default"
                        label={JOB_DETAIL_STATS_COPY.periodLoading}
                      />
                    </div>
                  ) : null}
                </>
              ) : null}
            </div>
          </section>

          <section
            aria-label={JOB_DETAIL_STATS_COPY.tableAriaLabel}
            className="tm-flex tm-flex-col tm-gap-2"
          >
            {jobTitle ? (
              <p
                className="tm-m-0 tm-text-sm tm-font-medium tm-text-primary-default"
                data-testid="job-detail-stats-job-title"
              >
                {jobTitle}
              </p>
            ) : null}
            <div className="tm-relative tm-min-h-[4.5rem]">
              {showInitialLoading ? (
                <Skeleton variant="light" width="100%" height={48} className="tm-block" />
              ) : summary && summary.places.length > 0 ? (
                <Table
                  aria-label={JOB_DETAIL_STATS_COPY.tableAriaLabel}
                  className="tm-w-full tm-table-fixed tm-text-sm"
                >
                  <colgroup>
                    <col className="tm-w-[44%]" />
                    <col className="tm-w-[28%]" />
                    <col className="tm-w-[28%]" />
                  </colgroup>
                  <TableHead>
                    <TableRow>
                      <TableHeader
                        scope="col"
                        className="tm-px-2 tm-py-1.5 tm-text-13 tm-font-medium !tm-border-b-0"
                      >
                        {JOB_DETAIL_STATS_COPY.columns.place}
                      </TableHeader>
                      <TableHeader
                        scope="col"
                        className="tm-px-2 tm-py-1.5 tm-text-13 tm-font-medium !tm-border-b-0 tm-text-right"
                      >
                        {JOB_DETAIL_STATS_COPY.columns.views}
                      </TableHeader>
                      <TableHeader
                        scope="col"
                        className="tm-px-2 tm-py-1.5 tm-text-13 tm-font-medium !tm-border-b-0 tm-text-right"
                      >
                        {JOB_DETAIL_STATS_COPY.columns.reactions}
                      </TableHeader>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {summary.places.map((place) => (
                      <TableRow key={place.id}>
                        <TableCell className="tm-px-2 tm-py-1.5">
                          <span className="tm-inline-flex tm-min-w-0 tm-items-center tm-gap-2">
                            <JobPortalLogo
                              type={
                                place.logoType ?? jobPortalLogoTypeFromChannel(place.placeName)
                              }
                              title=""
                              className="tm-size-5 tm-shrink-0"
                            />
                            <span className="tm-min-w-0 tm-truncate tm-text-sm tm-font-medium tm-leading-tight tm-text-primary-default">
                              {place.placeName}
                            </span>
                          </span>
                        </TableCell>
                        <TableCell className="tm-px-2 tm-py-1.5 tm-text-13 tm-tabular-nums tm-text-right tm-text-primary-default">
                          {formatCount(place.views)}
                        </TableCell>
                        <TableCell className="tm-px-2 tm-py-1.5 tm-text-13 tm-tabular-nums tm-text-right tm-text-primary-default">
                          {formatCount(place.reactions)}
                        </TableCell>
                      </TableRow>
                    ))}
                    {tableTotals ? (
                      <TableRow data-testid="job-detail-stats-table-total">
                        <TableCell className="tm-px-2 tm-py-1.5 !tm-border-b-0 tm-text-sm tm-font-semibold tm-text-primary-default">
                          {JOB_DETAIL_STATS_COPY.columns.total}
                        </TableCell>
                        <TableCell className="tm-px-2 tm-py-1.5 !tm-border-b-0 tm-text-13 tm-font-semibold tm-tabular-nums tm-text-right tm-text-primary-default">
                          {formatCount(tableTotals.views)}
                        </TableCell>
                        <TableCell className="tm-px-2 tm-py-1.5 !tm-border-b-0 tm-text-13 tm-font-semibold tm-tabular-nums tm-text-right tm-text-primary-default">
                          {formatCount(tableTotals.reactions)}
                        </TableCell>
                      </TableRow>
                    ) : null}
                  </TableBody>
                </Table>
              ) : null}
              {isPeriodLoading && summary && summary.places.length > 0 && !showInitialLoading ? (
                <div
                  className={cn(
                    'tm-absolute',
                    'tm-inset-0',
                    'tm-flex',
                    'tm-items-center',
                    'tm-justify-center',
                    'tm-rounded',
                    'tm-bg-basic/70',
                  )}
                  aria-busy="true"
                >
                  <Spinner
                    className="tm-h-6 tm-w-6 tm-text-interaction-primary-default"
                    label={JOB_DETAIL_STATS_COPY.periodLoading}
                  />
                </div>
              ) : null}
            </div>
          </section>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

JobDetailStatsModal.displayName = 'JobDetailStatsModal'
