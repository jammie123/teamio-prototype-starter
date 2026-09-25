import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Bell,
  Briefcase,
  Calendar,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronsLeft,
  ChevronsRight,
  CircleHelp,
  CirclePlus,
  Database,
  Download,
  EllipsisVertical,
  ExternalLink,
  Eye,
  FileText,
  Home,
  Info,
  Mail,
  Maximize2,
  Menu,
  Pencil,
  Plus,
  Search,
  Trash2,
  User,
  X,
  type LucideIcon,
} from 'lucide-react'
import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'
import { OpalIcon } from './customIcons'

const iconMap = {
  plus: Plus,
  'plus-circle': CirclePlus,
  check: Check,
  x: X,
  search: Search,
  info: Info,
  warning: AlertTriangle,
  eye: Eye,
  'external-link': ExternalLink,
  download: Download,
  'arrow-left': ArrowLeft,
  'arrow-right': ArrowRight,
  'chevron-left': ChevronLeft,
  'chevron-right': ChevronRight,
  'chevron-up': ChevronUp,
  'chevron-down': ChevronDown,
  'chevrons-left': ChevronsLeft,
  'chevrons-right': ChevronsRight,
  trash: Trash2,
  edit: Pencil,
  menu: Menu,
  'more-vertical': EllipsisVertical,
  home: Home,
  'file-text': FileText,
  user: User,
  briefcase: Briefcase,
  database: Database,
  calendar: Calendar,
  'bar-chart': BarChart3,
  mail: Mail,
  notification: Bell,
  maximize: Maximize2,
} as const satisfies Record<string, LucideIcon>

const customIconMap = {
  opal: OpalIcon,
} as const satisfies Record<string, LucideIcon>

export type KnownIconName = keyof typeof iconMap | keyof typeof customIconMap
export type IconName = KnownIconName | (string & {})

export interface IconProps extends StyleProps, Omit<HTMLAttributes<HTMLSpanElement>, 'color'> {
  name: IconName
  title?: string
  strokeWidth?: number
}

const FALLBACK_ICON = CircleHelp

function resolveIcon(name: IconName): {
  Icon: LucideIcon
  isFallback: boolean
  variant: 'stroke' | 'fill'
} {
  if (Object.prototype.hasOwnProperty.call(customIconMap, name)) {
    return {
      Icon: customIconMap[name as keyof typeof customIconMap],
      isFallback: false,
      variant: 'fill',
    }
  }
  if (Object.prototype.hasOwnProperty.call(iconMap, name)) {
    return { Icon: iconMap[name as keyof typeof iconMap], isFallback: false, variant: 'stroke' }
  }
  return { Icon: FALLBACK_ICON, isFallback: true, variant: 'stroke' }
}

export const Icon = forwardRef<HTMLSpanElement, IconProps>(function Icon(
  { name, className, title, strokeWidth, ...rest },
  ref,
) {
  const { Icon: SvgIcon, isFallback, variant } = resolveIcon(name)

  return (
    <span
      ref={ref}
      data-testid="icon"
      data-icon-name={name}
      data-icon-fallback={isFallback ? 'true' : undefined}
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      className={cn('tm-inline-flex', 'tm-items-center', 'tm-leading-none', className)}
      {...rest}
    >
      {'\u200B'}
      <SvgIcon
        aria-hidden="true"
        className={cn(
          'tm-inline-block',
          'tm-h-[1em]',
          'tm-w-[1em]',
          variant === 'fill' ? 'tm-fill-current' : 'tm-stroke-current',
        )}
        focusable="false"
        strokeWidth={variant === 'fill' ? undefined : strokeWidth}
      />
    </span>
  )
})

Icon.displayName = 'Icon'
