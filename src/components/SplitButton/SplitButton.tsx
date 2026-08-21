import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import type { ButtonSize, StyleProps } from '../../lib/types'
import { Button } from '../Button'
import { Dropdown, DropdownBody, DropdownToggle } from '../Dropdown'
import { Icon } from '../Icon'
import { OptionList } from '../OptionList'
import {
  splitButtonChevronClass,
  splitButtonChevronExtras,
  splitButtonClass,
  splitButtonDropdownClass,
  splitButtonMainClass,
} from './splitButtonClass'

export interface SplitButtonProps
  extends StyleProps,
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'color' | 'children'> {
  label: ReactNode
  variant?: 'primary' | 'secondary'
  size?: ButtonSize
  isDisabled?: boolean
  menuLabel?: string
  children: ReactNode
}

export const SplitButton = forwardRef<HTMLButtonElement, SplitButtonProps>(
  function SplitButton(
    {
      label,
      variant = 'primary',
      size = 'medium',
      isDisabled = false,
      menuLabel = 'Další možnosti',
      children,
      className,
      type = 'button',
      disabled,
      ...rest
    },
    ref,
  ) {
    const inactive = isDisabled || Boolean(disabled)
    const chevronClass = splitButtonChevronClass({
      variant,
      size,
      isDisabled: inactive,
    })

    return (
      <div data-testid="split-button" className={splitButtonClass(className)}>
        <Button
          ref={ref}
          type={type}
          variant={variant}
          size={size}
          isDisabled={inactive}
          className={splitButtonMainClass()}
          {...rest}
        >
          {label}
        </Button>
        {inactive ? (
          <Button
            type="button"
            variant={variant}
            size={size}
            isDisabled
            aria-label={menuLabel}
            className={splitButtonChevronExtras()}
          >
            <Icon name="chevron-down" className="tm-text-[1em]" />
          </Button>
        ) : (
          <Dropdown placement="bottom-end" className={splitButtonDropdownClass()}>
            <DropdownToggle
              variant="custom"
              aria-label={menuLabel}
              aria-haspopup="menu"
              className={chevronClass}
            >
              <Icon name="chevron-down" className="tm-text-[1em]" />
            </DropdownToggle>
            <DropdownBody>
              <OptionList>{children}</OptionList>
            </DropdownBody>
          </Dropdown>
        )}
      </div>
    )
  },
)

SplitButton.displayName = 'SplitButton'
