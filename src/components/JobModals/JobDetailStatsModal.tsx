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
import { Select } from '../Select'
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
import {
  formatJobDetailStatsPublicationRange,
  JOB_DETAIL_STATS_PERIODS,
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

  return (
    <Modal open={open} defaultOpen={defaultOpen} onOpenChange={handleOpenChange}>
      {trigger ? <ModalTrigger asChild>{trigger}</ModalTrigger> : null}
      <ModalContent size="wide" className={className} data-testid="job-detail-stats-modal">
        <ModalTitle className="tm-text-2xl">{JOB_DETAIL_STATS_COPY.title}</ModalTitle>
        <ModalClose aria-label={JOB_MODAL_CLOSE_ARIA_LABEL} />
        <ModalBody
          className="tm-flex tm-min-h-0 tm-flex-col tm-gap-8 tm-pb-8"
          data-job-id={jobId}
        >
          <section
            aria-label="Statistický widget"
            className="tm-flex tm-flex-col tm-gap-4 tm-rounded-lg tm-border tm-border-secondary tm-p-4 md:tm-p-5"
          >
            <div className="tm-flex tm-flex-wrap tm-items-end tm-justify-between tm-gap-4">
              <label className="tm-flex tm-flex-col tm-gap-2 tm-text-sm">
                <span className="tm-font-semibold tm-text-primary-default">
                  {JOB_DETAIL_STATS_COPY.periodLabel}
                </span>
                <Select
                  aria-label={JOB_DETAIL_STATS_COPY.periodLabel}
                  className="tm-w-auto tm-min-w-[240px]"
                  value={period}
                  onChange={(event) =>
                    handlePeriodChange(event.target.value as JobDetailStatsPeriod)
                  }
                  data-testid="job-detail-stats-period-select"
                >
                  {JOB_DETAIL_STATS_PERIODS.map((option) => (
                    <option key={option} value={option}>
                      {JOB_DETAIL_STATS_PERIOD_LABELS[option]}
                    </option>
                  ))}
                </Select>
              </label>
            </div>

            <div className="tm-relative tm-min-h-[220px] tm-overflow-visible">
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
                <Skeleton variant="light" width="100%" height={220} className="tm-block" />
              ) : null}

              {!showError && !showInitialLoading && isEmpty ? (
                <p
                  className="tm-m-0 tm-py-12 tm-text-center tm-text-secondary-default"
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
            aria-labelledby="job-detail-stats-table-heading"
            className="tm-flex tm-flex-col tm-gap-2"
          >
            <h3
              id="job-detail-stats-table-heading"
              className="tm-m-0 tm-text-sm tm-font-semibold tm-text-primary-default"
            >
              {JOB_DETAIL_STATS_COPY.tableSectionTitle}
            </h3>
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
                    <col className="tm-w-[26%]" />
                    <col className="tm-w-[34%]" />
                    <col className="tm-w-[20%]" />
                    <col className="tm-w-[20%]" />
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
                        className="tm-px-2 tm-py-1.5 tm-text-13 tm-font-medium !tm-border-b-0 tm-whitespace-nowrap"
                      >
                        {JOB_DETAIL_STATS_COPY.columns.publication}
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
                    {summary.places.map((place, index) => {
                      const isLast = index === summary.places.length - 1
                      const cellClass = cn('tm-px-2 tm-py-1.5', isLast && '!tm-border-b-0')

                      return (
                        <TableRow key={place.id}>
                          <TableCell className={cellClass}>
                            <span className="tm-inline-flex tm-min-w-0 tm-items-center tm-gap-2">
                              <JobPortalLogo
                                type={place.logoType ?? jobPortalLogoTypeFromChannel(place.placeName)}
                                title=""
                                className="tm-size-5 tm-shrink-0"
                              />
                              <span className="tm-min-w-0 tm-truncate tm-text-sm tm-font-medium tm-leading-tight tm-text-primary-default">
                                {place.placeName}
                              </span>
                            </span>
                          </TableCell>
                          <TableCell
                            className={cn(
                              cellClass,
                              'tm-text-13 tm-tabular-nums tm-whitespace-nowrap tm-text-secondary-default',
                            )}
                          >
                            {formatJobDetailStatsPublicationRange(place.startDate, place.endDate)}
                          </TableCell>
                          <TableCell
                            className={cn(
                              cellClass,
                              'tm-text-13 tm-tabular-nums tm-text-right tm-text-primary-default',
                            )}
                          >
                            {formatCount(place.views)}
                          </TableCell>
                          <TableCell
                            className={cn(
                              cellClass,
                              'tm-text-13 tm-tabular-nums tm-text-right tm-text-primary-default',
                            )}
                          >
                            {formatCount(place.reactions)}
                          </TableCell>
                        </TableRow>
                      )
                    })}
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
