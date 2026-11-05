import { Fragment } from 'react'
import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'
import { Button } from '../Button'
import { Icon, type KnownIconName } from '../Icon'
import { Link } from '../Link'
import { formatCount } from './lib/format'

export type AdvertisementActionLayout = 'stacked' | 'inline' | 'column'

export interface AdvertisementActionProps extends StyleProps {
  viewCount?: number
  /** Show the Prodloužit action (stacked and column layouts). */
  showProlong?: boolean
  /** stacked = icon above label; inline = stats + Detail on one row; column = stats above detail. */
  layout?: AdvertisementActionLayout
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
    label: 'Zobrazit detail',
    ariaLabel: 'Zobrazit detail inzerce',
    icon: 'external-link',
    testId: 'job-card-advertisement-detail-action',
  },
  prolong: {
    label: 'Prodloužit',
    ariaLabel: 'Prodloužit',
    icon: 'calendar-clock',
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
  layout = 'stacked',
  iconPosition = 'start',
  spacious = false,
  onClick,
}: {
  icon?: KnownIconName
  label: string
  ariaLabel: string
  testId: string
  tone?: 'default' | 'warning' | 'secondary'
  layout?: AdvertisementActionLayout
  iconPosition?: 'start' | 'end'
  spacious?: boolean
  onClick?: () => void
}) {
  const isWarning = tone === 'warning'
  const isSecondary = tone === 'secondary'
  const isCompact = layout === 'inline' || layout === 'column'
  const glyph = icon ? (
    <Icon
      name={icon}
      size={isCompact ? 16 : 20}
      className={
        testId === 'job-card-disappearance-prolong'
          ? undefined
          : 'tm-transition-transform group-hover:tm-scale-110'
      }
      aria-hidden
    />
  ) : null

  return (
    <Link
      underlined="never"
      variant={isCompact && !isSecondary ? 'primary' : 'secondary'}
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
        'tm-items-center',
        'tm-justify-center',
        testId === 'job-card-advertisement-detail-action' ? 'tm-font-normal' : 'tm-font-medium',
        'tm-no-underline',
        'hover:tm-no-underline',
        'tm-transition-colors',
        isCompact
          ? ['tm-flex-row', 'tm-gap-1', 'tm-px-0', 'tm-text-sm']
          : [
              'tm-flex-col',
              'tm-gap-0.5',
              spacious ? 'tm-px-6 tm-py-3 tm-rounded' : 'tm-px-5',
              'tm-text-[13px]',
              !spacious && 'last:tm-rounded-r-xl',
            ],
        isWarning
          ? [
              'tm-text-emotion-warning-emphasis',
              'hover:tm-bg-emotion-warning-background',
              'focus:tm-text-emotion-warning-emphasis',
            ]
          : isSecondary
            ? [
                'tm-text-secondary-default',
                'hover:tm-text-secondary-default',
                'focus:tm-text-secondary-default',
              ]
            : isCompact
              ? ['tm-text-action-link-default', 'focus:tm-text-action-link-hover']
              : [
                  'tm-text-action-link-secondary-default',
                  'hover:tm-bg-interactive-hover',
                  'hover:tm-text-action-link-secondary-hover',
                  'focus:tm-text-action-link-secondary-hover',
                ],
      )}
    >
      {iconPosition === 'start' ? glyph : null}
      {label}
      {iconPosition === 'end' ? glyph : null}
    </Link>
  )
}

function AdvertisementProlongButton({
  onClick,
  className,
}: {
  onClick?: () => void
  className?: string
}) {
  return (
    <Button
      variant="primary"
      size="small"
      aria-label={ACTION_CONFIG.prolong.ariaLabel}
      data-testid={ACTION_CONFIG.prolong.testId}
      className={cn('!tm-shrink-0', className)}
      onClick={(event) => {
        event.stopPropagation()
        onClick?.()
      }}
    >
      {ACTION_CONFIG.prolong.label}
    </Button>
  )
}

