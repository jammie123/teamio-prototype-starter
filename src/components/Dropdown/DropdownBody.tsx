import { FloatingFocusManager, FloatingList } from '@floating-ui/react'
import { useContext, type HTMLAttributes, type RefObject } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '../../lib/cn'
import type { ChildrenProps, StyleProps } from '../../lib/types'
import { DropdownContext } from './DropdownContext'

export interface DropdownBodyProps
  extends StyleProps,
    ChildrenProps,
    Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  overflow?: 'scrollY' | 'visible'
  /** Render the panel into this element (e.g. modal content) to escape `overflow: hidden` without leaving the dialog focus/pointer stack. */
  portalContainerRef?: RefObject<HTMLElement | null>
  /** Skip moving focus into the panel. Use for hover cards so inner tooltips do not open. */
  initialFocus?: -1 | 0
}

export function DropdownBody({
  overflow,
  portalContainerRef,
  initialFocus,
  children,
  className,
  ...rest
}: DropdownBodyProps) {
  const { isOpen, elementsRef, getFloatingProps, floatingProps } = useContext(DropdownContext)
  const { x, y, placement, strategy, refs, context } = floatingProps

  if (!isOpen) {
    return null
  }

  const panel = (
    <FloatingFocusManager
      context={context}
      modal={false}
      initialFocus={initialFocus}
      returnFocus={initialFocus !== -1}
    >
      <div
        ref={refs.setFloating}
        data-testid="dropdown-body"
        className={cn(
          'tm-absolute',
          'tm-top-full',
          portalContainerRef ? 'tm-z-[60]' : 'tm-z-50',
          'tm-w-max',
          'tm-min-w-[5rem]',
          'tm-max-w-[20rem]',
          'tm-rounded',
          'tm-bg-basic',
          'tm-p-2',
          'tm-border',
          'tm-border-primary',
          'tm-shadow',
          'tm-outline-none',
          'tm-cursor-default',
          // A submenu has to escape the panel, so clipping is opt-out.
          overflow === 'visible'
            ? 'tm-overflow-visible'
            : cn(
                'tm-overflow-x-hidden',
                'tm-overflow-y-auto',
                'tm-scrollbar-y',
                'tm-overscroll-contain',
              ),
          overflow === 'scrollY' ? 'tm-max-h-[14.5rem]' : 'tm-max-h-screen',
          floatingProps.middlewareData?.hide?.referenceHidden && 'tm-invisible',
          className,
        )}
        data-placement={placement}
        style={{
          position: strategy,
          top: y ?? 0,
          left: x ?? 0,
        }}
        {...getFloatingProps()}
        {...rest}
      >
        <FloatingList elementsRef={elementsRef}>{children}</FloatingList>
      </div>
    </FloatingFocusManager>
  )

  const portalContainer = portalContainerRef?.current
  return portalContainer ? createPortal(panel, portalContainer) : panel
}

DropdownBody.displayName = 'DropdownBody'
