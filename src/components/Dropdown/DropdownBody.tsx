import { FloatingFocusManager, FloatingList } from '@floating-ui/react'
import { useContext, type HTMLAttributes } from 'react'
import { cn } from '../../lib/cn'
import type { ChildrenProps, StyleProps } from '../../lib/types'
import { DropdownContext } from './DropdownContext'

export interface DropdownBodyProps
  extends StyleProps,
    ChildrenProps,
    Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  overflow?: 'scrollY' | 'visible'
  /** Skip moving focus into the panel. Use for hover cards so inner tooltips do not open. */
  initialFocus?: -1 | 0
}

export function DropdownBody({
  overflow,
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

  return (
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
          'tm-z-50',
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
}

DropdownBody.displayName = 'DropdownBody'
