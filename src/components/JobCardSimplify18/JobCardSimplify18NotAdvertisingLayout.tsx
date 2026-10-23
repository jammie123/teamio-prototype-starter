import { cn } from '../../lib/cn'
import type { HTMLAttributes } from 'react'
import type { StyleProps } from '../../lib/types'
import { Button } from '../Button'
import { Icon } from '../Icon'
import { Link } from '../Link'
import type { JobAdvertisement } from '../JobCardSynteza/types'
import {
  JOB_CARD_SIMPLIFY_18_STATUS_HEADING_ICON_SIZE,
  JOB_CARD_SIMPLIFY_18_STATUS_HEADING_ICON_STROKE,
  JOB_CARD_SIMPLIFY_18_STATUS_HEADING_PADDING_TOP,
} from './constants'
import {
  buildSimplify18NotAdvertisingPerex,
  notAdvertisingHasPublicationHistory,
  SIMPLIFY_18_NEVER_CREATED_BODY,
  SIMPLIFY_18_NOT_ADVERTISING_TITLE,
  SIMPLIFY_18_START_ADVERTISING_LABEL,
} from './jobCardSimplify18Presentation'

export interface JobCardSimplify18NotAdvertisingLayoutProps
  extends StyleProps,
    Omit<HTMLAttributes<HTMLDivElement>, 'color'> {
  advertisement: JobAdvertisement
  headingTestId?: string
  sublineTestId?: string
  onEditAdvertisement?: () => void
  onRepublishAdvertisement?: () => void
  onCreateAdvertisement?: () => void
  bordered?: boolean
}

function ChevronEditButton({ onEditAdvertisement }: { onEditAdvertisement: () => void }) {
  return (
    <Button
      variant="tertiary"
      size="small"
      isCircle
      aria-label="Spravovat inzerci"
      data-testid="job-card-simplify18-edit-advertisement"
      className="tm-shrink-0"
      onClick={(event) => {
        event.preventDefault()
        event.stopPropagation()
        onEditAdvertisement()
      }}
    >
      <Icon name="chevron-right" />
    </Button>
  )
}

export function JobCardSimplify18NotAdvertisingLayout({
  advertisement,
  headingTestId = 'job-card-simplify18-not-advertising-heading',
  sublineTestId = 'job-card-simplify18-not-advertising-perex',
  onEditAdvertisement,
  onRepublishAdvertisement,
  onCreateAdvertisement,
  bordered = false,
  className,
  ...rest
}: JobCardSimplify18NotAdvertisingLayoutProps) {
  const hasHistory = notAdvertisingHasPublicationHistory(advertisement)
  const perex = buildSimplify18NotAdvertisingPerex(advertisement)

  return (
    <div
      className={cn(
        'tm-flex tm-flex-col tm-gap-3',
        bordered &&
          'tm-items-start tm-rounded tm-border tm-border-secondary tm-bg-cover-light tm-p-4',
        className,
      )}
      {...rest}
    >
      <div
        data-testid="job-card-simplify18-advertisement-heading-wrap"
        className={cn('tm-w-full', JOB_CARD_SIMPLIFY_18_STATUS_HEADING_PADDING_TOP)}
      >
        <div
          className={cn(
            'tm-flex tm-items-start tm-justify-between tm-gap-3',
            'tm-border-0 tm-border-b tm-border-solid tm-border-secondary tm-pb-2',
          )}
        >
          <p
            data-testid={headingTestId}
            className="tm-m-0 tm-flex tm-min-w-0 tm-flex-1 tm-items-center tm-gap-2 tm-text-sm tm-font-medium tm-text-secondary-default"
          >
            <Icon
              name="view-off"
              size={JOB_CARD_SIMPLIFY_18_STATUS_HEADING_ICON_SIZE}
              strokeWidth={JOB_CARD_SIMPLIFY_18_STATUS_HEADING_ICON_STROKE}
              className="tm-shrink-0"
            />
            <span>{SIMPLIFY_18_NOT_ADVERTISING_TITLE}</span>
          </p>
          {onEditAdvertisement ? (
            <ChevronEditButton onEditAdvertisement={onEditAdvertisement} />
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
            data-testid="job-card-simplify18-never-created-copy"
            className="tm-m-0 tm-mt-2 tm-text-sm tm-text-secondary-default"
          >
            {SIMPLIFY_18_NEVER_CREATED_BODY}
          </p>
        ) : null}
      </div>

      {hasHistory && onRepublishAdvertisement ? (
        <Link
          variant="primary"
          underlined="never"
          className="tm-inline-flex tm-items-center tm-gap-1 tm-text-sm"
          data-testid="job-card-simplify18-republish"
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
          size="small"
          className="!tm-min-h-7 !tm-px-3 !tm-py-1"
          data-testid="job-card-simplify18-start-advertising"
          onClick={(event) => {
            event.preventDefault()
            event.stopPropagation()
            onCreateAdvertisement()
          }}
        >
          {SIMPLIFY_18_START_ADVERTISING_LABEL}
        </Button>
      ) : null}
    </div>
  )
}

JobCardSimplify18NotAdvertisingLayout.displayName = 'JobCardSimplify18NotAdvertisingLayout'
