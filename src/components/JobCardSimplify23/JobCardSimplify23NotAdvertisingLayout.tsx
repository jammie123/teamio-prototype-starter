import { cn } from '../../lib/cn'
import type { HTMLAttributes } from 'react'
import type { StyleProps } from '../../lib/types'
import { Button } from '../Button'
import { Icon } from '../Icon'
import { Link } from '../Link'
import type { JobAdvertisement } from '../JobCardSynteza/types'
import { JOB_CARD_SIMPLIFY_23_STATUS_HEADING_PADDING_TOP } from './constants'
import {
  buildSimplify20NotAdvertisingPerex,
  notAdvertisingHasPublicationHistory,
  SIMPLIFY_20_NEVER_CREATED_BODY,
  SIMPLIFY_20_NOT_ADVERTISING_TITLE,
  SIMPLIFY_20_START_ADVERTISING_LABEL,
} from '../JobCardSimplify20/jobCardSimplify20Presentation'
import { JobCardSimplify23ChevronEditButton } from './JobCardSimplify23ChevronEditButton'

export interface JobCardSimplify23NotAdvertisingLayoutProps
  extends StyleProps,
    Omit<HTMLAttributes<HTMLDivElement>, 'color'> {
  advertisement: JobAdvertisement
  headingTestId?: string
  sublineTestId?: string
  onEditAdvertisement?: () => void
  onRepublishAdvertisement?: () => void
  onCreateAdvertisement?: () => void
}

export function JobCardSimplify23NotAdvertisingLayout({
  advertisement,
  headingTestId = 'job-card-simplify23-not-advertising-heading',
  sublineTestId = 'job-card-simplify23-not-advertising-perex',
  onEditAdvertisement,
  onRepublishAdvertisement,
  onCreateAdvertisement,
  className,
  ...rest
}: JobCardSimplify23NotAdvertisingLayoutProps) {
  const hasHistory = notAdvertisingHasPublicationHistory(advertisement)
  const perex = buildSimplify20NotAdvertisingPerex(advertisement)

  return (
    <div className={cn('tm-flex tm-flex-col tm-gap-3', className)} {...rest}>
      <div
        data-testid="job-card-simplify23-advertisement-heading-wrap"
        className={cn('tm-w-full', JOB_CARD_SIMPLIFY_23_STATUS_HEADING_PADDING_TOP)}
      >
        <div
          className={cn(
            'tm-flex tm-items-start tm-justify-between tm-gap-3',
            'tm-border-0 tm-border-b tm-border-solid tm-border-secondary tm-pb-2',
          )}
        >
          <p
            data-testid={headingTestId}
            className="tm-m-0 tm-flex tm-min-w-0 tm-flex-1 tm-items-center tm-text-sm tm-font-medium tm-text-secondary-default"
          >
            <span>{SIMPLIFY_20_NOT_ADVERTISING_TITLE}</span>
          </p>
          {onEditAdvertisement ? (
            <JobCardSimplify23ChevronEditButton onEditAdvertisement={onEditAdvertisement} />
          ) : null}
        </div>
        {hasHistory && perex ? (
          <p
            data-testid={sublineTestId}
            className="tm-m-0 tm-mt-2 tm-text-sm tm-text-secondary-default"
          >
            {perex}
          </p>
        ) : !hasHistory ? (
          <p
            data-testid="job-card-simplify23-never-created-copy"
            className="tm-m-0 tm-mt-2 tm-text-sm tm-text-secondary-default"
          >
            {SIMPLIFY_20_NEVER_CREATED_BODY}
          </p>
        ) : null}
      </div>

      {hasHistory && onRepublishAdvertisement ? (
        <Link
          variant="primary"
          underlined="never"
          className="tm-inline-flex tm-items-center tm-gap-1 tm-text-sm"
          data-testid="job-card-simplify23-republish"
          onClick={(event) => {
            event.preventDefault()
            event.stopPropagation()
            onRepublishAdvertisement()
          }}
        >
          <Icon name="plus" size={16} />
          Znovu inzerovat
        </Link>
      ) : null}

      {!hasHistory && onCreateAdvertisement ? (
        <Button
          variant="secondary"
          data-testid="job-card-simplify23-start-advertising"
          onClick={(event) => {
            event.preventDefault()
            event.stopPropagation()
            onCreateAdvertisement()
          }}
        >
          {SIMPLIFY_20_START_ADVERTISING_LABEL}
        </Button>
      ) : null}
    </div>
  )
}

JobCardSimplify23NotAdvertisingLayout.displayName = 'JobCardSimplify23NotAdvertisingLayout'