function AdvertisementActionDivider({ compact = false }: { compact?: boolean }) {
  return (
    <div
      role="separator"
      aria-hidden
      className={cn(
        'tm-border-0',
        'tm-border-l',
        'tm-border-solid',
        'tm-border-secondary',
        compact ? 'tm-mx-0.5 tm-h-3 tm-self-center' : 'tm-self-stretch',
      )}
    />
  )
}

/**
 * Right-side advertisement actions: statistics, Detail, optional Prodloužit, Náhled last.
 */
export function AdvertisementAction({
  viewCount,
  showProlong = false,
  layout = 'stacked',
  onStatistics,
  onDetail,
  onProlong,
  onPreview,
  className,
}: AdvertisementActionProps) {
  const formattedViews = viewCount === undefined ? undefined : formatCount(viewCount)
  const isInline = layout === 'inline'
  const isColumn = layout === 'column'
  const isCompact = isInline || isColumn
  const items = [
    formattedViews === undefined
      ? null
      : {
          key: 'statistics',
          icon: 'eye' as const,
          label: formattedViews,
          ariaLabel: `${formattedViews} zhlédnutí`,
          testId: 'job-card-advertisement-aggregate-views',
          iconPosition: 'start' as const,
          tone: isCompact ? ('secondary' as const) : undefined,
          onClick: onStatistics,
        },
    {
      key: 'detail',
      ...ACTION_CONFIG.detail,
      icon: isCompact ? undefined : ACTION_CONFIG.detail.icon,
      iconPosition: isInline ? ('end' as const) : ('start' as const),
      tone: 'secondary' as const,
      onClick: onDetail,
    },
    (isColumn || !isCompact) && showProlong
      ? { key: 'prolong', ...ACTION_CONFIG.prolong, onClick: onProlong }
      : null,
    !isCompact ? { key: 'preview', ...ACTION_CONFIG.preview, onClick: onPreview } : null,
  ].filter((item): item is NonNullable<typeof item> => item !== null)
  const mainItems = items.filter((item) => item.key !== 'prolong')
  const prolongItem = items.find((item) => item.key === 'prolong')
  const compactChrome = [
    'tm-rounded',
    'tm-px-1.5',
    'tm-py-1',
    'tm-transition-colors',
    'hover:tm-bg-interactive-hover',
    'active:tm-bg-interactive-active',
  ] as const

  const renderItem = (
    item: (typeof items)[number],
    itemLayout: AdvertisementActionLayout = layout,
    spacious = false,
  ) => {
    if (item.key === 'prolong') {
      return (
        <AdvertisementProlongButton
          onClick={item.onClick}
          className={
            spacious ? '!tm-min-h-8 !tm-px-4' : 'tm-self-center tm-mx-1 last:tm-rounded-r-xl'
          }
        />
      )
    }

    return (
      <AdvertisementActionItem
        icon={item.icon}
        label={item.label}
        ariaLabel={item.ariaLabel}
        testId={item.testId}
        tone={'tone' in item ? item.tone : 'default'}
        layout={itemLayout}
        iconPosition={'iconPosition' in item ? item.iconPosition : 'start'}
        spacious={spacious}
        onClick={item.onClick}
      />
    )
  }

  if (isColumn) {
    return (
      <div
        data-testid="job-card-advertisement-action"
        data-layout={layout}
        className={cn('tm-flex tm-shrink-0 tm-items-center tm-gap-3', className)}
      >
        {prolongItem ? renderItem(prolongItem, 'stacked', true) : null}
        <div
          data-testid="job-card-advertisement-action-main"
          className={cn('tm-flex tm-flex-col tm-items-start tm-gap-0.5', compactChrome)}
        >
          {mainItems.map((item) => (
            <Fragment key={item.key}>{renderItem(item)}</Fragment>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div
      data-testid="job-card-advertisement-action"
      data-layout={layout}
      className={cn(
        'tm-flex tm-shrink-0 tm-items-center',
        isInline && compactChrome,
        className,
      )}
    >
      {items.map((item, index) => (
        <Fragment key={item.key}>
          {index > 0 ? <AdvertisementActionDivider compact={isInline} /> : null}
          {renderItem(item)}
        </Fragment>
      ))}
    </div>
  )
}

AdvertisementAction.displayName = 'AdvertisementAction'
