import {
  FloatingList,
  autoUpdate,
  flip,
  offset,
  safePolygon,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useHover,
  useInteractions,
  useListItem,
  useListNavigation,
  useMergeRefs,
} from '@floating-ui/react'
import {
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type HTMLProps,
  type ReactNode,
} from 'react'
import { cn } from '../../lib/cn'
import type { ChildrenProps, StyleProps } from '../../lib/types'
import { DropdownContext, type DropdownContextProps } from '../Dropdown/DropdownContext'
import { Icon } from '../Icon'
import { Pill } from '../Pill'
import { OptionContent } from './Option'
import { optionClass, type OptionColor } from './optionClass'

export interface OptionSubmenuProps extends StyleProps, ChildrenProps {
  label: ReactNode
  description?: ReactNode
  count?: number
  color?: OptionColor
  isDisabled?: boolean
  hoverDelay?: number
}

const SUBMENU_BODY_CLASS = cn(
  'tm-absolute',
  'tm-z-50',
  'tm-w-max',
  'tm-min-w-[9rem]',
  'tm-max-w-[20rem]',
  'tm-rounded',
  'tm-bg-basic',
  'tm-p-2',
  'tm-border',
  'tm-border-primary',
  'tm-shadow',
  'tm-outline-none',
  'tm-cursor-default',
)

export function OptionSubmenu({
  label,
  description,
  count,
  color = 'primary',
  isDisabled = false,
  hoverDelay = 100,
  children,
  className,
}: OptionSubmenuProps) {
  const parent = useContext(DropdownContext)
  const { ref: listItemRef, index } = useListItem()
  const isActive = parent.activeIndex === index

  const [isOpen, setIsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const elementsRef = useRef<(HTMLElement | null)[]>([])

  const floatingProps = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: 'right-start',
    whileElementsMounted: autoUpdate,
    middleware: [
      offset({ mainAxis: 6, alignmentAxis: -8 }),
      flip({ fallbackPlacements: ['left-start'] }),
      shift({ crossAxis: true }),
    ],
  })
  const { context, x, y, strategy, refs } = floatingProps

  const hover = useHover(context, {
    enabled: !isDisabled,
    delay: { open: hoverDelay },
    handleClose: safePolygon(),
  })
  // Toggling on click would fight the hover intent that already opened the panel.
  const click = useClick(context, { enabled: !isDisabled, toggle: false })
  const dismiss = useDismiss(context, { bubbles: false })
  const listNav = useListNavigation(context, {
    activeIndex,
    listRef: elementsRef,
    onNavigate: setActiveIndex,
    nested: true,
  })

  const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions([
    hover,
    click,
    dismiss,
    listNav,
  ])

  const triggerRef = useMergeRefs([listItemRef, refs.setReference])

  // Picking a nested action closes the submenu and lets the parent menu decide
  // whether it stays open (autoClose).
  const onSelect = useCallback(() => {
    setIsOpen(false)
    parent.onSelect(index)
  }, [index, parent])

  const submenuContext = useMemo<DropdownContextProps>(
    () => ({
      isOpen,
      setOpen: setIsOpen,
      activeIndex,
      setActiveIndex,
      onSelect,
      getReferenceProps,
      getFloatingProps,
      getItemProps,
      elementsRef,
      floatingProps,
    }),
    [
      isOpen,
      activeIndex,
      onSelect,
      getReferenceProps,
      getFloatingProps,
      getItemProps,
      floatingProps,
    ],
  )

  const hasDescription = description !== undefined && description !== null && description !== false

  return (
    <div role="group" className={cn('tm-relative', 'tm-flex', 'tm-w-full', className)}>
      <button
        type="button"
        ref={triggerRef}
        role="option"
        aria-selected={false}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={
          typeof label === 'string' && count !== undefined ? `${label}, ${count}` : undefined
        }
        tabIndex={isActive ? 0 : -1}
        disabled={isDisabled}
        data-testid="option-submenu-toggle"
        className={optionClass({ color, isDisabled, isSelected: isOpen, hasDescription })}
        {...getReferenceProps(parent.getItemProps() as HTMLProps<HTMLButtonElement>)}
      >
        <span className="tm-min-w-0 tm-flex-1">
          <OptionContent color={color} description={description}>
            {label}
          </OptionContent>
        </span>
        {count !== undefined ? (
          <Pill
            color="tertiary"
            data-testid="option-submenu-count"
            aria-hidden="true"
            className="tm-flex-none tm-tabular-nums"
          >
            {count}
          </Pill>
        ) : null}
        <Icon name="chevron-right" className="tm-flex-none tm-text-base" />
      </button>

      {isOpen ? (
        <div
          ref={refs.setFloating}
          data-testid="option-submenu-body"
          className={SUBMENU_BODY_CLASS}
          data-placement={context.placement}
          style={{ position: strategy, top: y ?? 0, left: x ?? 0 }}
          {...getFloatingProps()}
        >
          <DropdownContext.Provider value={submenuContext}>
            <FloatingList elementsRef={elementsRef}>{children}</FloatingList>
          </DropdownContext.Provider>
        </div>
      ) : null}
    </div>
  )
}

OptionSubmenu.displayName = 'OptionSubmenu'
