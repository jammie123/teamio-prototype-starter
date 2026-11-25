import { useId, useState, type ReactNode } from 'react'
import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'
import { Dropdown, DropdownBody, DropdownToggle } from '../Dropdown'
import { ScoreSummaryBadge, type ScoreSummaryBadgeType } from '../ScoreSummary/ScoreSummaryBadge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../Tooltip'
import { SCORE_SUMMARY_V2_COPY } from './copy'
import { ScoreSummaryV2MatchCompact, type ScoreSummaryV2MatchCompactItem } from './ScoreSummaryV2MatchCompact'

type ScoreSummaryV2DialogBaseProps = StyleProps & {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  trigger?: ReactNode
  title?: string
  matches?: ScoreSummaryV2MatchCompactItem[]
}

type ScoreSummaryV2TooltipType = Exclude<ScoreSummaryBadgeType, 'scored'>

export type ScoreSummaryV2DialogProps =
  | (ScoreSummaryV2DialogBaseProps & { type?: 'scored'; score: number })
  | (ScoreSummaryV2DialogBaseProps & {
      type: ScoreSummaryV2TooltipType
      score?: never
    })

function badgeForType(type: ScoreSummaryBadgeType, score?: number) {
  if (type === 'scored' && score !== undefined) {
    return <ScoreSummaryBadge type="scored" score={score} />
  }
  if (type !== 'scored') {
    return <ScoreSummaryBadge type={type} />
  }
  return null
}

export function ScoreSummaryV2Dialog(props: ScoreSummaryV2DialogProps) {
  const {
    open,
    defaultOpen = false,
    onOpenChange,
    trigger,
    title = SCORE_SUMMARY_V2_COPY.title,
    matches = [],
    className,
    type = 'scored',
  } = props
  const score = props.type === 'scored' || props.type === undefined ? props.score : undefined
  const badge = badgeForType(type, score)
  const titleId = useId()
  const isControlled = open !== undefined
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen)
  const isOpen = isControlled ? open : uncontrolledOpen

  const setOpen = (next: boolean) => {
    if (!isControlled) {
      setUncontrolledOpen(next)
    }
    onOpenChange?.(next)
  }

  if (type !== 'scored') {
    return (
      <TooltipProvider delayDuration={200}>
        <Tooltip open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
          <TooltipTrigger asChild>
            <button
              type="button"
              className="tm-inline-flex tm-cursor-pointer tm-border-0 tm-bg-transparent tm-p-0"
            >
              {trigger ?? badge}
            </button>
          </TooltipTrigger>
          <TooltipContent className={className}>{SCORE_SUMMARY_V2_COPY.badgeTooltip[type]}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return (
    <Dropdown
      isOpen={isOpen}
      onOpenChange={setOpen}
      autoClose={false}
      placement="bottom-start"
      strategy="fixed"
      className="tm-inline-flex"
    >
      <DropdownToggle variant="custom" className="tm-rounded-none tm-border-0 tm-bg-transparent tm-p-0">
        {trigger ?? badge}
      </DropdownToggle>
      <DropdownBody
        role="dialog"
        aria-modal="false"
        aria-labelledby={titleId}
        data-testid="score-summary-v2-dialog"
        overflow="visible"
        className={cn('tm-p-3 !tm-w-[20rem] !tm-max-w-none !tm-rounded-lg', className)}
      >
        <h2 id={titleId} className="tm-m-0 tm-text-sm tm-font-semibold tm-leading-snug">
          {title}
        </h2>
        {matches.length > 0 ? (
          <ul className="tm-mb-0 tm-mt-2 tm-flex tm-list-none tm-flex-col tm-p-0 tm-pl-0">
            {matches.map((match) => (
              <ScoreSummaryV2MatchCompact key={match.id} match={match} />
            ))}
          </ul>
        ) : null}
      </DropdownBody>
    </Dropdown>
  )
}

ScoreSummaryV2Dialog.displayName = 'ScoreSummaryV2Dialog'
