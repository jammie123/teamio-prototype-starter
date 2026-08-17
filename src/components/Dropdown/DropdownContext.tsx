import {
  createContext,
  type Dispatch,
  type MutableRefObject,
  type SetStateAction,
} from 'react'
import type { UseFloatingReturn, useInteractions } from '@floating-ui/react'

export interface DropdownContextProps {
  isOpen: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  activeIndex: number | null
  setActiveIndex: Dispatch<SetStateAction<number | null>>
  getItemProps: ReturnType<typeof useInteractions>['getItemProps']
  onSelect: (index: number | null) => void
  elementsRef: MutableRefObject<(HTMLElement | null)[]>
  getReferenceProps: (userProps?: React.HTMLProps<HTMLElement>) => Record<string, unknown>
  getFloatingProps: (userProps?: React.HTMLProps<HTMLElement>) => Record<string, unknown>
  floatingProps: UseFloatingReturn
}

export const DropdownContext = createContext<DropdownContextProps>({
  getItemProps: () => ({}),
} as DropdownContextProps)
