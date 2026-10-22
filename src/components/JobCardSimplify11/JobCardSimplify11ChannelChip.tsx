import { Dropdown, DropdownBody, DropdownToggle } from '../Dropdown'
import { JobPortalLogo, jobPortalLogoTypeFromChannel } from '../JobPortalLogo'
import { cn } from '../../lib/cn'
import {
  formatChannelEndedSubline,
  formatUntilDate,
  stripYear,
} from '../JobCardSynteza/advertisementSummary'
import type { JobPublication } from '../JobCardSynteza/types'
import { Button } from '../Button'
import { JobCardSimplify11ChannelStatusDot } from './JobCardSimplify11ChannelStatusDot'
import {
  resolveSimplify11ChannelVisualState,
  type Simplify11ChannelVisualState,
} from './jobCardSimplify11Presentation'

function chipShellClass(visual: Simplify11ChannelVisualState) {
  return cn(
    'tm-relative tm-inline-flex tm-shrink-0 tm-items-center tm-justify-center tm-overflow-visible',
    'tm-size-[40px]',
  )
}

function chipLogoRingClass(visual: Simplify11ChannelVisualState) {
  return cn(
    'tm-flex tm-size-[40px] tm-items-center tm-justify-center tm-overflow-hidden tm-rounded-full tm-bg-cover-light',
    'tm-border tm-border-solid tm-border-secondary',
    visual === 'disabled' && 'tm-border-dashed tm-border-strong',
  )
}

export interface JobCardSimplify11ChannelChipProps {
  publication: JobPublication
  now?: Date
  onExtendPublication?: (publication: JobPublication) => void
  onEnablePublication?: (publication: JobPublication) => void
}

function ChannelDetailRow({
  publication,
  visual,
  onExtendPublication,
  onEnablePublication,
}: {
  publication: JobPublication
  visual: Simplify11ChannelVisualState
  onExtendPublication?: (publication: JobPublication) => void
  onEnablePublication?: (publication: JobPublication) => void
}) {
  const endDate = publication.endDate ? stripYear(publication.endDate) : undefined

  return (
    <div
      data-testid="job-card-simplify11-channel-detail-row"
      className="tm-flex tm-items-center tm-gap-2 tm-py-1 tm-text-xs"
    >
      <JobCardSimplify11ChannelChipVisual publication={publication} visual={visual} withDropdown={false} />
      {visual === 'running' || visual === 'endingSoon' ? (
        <>
          <span className="tm-min-w-0 tm-flex-1 tm-truncate tm-text-primary-default">
            {publication.channel}
          </span>
          <span className="tm-shrink-0 tm-text-secondary-default">
            {endDate ? formatUntilDate(endDate) : '–'}
          </span>
        </>
      ) : null}
      {visual === 'expired' ? (
        <>
          <span className="tm-min-w-0 tm-flex-1 tm-text-emotion-danger-emphasis">
            {formatChannelEndedSubline(publication)}
          </span>
          {onExtendPublication ? (
            <Button
              variant="secondary"
              size="medium"
              className="tm-shrink-0"
              data-testid="job-card-simplify11-channel-restore"
              onClick={(event) => {
                event.preventDefault()
                event.stopPropagation()
                onExtendPublication(publication)
              }}
            >
              Obnovit
            </Button>
          ) : null}
        </>
      ) : null}
      {visual === 'disabled' ? (
        <>
          <span className="tm-min-w-0 tm-flex-1 tm-truncate tm-text-primary-default">
            {publication.channel}
          </span>
          <span className="tm-shrink-0 tm-text-secondary-default">Vypnuto</span>
          {onEnablePublication ? (
            <Button
              variant="tertiary"
              size="medium"
              className="tm-shrink-0"
              data-testid="job-card-simplify11-channel-enable"
              onClick={(event) => {
                event.preventDefault()
                event.stopPropagation()
                onEnablePublication(publication)
              }}
            >
              Zapnout
            </Button>
          ) : null}
        </>
      ) : null}
    </div>
  )
}

export function JobCardSimplify11ChannelChipVisual({
  publication,
  visual,
  withDropdown = true,
}: {
  publication: JobPublication
  visual: Simplify11ChannelVisualState
  withDropdown?: boolean
}) {
  return (
    <span
      className={chipShellClass(visual)}
      data-testid="job-card-simplify11-channel-chip"
      data-channel-state={visual}
    >
      <span className={chipLogoRingClass(visual)}>
        <JobPortalLogo
          type={jobPortalLogoTypeFromChannel(publication.channel)}
          title=""
          className="tm-size-[40px] tm-rounded-full"
        />
      </span>
      <JobCardSimplify11ChannelStatusDot visual={visual} />
      {withDropdown ? null : null}
    </span>
  )
}

export function JobCardSimplify11ChannelChip({
  publication,
  now = new Date(),
  onExtendPublication,
  onEnablePublication,
}: JobCardSimplify11ChannelChipProps) {
  const visual = resolveSimplify11ChannelVisualState(publication, now)

  return (
    <Dropdown
      openOnHover
      hoverDelay={150}
      autoClose={false}
      placement="top-start"
      strategy="fixed"
      className="tm-inline-flex"
    >
      <DropdownToggle variant="custom" className="tm-rounded-none tm-bg-transparent tm-p-0">
        <JobCardSimplify11ChannelChipVisual publication={publication} visual={visual} />
      </DropdownToggle>
      <DropdownBody
        data-testid="job-card-simplify11-channel-detail"
        overflow="visible"
        initialFocus={-1}
        className="tm-w-[300px] tm-p-3"
      >
        <ChannelDetailRow
          publication={publication}
          visual={visual}
          onExtendPublication={onExtendPublication}
          onEnablePublication={onEnablePublication}
        />
      </DropdownBody>
    </Dropdown>
  )
}

JobCardSimplify11ChannelChip.displayName = 'JobCardSimplify11ChannelChip'
