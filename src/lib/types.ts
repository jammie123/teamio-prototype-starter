import type { ReactNode } from 'react'

export interface StyleProps {
  className?: string
}

export interface ChildrenProps {
  children?: ReactNode
}

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'danger'
export type ButtonSize = 'small' | 'medium' | 'large'
export type LinkVariant = 'primary' | 'secondary'
export type LinkUnderline = 'hover' | 'never'
export type LinkTarget = '_blank' | '_self' | '_parent' | '_top'

export type TypographyVariant = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body' | 'caption'
export type TypographyElement =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'p'
  | 'span'
  | 'div'
  | 'label'
  | 'strong'
  | 'em'

export type CardElement = 'section' | 'article' | 'div'

export type ValidationState = 'default' | 'success' | 'warning' | 'error'
export type InputSize = 'small' | 'medium'
export type AlertVariant = 'info' | 'success' | 'warning' | 'error'
export type SkeletonVariant = 'light' | 'dark'
