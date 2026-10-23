import { cn } from '../../lib/cn'
import { Icon } from '../Icon'
import { JobPortalLogo, jobPortalLogoTypeFromChannel } from '../JobPortalLogo'
import type { JobPublication } from '../JobCardSynteza/types'
import { JOB_CARD_SIMPLIFY_16_CHANNEL_LOGO_SIZE } from './constants'
import {
  formatSimplify16CellDate,
  formatSimplify16CellStatusLabel,
  partitionSimplify16GridPublications,
  publicationHasActivePromo,
  resolveSimplify16CellStatusTone,
  resolveSimplify16ChannelVisualState,
  simplify16CellStatusClassName,
  simplify16GridCellBorders,
  simplify16GridColumnCount,
} from './jobCardSimplify16Presentation'

export interface JobCardSimplify16ChannelGridProps {
  publications: JobPublication[]
  now?: Date
  onShowMoreChannels?: () => void
}

function ChannelLogo({
  publication,
  visual,
}: {
  publication: JobPublication
  visual: ReturnType<typeof resolveSimplify16ChannelVisualState>
}) {
  const size = JOB_CARD_SIMPLIFY_16_CHANNEL_LOGO_SIZE
  const hasPromo = publicationHasActivePromo(publication)

  return (
    <span className="tm-relative tm-inline-flex tm-shrink-0">
      <span
        className={cn(
          'tm-flex tm-items-center tm-justify-center tm-overflow-hidden tm-rounded-full tm-bg-cover-light tm-border tm-border-solid tm-border-secondary',
          visual === 'disabled' && 'tm-border-dashed tm-border-strong',
          visual === 'expired' || visual === 'disabled'
            ? 'tm-grayscale tm-opacity-60'
            : undefined,
        )}
        style={{ width: size, height: size }}
      >
        <JobPortalLogo
          type={jobPortalLogoTypeFromChannel(publication.channel)}
          title=""
          className="tm-size-[26px] tm-rounded-full"
        />
      </span>
      {hasPromo ? (
        <span
          data-testid="job-card-simplify16-channel-promo-badge"
          className="tm-absolute tm--right-1 tm--top-1 tm-flex tm-size-[13px] tm-items-center tm-justify-center tm-rounded-full tm-border-[1.5px] tm-border-solid tm-border-cover-light tm-bg-[#FAC775] tm-text-[8px] tm-text-[#633806]"
          aria-hidden
        >
          <Icon name="sparkles" className="tm-size-2 tm-leading-none" />
        </span>
      ) : null}
    </span>
  )
}

export function JobCardSimplify16ChannelGrid({
  publications,
  now = new Date(),
  onShowMoreChannels,
}: JobCardSimplify16ChannelGridProps) {
  const { visible, hiddenCount } = partitionSimplify16GridPublications(publications)

  if (visible.length === 0) {
    return null
  }

  const columnCount = simplify16GridColumnCount(visible.length)

  return (
    <div data-testid="job-card-simplify16-channel-grid" className="tm-flex tm-flex-col">
      <div
        className={cn(
          'tm-grid',
          columnCount === 1 ? 'tm-grid-cols-1' : 'tm-grid-cols-2',
        )}
      >
        {visible.map((publication, index) => {
          const visual = resolveSimplify16ChannelVisualState(publication, now)
          const statusTone = resolveSimplify16CellStatusTone(visual)
          const { showBottomBorder, showLeftBorder } = simplify16GridCellBorders(
            index,
            visible.length,
            columnCount,
          )
          const isDimmed = visual === 'expired' || visual === 'disabled'

          return (
            <div
              key={publication.id}
              data-testid="job-card-simplify16-channel-cell"
              data-channel-state={visual}
              className={cn(
                'tm-flex tm-items-center tm-gap-2 tm-py-3',
                columnCount === 1 ? 'tm-pr-3.5' : index % 2 === 0 ? 'tm-pr-3.5' : 'tm-pl-3.5',
                showBottomBorder && 'tm-border-0 tm-border-b tm-border-solid tm-border-secondary',
                showLeftBorder && 'tm-border-0 tm-border-l tm-border-solid tm-border-strong',
              )}
            >
              <ChannelLogo publication={publication} visual={visual} />
              <span
                className={cn(
                  'tm-min-w-0 tm-flex-1 tm-truncate tm-text-[13px] tm-leading-tight',
                  isDimmed ? 'tm-text-secondary-default' : 'tm-text-primary-default',
                )}
              >
                {publication.channel}
              </span>
              <div
                className={cn(
                  'tm-flex tm-min-w-[62px] tm-shrink-0 tm-flex-col tm-items-end tm-border-0 tm-border-l tm-border-solid tm-border-secondary tm-pl-2 tm-text-right tm-leading-snug',
                )}
              >
                <span
                  className={cn(
                    'tm-text-xs tm-font-medium',
                    simplify16CellStatusClassName(statusTone),
                  )}
                >
                  {formatSimplify16CellStatusLabel(visual)}
                </span>
                <span className="tm-text-xs tm-text-secondary-default">
                  {formatSimplify16CellDate(publication, visual)}
                </span>
              </div>
            </div>
          )
        })}
      </div>
      {hiddenCount > 0 ? (
        <button
          type="button"
          data-testid="job-card-simplify16-more-channels"
          className="tm-w-full tm-border-0 tm-border-t tm-border-solid tm-border-secondary tm-bg-transparent tm-py-2.5 tm-text-left tm-text-sm tm-text-secondary-default hover:tm-text-primary-default"
          onClick={(event) => {
            event.preventDefault()
            event.stopPropagation()
            onShowMoreChannels?.()
          }}
        >
          Další {hiddenCount} {hiddenCount === 1 ? 'kanál' : hiddenCount < 5 ? 'kanály' : 'kanálů'} ›
        </button>
      ) : null}
    </div>
  )
}

JobCardSimplify16ChannelGrid.displayName = 'JobCardSimplify16ChannelGrid'
