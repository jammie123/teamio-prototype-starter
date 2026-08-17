import {
  autoUpdate,
  flip,
  hide,
  offset,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useHover,
  useInteractions,
  useListNavigation,
  safePolygon,
  type Placement,
  type Strategy,
} from '@floating-ui/react'
import {
  useCallback,
  useMemo,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from 'react'
import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'
import { DropdownContext, type DropdownContextProps } from './DropdownContext'

export interface DropdownProps
  extends StyleProps,
    Omit<HTMLAttributes<HTMLDetailsElement>, 'children'> {
  isOpen?: boolean
  onOpenChange?: (isOpen: boolean) => void
  autoClose?: boolean
  openOnHover?: boolean
  hoverDelay?: number
  placement?: Placement
  strategy?: Strategy
  floatingOptions?: { hide?: Record<string, unknown> }
  children: ((context: DropdownContextProps) => ReactNode) | ReactNode
}

export function Dropdown({
  isOpen: controlledIsOpen,
  onOpenChange,
  autoClose = true,
  openOnHover = false,
  hoverDelay = 150,
  placement: preferredPlacement = 'bottom-start',
  strategy: positionStrategy = 'absolute',
  floatingOptions,
  className,
  children,
  ...rest
}: DropdownProps) {
  const [uncontrolledIsOpen, setUncontrolledIsOpen] = useState(false)
  const isControlled = controlledIsOpen !== undefined
  const isOpen = isControlled ? controlledIsOpen : uncontrolledIsOpen

  const setOpen = useCallback(
    (value: boolean | ((prevState: boolean) => boolean)) => {
      const newValue = typeof value === 'function' ? value(isOpen) : value

      if (!isControlled) {
        setUncontrolledIsOpen(newValue)
      }

      onOpenChange?.(newValue)
    },
    [isControlled, isOpen, onOpenChange],
  )

  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const floatingProps = useFloating({
    open: isOpen,
    onOpenChange: setOpen,
    placement: preferredPlacement,
    strategy: positionStrategy,
    whileElementsMounted: autoUpdate,
    middleware: [
      offset({ mainAxis: 8, alignmentAxis: -8 }),
      shift({ crossAxis: true }),
      flip(),
      floatingOptions?.hide ? hide({ ...floatingOptions.hide }) : null,
    ],
  })

  const floatingContext = floatingProps.context
  const elementsRef = useRef<(HTMLElement | null)[]>([])

  const listNav = useListNavigation(floatingContext, {
    activeIndex,
    listRef: elementsRef,
    openOnArrowKeyDown: false,
    onNavigate: setActiveIndex,
  })

  const click = useClick(floatingContext)
  const dismiss = useDismiss(floatingContext)
  const hover = useHover(floatingContext, {
    enabled: openOnHover,
    delay: { open: hoverDelay },
    handleClose: safePolygon(),
  })

  const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions([
    listNav,
    click,
    dismiss,
    hover,
  ])

  const onSelect = useCallback(() => {
    if (autoClose) {
      setOpen(false)
    }
  }, [autoClose, setOpen])

  const dropdownContext = useMemo(
    () => ({
      isOpen,
      setOpen,
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
      setOpen,
      activeIndex,
      onSelect,
      getReferenceProps,
      getFloatingProps,
      getItemProps,
      floatingProps,
    ],
  )

  return (
    <details
      open={isOpen}
      data-testid="dropdown"
      className={cn('tm-relative', 'tm-inline-block', className)}
      {...rest}
    >
      <DropdownContext.Provider value={dropdownContext}>
        {typeof children === 'function' ? children(dropdownContext) : children}
      </DropdownContext.Provider>
    </details>
  )
}

Dropdown.displayName = 'Dropdown'
