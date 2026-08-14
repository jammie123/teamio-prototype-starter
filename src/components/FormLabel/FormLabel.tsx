import type { ElementType, ReactNode } from 'react'
import { cn } from '../../lib/cn'
import type { StyleProps } from '../../lib/types'
import { useFormGroupContext } from '../FormGroup/FormGroupContext'

export interface FormLabelProps extends StyleProps {
  as?: ElementType
  isRequired?: boolean
  htmlFor?: string
  children?: ReactNode
  className?: string
}

export function FormLabel({
  as: Element = 'label',
  isRequired,
  htmlFor,
  children,
  className,
}: FormLabelProps) {
  const context = useFormGroupContext()
  const required = isRequired ?? context?.isRequired ?? false
  const forId = htmlFor ?? context?.controlId

  return (
    <Element
      {...(Element === 'label' ? { htmlFor: forId } : {})}
      className={cn(
        '!tm-text-sm',
        '!tm-font-medium',
        'tm-my-0',
        required && 'after:tm-ml-[.2em] after:tm-text-emotion-danger-active after:tm-content-["*"]',
        className,
      )}
    >
      {children}
    </Element>
  )
}
