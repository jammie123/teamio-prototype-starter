import { Fragment } from 'react'
import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'
import { Icon, type KnownIconName } from '../Icon'
import { Link } from '../Link'
import { formatCount } from '../JobCardV14/lib/format'

export interface AdvertisementActionProps extends StyleProps {
  viewCount?: number
  showProlong?: boolean
  onStatistics?: () => void
  onDetail?: () => void
  onProlong?: () => void
  onPreview?: () => void
}

type ActionKind = 'statistics' | 'detail' | 'prolong' | 'preview'

const ACTION_CONFIG: Record<
  Exclude<ActionKind, 'statistics'>,
  { label: string; ariaLabel: string; icon: KnownIconName; testId: string }
> = {
  detail: {
    label: 'Detail',
    ariaLabel: 'Detail inzerce',
    icon: 'external-link',
    testId: 'job-card-advertisement-detail-action',
  },
  prolong: {
    label: 'Prodloužit',
    ariaLabel: 'Prodloužit',
    icon: 'calendar',
    testId: 'job-card-disappearance-prolong',
  },
  preview: {
    label: 'Náhled',
    ariaLabel: 'Náhled inzerátu',
    icon: 'advertisement-preview',
    testId: 'job-card-advertisement-preview-action',
  },
}

function AdvertisementActionItem({
  icon,
  label,
  ariaLabel,
  testId,
  tone = 'default',
  onClick,
}: {
  icon: KnownIconName
  label: string
  ariaLabel: string
  testId: string
  tone?: 'default' | 'warning'
  onClick?: () => void
}) {
  const isWarning = tone === 'warning'

  return (
    <Link
      underlined="never"
      variant="primary"
      aria-label={ariaLabel}
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
        'tm-text-[13px]',
        'tm-font-medium',
        'tm-no-underline',
        'hover:tm-no-underline',
        'tm-transition-colors',
        'last:tm-rounded-r-xl',
        isWarning
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
        className="tm-text-xl tm-transition-transform group-hover:tm-scale-110"
        aria-hidden
      />
      {label}
    </Link>
  )
}

function AdvertisementActionDivider() {
  return (
    <div
      role="separator"
      aria-hidden
      className="tm-self-stretch tm-border-0 tm-border-l tm-border-solid tm-border-secondary"
    />
  )
}

/**
 * Right-side advertisement actions: statistics, Detail, optional Prodloužit, Náhled last.
 */
export function AdvertisementAction({
  viewCount,
  showProlong = false,
  onStatistics,
  onDetail,
  onProlong,
  onPreview,
  className,
}: AdvertisementActionProps) {
  const formattedViews = viewCount === undefined ? undefined : formatCount(viewCount)
  const items = [
    formattedViews === undefined
      ? null
      : {
          key: 'statistics',
          icon: 'eye' as const,
          label: formattedViews,
          ariaLabel: `${formattedViews} zhlédnutí`,
          testId: 'job-card-advertisement-aggregate-views',
          onClick: onStatistics,
        },
    { key: 'detail', ...ACTION_CONFIG.detail, onClick: onDetail },
    showProlong
      ? { key: 'prolong', ...ACTION_CONFIG.prolong, tone: 'warning' as const, onClick: onProlong }
      : null,
    { key: 'preview', ...ACTION_CONFIG.preview, onClick: onPreview },
  ].filter((item): item is NonNullable<typeof item> => item !== null)

  return (
    <div
      data-testid="job-card-advertisement-action"
      className={cn('tm-flex tm-shrink-0 tm-items-stretch', className)}
    >
      {items.map((item, index) => (
        <Fragment key={item.key}>
          {index > 0 ? <AdvertisementActionDivider /> : null}
          <AdvertisementActionItem
            icon={item.icon}
            label={item.label}
            ariaLabel={item.ariaLabel}
            testId={item.testId}
            tone={'tone' in item ? item.tone : 'default'}
            onClick={item.onClick}
          />
        </Fragment>
      ))}
    </div>
  )
}

AdvertisementAction.displayName = 'AdvertisementAction'
