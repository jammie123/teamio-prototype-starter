import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'
import { Icon, type KnownIconName } from '../Icon'
import { Link } from '../Link'
import { formatCount } from '../JobCardV14/lib/format'

export interface ActionWidgetProps extends StyleProps {
  viewCount?: number
  showProlong?: boolean
  onPreview?: () => void
  onDetail?: () => void
  onProlong?: () => void
}

type ActionKind = 'preview' | 'detail' | 'prolong'

const ACTION_CONFIG: Record<
  ActionKind,
  { label: string; icon: KnownIconName; testId: string; iconHoverClass: string }
> = {
  preview: {
    label: 'Náhled',
    icon: 'eye',
    testId: 'job-card-advertisement-preview-action',
    iconHoverClass: 'group-hover:tm-scale-110',
  },
  detail: {
    label: 'Detail',
    icon: 'external-link',
    testId: 'job-card-advertisement-detail-action',
    iconHoverClass: 'group-hover:tm-translate-x-0.5 group-hover:-tm-translate-y-0.5',
  },
  prolong: {
    label: 'Prodloužit',
    icon: 'plus-circle',
    testId: 'job-card-disappearance-prolong',
    iconHoverClass: 'group-hover:-tm-rotate-12',
  },
}

function ActionWidgetButton({
  kind,
  onClick,
}: {
  kind: ActionKind
  onClick?: () => void
}) {
  const { label, icon, testId, iconHoverClass } = ACTION_CONFIG[kind]
  const isProlong = kind === 'prolong'

  return (
    <Link
      underlined="never"
      variant="primary"
      onClick={(event) => {
        event.preventDefault()
        event.stopPropagation()
        onClick?.()
      }}
      data-testid={testId}
      className={cn(
        'tm-group',
        'tm-flex',
        '!tm-inline-flex',
        'tm-h-full',
        'tm-min-h-[4.75rem]',
        'tm-flex-col',
        'tm-items-center',
        'tm-justify-center',
        'tm-gap-0.5',
        'tm-self-stretch',
        'tm-px-5',
        'tm-border-0',
        'tm-border-l',
        'tm-border-solid',
        'tm-border-secondary',
        'tm-text-[13px]',
        'tm-font-medium',
        'tm-no-underline',
        'hover:tm-no-underline',
        'tm-transition-colors',
        'last:tm-rounded-r-xl',
        isProlong
          ? [
              'tm-text-emotion-warning-emphasis',
              'hover:tm-bg-emotion-warning-background',
              'focus:tm-text-emotion-warning-emphasis',
            ]
          : [
              'tm-text-action-link-default',
              'hover:tm-bg-interactive-hover',
              'focus:tm-text-action-link-hover',
            ],
      )}
    >
      <Icon
        name={icon}
        className={cn('tm-text-xl tm-transition-transform', iconHoverClass)}
        aria-hidden
      />
      {label}
    </Link>
  )
}

/** Views count plus Náhled, Detail and optional Prodloužit — right side of the advertisement card. */
export function ActionWidget({
  viewCount,
  showProlong = false,
  onPreview,
  onDetail,
  onProlong,
  className,
}: ActionWidgetProps) {
  return (
    <div
      data-testid="job-card-action-widget"
      className={cn('tm-flex tm-shrink-0 tm-items-stretch', className)}
    >
      {viewCount === undefined ? null : (
        <div
          data-testid="job-card-advertisement-aggregate-views"
          className="tm-flex tm-flex-col tm-justify-center tm-px-5 tm-py-3"
        >
          <span className="tm-text-[22px] tm-font-medium tm-leading-tight tm-tabular-nums tm-text-primary-default">
            {formatCount(viewCount)}
          </span>
          <span className="tm-text-[13px] tm-text-secondary-default">Zhlédnutí</span>
        </div>
      )}
      {onPreview ? <ActionWidgetButton kind="preview" onClick={onPreview} /> : null}
      {onDetail ? <ActionWidgetButton kind="detail" onClick={onDetail} /> : null}
      {showProlong ? <ActionWidgetButton kind="prolong" onClick={onProlong} /> : null}
    </div>
  )
}

ActionWidget.displayName = 'ActionWidget'
